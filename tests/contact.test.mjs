import { test } from "node:test";
import assert from "node:assert/strict";
import {
    handleContact,
    createMemoryStore,
    createUpstashStore,
    createContactStore,
    withFallback,
    getClientIp,
    checkFillTime,
    duplicateKey,
    escapeHtml,
    validateContact,
    LIMITS,
    RATE_LIMITS,
} from "../lib/contact.mjs";

const TOKEN = "123456:TEST-TOKEN";
const env = { TELEGRAM_BOT_TOKEN: TOKEN, TELEGRAM_CHAT_ID: "987654321" };
const fixedNow = () => new Date("2026-10-21T13:30:00Z"); // 20:00 in Asia/Yangon

function mockFetch(response = { ok: true, status: 200, json: async () => ({ ok: true }) }) {
    const calls = [];
    const fn = async (url, init) => {
        calls.push({ url, init, payload: JSON.parse(init.body) });
        return response;
    };
    fn.calls = calls;
    return fn;
}
function silentLog() {
    const lines = [];
    return { lines, error: (...a) => lines.push(a.join(" ")) };
}
const deps = (over = {}) => ({ env, fetch: mockFetch(), store: createMemoryStore(), now: fixedNow, log: silentLog(), ...over });
// startedAt/submittedAt: the hidden fill-time fields (client clock), 8 s apart.
const timing = { startedAt: 1_700_000_000_000, submittedAt: 1_700_000_008_000 };
const valid = { name: "Aung Aung", email: "aung@example.com", message: "Hello Htet, let's work together.", ...timing };
let counter = 0;
const unique = (extra = {}) => ({ ...valid, message: `Hello Htet, message #${++counter}`, ...extra });
/** A controllable clock; advance with clock.tick(ms). */
function makeClock(start = Date.parse("2026-10-21T13:30:00Z")) {
    let t = start;
    const now = () => new Date(t);
    now.tick = (ms) => (t += ms);
    return now;
}

