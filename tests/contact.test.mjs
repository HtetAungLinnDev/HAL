import { test } from "node:test";
import assert from "node:assert/strict";
import { handleContact, createRateLimiter, escapeHtml, validateContact, LIMITS } from "../lib/contact.mjs";

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
const deps = (over = {}) => ({ env, fetch: mockFetch(), rateLimit: createRateLimiter(), now: fixedNow, log: silentLog(), ...over });
const valid = { name: "Aung Aung", email: "aung@example.com", message: "Hello Htet, let's work together." };

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
    await handleContact({ name: "<b>Eve</b> & co", email: "eve@example.com", message: '<a href="x">hi</a> & <script>' }, "1.1.1.2", d);
    const { text } = d.fetch.calls[0].payload;
    assert.match(text, /<b>Name:<\/b> &lt;b&gt;Eve&lt;\/b&gt; &amp; co/);
    assert.match(text, /&lt;a href="x"&gt;hi&lt;\/a&gt; &amp; &lt;script&gt;$/);
    assert.ok(!text.includes("<script>"));
    assert.ok(!text.includes("<a "));
    assert.equal(escapeHtml("a&b<c>d"), "a&amp;b&lt;c&gt;d");
});

test("validation errors return 400 and never call Telegram", async () => {
    const d = deps();
    const res = await handleContact({ name: "", email: "not-an-email", message: "x".repeat(LIMITS.message + 1) }, "1.1.1.3", d);
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

test("rate limit: 6th request from the same IP within 10 minutes gets 429", async () => {
    const d = deps();
    for (let i = 0; i < 5; i++) assert.equal((await handleContact(valid, "9.9.9.9", d)).status, 200);
    const blocked = await handleContact(valid, "9.9.9.9", d);
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers["Retry-After"]) > 0);
    assert.equal((await handleContact(valid, "8.8.8.8", d)).status, 200);
    assert.equal(d.fetch.calls.length, 6);
});

test("missing env vars return 500 without calling Telegram", async () => {
    const d = deps({ env: {} });
    const res = await handleContact(valid, "1.1.1.5", d);
    assert.equal(res.status, 500);
    assert.equal(d.fetch.calls.length, 0);
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