test("sends exactly one Telegram sendMessage call with the right payload", async () => {
    const d = deps();
    const res = await handleContact(valid, "1.1.1.1", d);
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(d.fetch.calls.length, 1);
    const { url, init, payload } = d.fetch.calls[0];
    assert.equal(url, `https://api.telegram.org/bot${TOKEN}/sendMessage`);
    assert.equal(init.method, "POST");
    assert.equal(init.headers["Content-Type"], "application/json");
    assert.deepEqual(Object.keys(payload).sort(), ["chat_id", "disable_web_page_preview", "parse_mode", "text"]);
    assert.equal(payload.chat_id, "987654321");
    assert.equal(payload.parse_mode, "HTML");
    assert.equal(payload.disable_web_page_preview, true);
    assert.match(payload.text, /<b>Name:<\/b> Aung Aung/);
    assert.match(payload.text, /<b>Email:<\/b> aung@example\.com/);
    assert.match(payload.text, /<b>Time:<\/b> 21 Oct 2026, 20:00 \(Asia\/Yangon\)/);
    assert.match(payload.text, /Hello Htet, let's work together\.$/);
});

test("HTML-escapes &, < and > in every user field", async () => {
    const d = deps();
    await handleContact({ name: "<b>Eve</b> & co", email: "eve@example.com", message: '<a href="x">hi</a> & <script>', ...timing }, "1.1.1.2", d);
    const { text } = d.fetch.calls[0].payload;
    assert.match(text, /<b>Name:<\/b> &lt;b&gt;Eve&lt;\/b&gt; &amp; co/);
    assert.match(text, /&lt;a href="x"&gt;hi&lt;\/a&gt; &amp; &lt;script&gt;$/);
    assert.ok(!text.includes("<script>"));
    assert.ok(!text.includes("<a "));
    assert.equal(escapeHtml("a&b<c>d"), "a&amp;b&lt;c&gt;d");
});

test("validation errors return 400 and never call Telegram", async () => {
    const d = deps();
    const res = await handleContact({ name: "", email: "not-an-email", message: "x".repeat(LIMITS.message + 1), ...timing }, "1.1.1.3", d);
    assert.equal(res.status, 400);
    assert.equal(res.body.ok, false);
    assert.deepEqual(Object.keys(res.body.errors).sort(), ["email", "message", "name"]);
    assert.equal(d.fetch.calls.length, 0);
    assert.equal(validateContact({ name: "a".repeat(101), email: "a@b.co", message: "m" }).errors.name.includes("100"), true);
    assert.equal(validateContact(null).ok, false);
});

test("honeypot submissions get a fake success and no Telegram call", async () => {
    const d = deps();
    const res = await handleContact({ ...valid, website: "http://spam.example" }, "1.1.1.4", d);
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    assert.equal(d.fetch.calls.length, 0);
});

test("missing env vars return 503 without calling Telegram, and don't burn the duplicate check", async () => {
    const d = deps({ env: {}, now: makeClock() });
    const res = await handleContact(valid, "1.1.1.5", d);
    assert.equal(res.status, 503);
    assert.equal(res.body.ok, false);
    assert.equal(d.fetch.calls.length, 0);
    assert.ok(d.log.lines.every((l) => !l.includes(TOKEN)));
    d.now.tick(31_000);
    assert.equal((await handleContact(valid, "1.1.1.5", d)).status, 503); // not 409
});

test("Telegram failure returns 502 and the token is never logged", async () => {
    const log = silentLog();
    const d = deps({ log, fetch: mockFetch({ ok: false, status: 401, json: async () => ({ description: "Unauthorized" }) }) });
    const res = await handleContact(valid, "1.1.1.6", d);
    assert.equal(res.status, 502);
    assert.equal(res.body.ok, false);
    assert.ok(log.lines.length > 0);
    assert.ok(log.lines.every((l) => !l.includes(TOKEN) && !l.includes("api.telegram.org")));

    const log2 = silentLog();
    const throwing = async () => { throw new TypeError(`fetch failed for https://api.telegram.org/bot${TOKEN}/sendMessage`); };
    const res2 = await handleContact(valid, "1.1.1.7", deps({ log: log2, fetch: throwing }));
    assert.equal(res2.status, 502);
    assert.ok(log2.lines.every((l) => !l.includes(TOKEN)));
});

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

test("burst limit: a second message from the same IP within 30 s gets 429 with Retry-After", async () => {
    const d = deps({ now: makeClock() });
    assert.equal((await handleContact(unique(), "2.2.2.2", d)).status, 200);
    d.now.tick(10_000);
    const blocked = await handleContact(unique(), "2.2.2.2", d);
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers["Retry-After"], "20");
    assert.equal(blocked.body.retryAfter, 20);
    assert.match(blocked.body.error, /20 seconds/);
    // Other IPs are unaffected, and the same IP is fine once the 30 s pass.
    assert.equal((await handleContact(unique(), "3.3.3.3", d)).status, 200);
    d.now.tick(20_000);
    assert.equal((await handleContact(unique(), "2.2.2.2", d)).status, 200);
    assert.equal(d.fetch.calls.length, 3);
});

test("per-IP sliding window: 6th message within 10 minutes gets 429 until the oldest expires", async () => {
    const d = deps({ now: makeClock() });
    for (let i = 0; i < 5; i++) {
        assert.equal((await handleContact(unique(), "9.9.9.9", d)).status, 200, `message ${i + 1}`);
        d.now.tick(31_000);
    }
    // 5 * 31 s = 155 s since the first message; it leaves the window at 600 s.
    const blocked = await handleContact(unique(), "9.9.9.9", d);
    assert.equal(blocked.status, 429);
    assert.equal(Number(blocked.headers["Retry-After"]), 600 - 155);
    assert.match(blocked.body.error, /8 minutes/);
    d.now.tick((600 - 155) * 1000);
    assert.equal((await handleContact(unique(), "9.9.9.9", d)).status, 200);
});

test("blocked requests don't extend the window", async () => {
    const d = deps({ now: makeClock() });
    assert.equal((await handleContact(unique(), "4.4.4.4", d)).status, 200);
    for (let i = 0; i < 5; i++) {
        d.now.tick(5_000);
        assert.equal((await handleContact(unique(), "4.4.4.4", d)).status, 429);
    }
    d.now.tick(5_000); // 30 s after the first, accepted
    assert.equal((await handleContact(unique(), "4.4.4.4", d)).status, 200);
});

test("global cap: 31st message in an hour from any IPs gets 429", async () => {
    const d = deps({ now: makeClock() });
    for (let i = 0; i < RATE_LIMITS.global.max; i++) {
        assert.equal((await handleContact(unique(), `10.0.0.${i}`, d)).status, 200);
        d.now.tick(1_000);
    }
    const blocked = await handleContact(unique(), "10.0.1.1", d);
    assert.equal(blocked.status, 429);
    assert.match(blocked.body.error, /a lot of messages/);
    assert.equal(Number(blocked.headers["Retry-After"]), 3600 - 30);
    assert.equal(d.fetch.calls.length, RATE_LIMITS.global.max);
});

test("invalid, too-fast and honeypot submissions don't count toward the limits", async () => {
    const d = deps({ now: makeClock() });
    for (let i = 0; i < 10; i++) await handleContact({ ...valid, email: "bad" }, "5.5.5.5", d);
    for (let i = 0; i < 10; i++) await handleContact({ ...valid, website: "x" }, "5.5.5.5", d);
    for (let i = 0; i < 10; i++) await handleContact({ ...valid, submittedAt: valid.startedAt + 500 }, "5.5.5.5", d);
    assert.equal((await handleContact(unique(), "5.5.5.5", d)).status, 200);
});

test("memory store cleans up stale entries", async () => {
    const store = createMemoryStore({ sweepEveryMs: 1_000 });
    const rule = (k) => [{ name: "ip", key: k, max: 1, windowMs: 10_000 }];
    for (let i = 0; i < 50; i++) await store.hit(rule(`k${i}`), 0);
    await store.claim("dup", 5_000, 0);
    assert.deepEqual(store.size(), { windows: 50, claims: 1 });
    await store.hit(rule("fresh"), 20_000); // triggers a sweep
    assert.deepEqual(store.size(), { windows: 1, claims: 0 });
});

test("memory store caps the number of keys", async () => {
    const store = createMemoryStore({ maxKeys: 100, sweepEveryMs: 1e9 });
    for (let i = 0; i < 500; i++) await store.hit([{ name: "ip", key: `k${i}`, max: 5, windowMs: 60_000 }], 1_000 + i);
    assert.ok(store.size().windows <= 101);
});

// ---------------------------------------------------------------------------
// Fill time and duplicates
// ---------------------------------------------------------------------------

test("fill-time check: missing or < 3 s submissions are rejected without calling Telegram", async () => {
    const d = deps({ now: makeClock() });
    const fast = await handleContact({ ...valid, submittedAt: valid.startedAt + 2_999 }, "6.6.6.6", d);
    assert.equal(fast.status, 400);
    assert.match(fast.body.error, /wait a few seconds/);
    const missing = await handleContact({ name: "A", email: "a@b.co", message: "hi" }, "6.6.6.6", d);
    assert.equal(missing.status, 400);
    assert.equal(d.fetch.calls.length, 0);
    assert.equal(checkFillTime({ startedAt: 1000, submittedAt: 4000 }).ok, true);
    assert.equal(checkFillTime({ startedAt: "abc", submittedAt: 4000 }).ok, false);
    assert.equal(checkFillTime({ startedAt: 0, submittedAt: 4000 }).ok, false);
});

test("duplicate identical messages within 10 minutes get 409", async () => {
    const d = deps({ now: makeClock() });
    const msg = { ...valid, message: "Duplicate   please\nIGNORE" };
    assert.equal((await handleContact(msg, "7.7.7.1", d)).status, 200);
    d.now.tick(60_000);
    const dup = await handleContact({ ...msg, message: "duplicate please ignore" }, "7.7.7.2", d);
    assert.equal(dup.status, 409);
    assert.equal(d.fetch.calls.length, 1);
    d.now.tick(10 * 60_000);
    assert.equal((await handleContact(msg, "7.7.7.3", d)).status, 200);
    assert.equal(duplicateKey("A  b"), duplicateKey(" a b "));
});

test("a failed Telegram send releases the duplicate check so the user can retry", async () => {
    const now = makeClock();
    const store = createMemoryStore();
    const failing = deps({ now, store, fetch: mockFetch({ ok: false, status: 500, json: async () => ({}) }) });
    assert.equal((await handleContact(valid, "7.7.8.1", failing)).status, 502);
    now.tick(31_000);
    assert.equal((await handleContact(valid, "7.7.8.1", deps({ now, store }))).status, 200);
});

// ---------------------------------------------------------------------------
// Client IP
// ---------------------------------------------------------------------------

test("getClientIp uses the first x-forwarded-for entry, then x-real-ip", () => {
    assert.equal(getClientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1, 10.0.0.2" })), "203.0.113.7");
    assert.equal(getClientIp(new Headers({ "x-forwarded-for": " 203.0.113.7:51234 " })), "203.0.113.7");
    assert.equal(getClientIp(new Headers({ "x-forwarded-for": "[2001:DB8::1]:443" })), "2001:db8::1");
    assert.equal(getClientIp(new Headers({ "x-forwarded-for": "2001:db8::2" })), "2001:db8::2");
    assert.equal(getClientIp(new Headers({ "x-real-ip": "198.51.100.4" })), "198.51.100.4");
    assert.equal(getClientIp(new Headers({ "x-forwarded-for": "not an ip", "x-real-ip": "198.51.100.5" })), "198.51.100.5");
    assert.equal(getClientIp(new Headers()), "unknown");
    assert.equal(getClientIp({ "x-real-ip": "198.51.100.6" }), "198.51.100.6");
});

// ---------------------------------------------------------------------------
// Upstash store (mocked REST API)
// ---------------------------------------------------------------------------

function upstashMock(handler) {
    const calls = [];
    const fn = async (url, init) => {
        const args = JSON.parse(init.body);
        calls.push({ url, init, args });
        const result = handler(args);
        return { ok: true, status: 200, json: async () => ({ result }) };
    };
    fn.calls = calls;
    return fn;
}

test("Upstash store sends EVAL / SET NX PX / DEL over REST with the bearer token", async () => {
    const f = upstashMock((args) => (args[0] === "EVAL" ? [0, 12_345, 2] : args[0] === "SET" ? "OK" : 1));
    const store = createUpstashStore({ url: "https://example.upstash.io/", token: "redis-token", fetch: f });
    const rules = [
        { name: "burst", key: "k:burst", max: 1, windowMs: 30_000 },
        { name: "ip", key: "k:ip", max: 5, windowMs: 600_000 },
    ];
    const r = await store.hit(rules, 1_000);
    assert.deepEqual(r, { allowed: false, retryAfterMs: 12_345, blockedBy: "ip" });
    const evalCall = f.calls[0];
    assert.equal(evalCall.url, "https://example.upstash.io");
    assert.equal(evalCall.init.headers.Authorization, "Bearer redis-token");
    assert.equal(evalCall.args[0], "EVAL");
    assert.deepEqual(evalCall.args.slice(2, 6), ["2", "k:burst", "k:ip", "1000"]);
    assert.deepEqual(evalCall.args.slice(7), ["30000", "1", "600000", "5"]);
    assert.equal(await store.claim("dup", 600_000), true);
    assert.deepEqual(f.calls[1].args, ["SET", "dup", "1", "NX", "PX", "600000"]);
    await store.release("dup");
    assert.deepEqual(f.calls[2].args, ["DEL", "dup"]);
});

test("Upstash errors fall back to in-memory limits and never log the token", async () => {
    const log = silentLog();
    const broken = async () => {
        throw new TypeError("fetch failed https://example.upstash.io redis-token");
    };
    const store = withFallback(createUpstashStore({ url: "https://example.upstash.io", token: "redis-token", fetch: broken }), createMemoryStore(), log);
    const d = deps({ store, now: makeClock(), log });
    assert.equal((await handleContact(unique(), "8.8.4.4", d)).status, 200);
    assert.equal((await handleContact(unique(), "8.8.4.4", d)).status, 429);
    assert.ok(log.lines.length > 0);
    assert.ok(log.lines.every((l) => !l.includes("redis-token") && !l.includes("upstash.io")));
});

test("createContactStore picks Upstash only when both env vars are set", () => {
    assert.equal(createContactStore({}).kind, "memory");
    assert.equal(createContactStore({ UPSTASH_REDIS_REST_URL: "https://x.upstash.io" }).kind, "memory");
    assert.equal(createContactStore({ UPSTASH_REDIS_REST_URL: "https://x.upstash.io", UPSTASH_REDIS_REST_TOKEN: "t" }).kind, "upstash+memory");
    assert.equal(createContactStore({ KV_REST_API_URL: "https://x.upstash.io", KV_REST_API_TOKEN: "t" }).kind, "upstash+memory");
});
