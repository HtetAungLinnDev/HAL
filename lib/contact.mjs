// Contact form logic: validation, spam protection, rate limiting and the Telegram notification.
// Plain ESM so it can be unit-tested with `node --test` without a build step.

import { createHash, randomUUID } from "node:crypto";

export const LIMITS = { name: 100, email: 254, message: 2000 };

/**
 * Sliding-window limits. All must pass for a submission to go through.
 * - burst:  1 message per 30 s per IP
 * - ip:     5 messages per 10 min per IP
 * - global: 30 messages per hour in total, to protect the Telegram bot
 */
export const RATE_LIMITS = {
    burst: { max: 1, windowMs: 30 * 1000 },
    ip: { max: 5, windowMs: 10 * 60 * 1000 },
    global: { max: 30, windowMs: 60 * 60 * 1000 },
};
/** Back-compat alias for the per-IP window. */
export const RATE_LIMIT = RATE_LIMITS.ip;
/** The form must have been open at least this long before it is submitted. */
export const MIN_FILL_MS = 3000;
/** Identical messages are rejected for this long after one was sent. */
export const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const KEY_PREFIX = "portfolio:contact:";

/** Escape the three characters Telegram's HTML parse mode treats specially. */
export function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const clean = (v) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim() : "");

/** Returns { ok: true, data } or { ok: false, errors: { field: message } }. */
export function validateContact(body) {
    const input = body && typeof body === "object" ? body : {};
    const data = { name: clean(input.name), email: clean(input.email), message: clean(input.message) };
    const errors = {};
    if (!data.name) errors.name = "Please enter your name.";
    else if (data.name.length > LIMITS.name) errors.name = `Name must be ${LIMITS.name} characters or fewer.`;
    if (!data.email) errors.email = "Please enter your email.";
    else if (data.email.length > LIMITS.email || !EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
    if (!data.message) errors.message = "Please enter a message.";
    else if (data.message.length > LIMITS.message) errors.message = `Message must be ${LIMITS.message} characters or fewer.`;
    return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function formatYangonTime(date) {
    return (
        new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Yangon",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date) + " (Asia/Yangon)"
    );
}

export function buildTelegramText({ name, email, message }, date) {
    return [
        "<b>📬 New message from your portfolio</b>",
        "",
        `<b>Name:</b> ${escapeHtml(name)}`,
        `<b>Email:</b> ${escapeHtml(email)}`,
        `<b>Time:</b> ${escapeHtml(formatYangonTime(date))}`,
        "",
        "<b>Message:</b>",
        escapeHtml(message),
    ].join("\n");
}

// ---------------------------------------------------------------------------
// Client IP
// ---------------------------------------------------------------------------

/**
 * Best-effort client IP: first entry of x-forwarded-for (set by Vercel / proxies),
 * then x-real-ip, else "unknown". Strips an IPv4 port and IPv6 brackets.
 * `headers` is a Fetch `Headers` object or a plain object.
 */
export function getClientIp(headers) {
    const get = (name) =>
        headers && typeof headers.get === "function" ? headers.get(name) : headers ? headers[name] ?? headers[name.toLowerCase()] : null;
    const candidates = [String(get("x-forwarded-for") || "").split(",")[0], String(get("x-real-ip") || "")];
    for (const raw of candidates) {
        let ip = raw.trim();
        if (!ip) continue;
        const bracketed = ip.match(/^\[([^\]]+)\](?::\d+)?$/);
        if (bracketed) ip = bracketed[1];
        else if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(ip)) ip = ip.slice(0, ip.lastIndexOf(":"));
        if (/^[0-9a-fA-F:.]{2,45}$/.test(ip)) return ip.toLowerCase();
    }
    return "unknown";
}

// ---------------------------------------------------------------------------
// Rate-limit / de-duplication stores
//
// A store implements:
//   hit(rules, nowMs)        -> { allowed: boolean, retryAfterMs: number, blockedBy?: string }
//       rules: [{ name, key, max, windowMs }]. Checks every rule first and records the hit
//       on all of them only when none is exceeded (a blocked request never extends a window).
//   claim(key, ttlMs, nowMs) -> boolean   (true when the key was free and is now taken)
//   release(key)             -> void
// ---------------------------------------------------------------------------

/** In-memory sliding-window store (per server instance), with cleanup of stale entries. */
export function createMemoryStore({ maxKeys = 10000, sweepEveryMs = 60 * 1000 } = {}) {
    const windows = new Map(); // key -> { windowMs, hits: number[] }
    const claims = new Map(); // key -> expiresAt
    let lastSweep = 0;

    function sweep(now) {
        for (const [key, entry] of windows) {
            entry.hits = entry.hits.filter((t) => now - t < entry.windowMs);
            if (entry.hits.length === 0) windows.delete(key);
        }
        for (const [key, expiresAt] of claims) if (expiresAt <= now) claims.delete(key);
        // Hard cap: drop the oldest-inserted keys if an attacker sprays many IPs.
        for (const map of [windows, claims]) {
            if (map.size <= maxKeys) continue;
            let excess = map.size - maxKeys;
            for (const key of map.keys()) {
                if (excess-- <= 0) break;
                map.delete(key);
            }
        }
        lastSweep = now;
    }

    function maybeSweep(now) {
        if (now - lastSweep >= sweepEveryMs || windows.size > maxKeys || claims.size > maxKeys) sweep(now);
    }

    return {
        kind: "memory",
        async hit(rules, now = Date.now()) {
            maybeSweep(now);
            let retryAfterMs = 0;
            let blockedBy;
            const entries = rules.map((rule) => {
                const entry = windows.get(rule.key) || { windowMs: rule.windowMs, hits: [] };
                entry.windowMs = Math.max(entry.windowMs, rule.windowMs);
                entry.hits = entry.hits.filter((t) => now - t < rule.windowMs);
                if (entry.hits.length >= rule.max) {
                    // The request is allowed again once enough of the oldest hits have left the window.
                    const wait = entry.hits[entry.hits.length - rule.max] + rule.windowMs - now;
                    if (wait > retryAfterMs) {
                        retryAfterMs = wait;
                        blockedBy = rule.name;
                    }
                }
                return [rule.key, entry];
            });
            if (retryAfterMs > 0) {
                for (const [key, entry] of entries) if (entry.hits.length) windows.set(key, entry);
                return { allowed: false, retryAfterMs, blockedBy };
            }
            for (const [key, entry] of entries) {
                entry.hits.push(now);
                windows.set(key, entry);
            }
            return { allowed: true, retryAfterMs: 0 };
        },
        async claim(key, ttlMs, now = Date.now()) {
            maybeSweep(now);
            const expiresAt = claims.get(key);
            if (expiresAt && expiresAt > now) return false;
            claims.set(key, now + ttlMs);
            return true;
        },
        async release(key) {
            claims.delete(key);
        },
        /** For tests and diagnostics. */
        size: () => ({ windows: windows.size, claims: claims.size }),
        sweep,
    };
}

// Checks every window first, then records the hit on all of them, atomically in Redis.
// KEYS: one per rule. ARGV: now, member, then windowMs and max for each rule.
const SLIDING_WINDOW_LUA = `
local now = tonumber(ARGV[1])
local member = ARGV[2]
local retry = 0
local blocked = 0
for i = 1, #KEYS do
  local win = tonumber(ARGV[1 + 2 * i])
  local max = tonumber(ARGV[2 + 2 * i])
  redis.call('ZREMRANGEBYSCORE', KEYS[i], '-inf', now - win)
  local count = redis.call('ZCARD', KEYS[i])
  if count >= max then
    local edge = redis.call('ZRANGE', KEYS[i], count - max, count - max, 'WITHSCORES')
    local wait = tonumber(edge[2]) + win - now
    if wait > retry then retry = wait; blocked = i end
  end
end
if retry > 0 then return {0, retry, blocked} end
for i = 1, #KEYS do
  redis.call('ZADD', KEYS[i], now, member)
  redis.call('PEXPIRE', KEYS[i], tonumber(ARGV[1 + 2 * i]))
end
return {1, 0, 0}
`;

/**
 * Durable store backed by Upstash Redis over its REST API (plain fetch, no SDK),
 * so limits are shared by every serverless instance.
 */
export function createUpstashStore({ url, token, fetch: fetchImpl, timeoutMs = 2500 }) {
    const base = String(url).replace(/\/+$/, "");
    async function command(args) {
        const controller = typeof AbortController === "function" ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
        try {
            const res = await fetchImpl(base, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(args),
                signal: controller ? controller.signal : undefined,
                cache: "no-store",
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || json.error) throw new Error(`Upstash ${res.status}${json.error ? `: ${String(json.error).slice(0, 120)}` : ""}`);
            return json.result;
        } finally {
            if (timer) clearTimeout(timer);
        }
    }
    return {
        kind: "upstash",
        command,
        async hit(rules, now = Date.now()) {
            const member = `${now}-${randomUUID()}`;
            const args = ["EVAL", SLIDING_WINDOW_LUA, String(rules.length), ...rules.map((r) => r.key), String(now), member];
            for (const r of rules) args.push(String(r.windowMs), String(r.max));
            const [allowed, retryAfterMs, blockedIndex] = (await command(args)) || [];
            if (Number(allowed) === 1) return { allowed: true, retryAfterMs: 0 };
            return { allowed: false, retryAfterMs: Math.max(1, Number(retryAfterMs) || 1000), blockedBy: rules[Number(blockedIndex) - 1]?.name };
        },
        async claim(key, ttlMs) {
            return (await command(["SET", key, "1", "NX", "PX", String(Math.ceil(ttlMs))])) === "OK";
        },
        async release(key) {
            await command(["DEL", key]);
        },
    };
}

/** Uses `primary`, falling back to `fallback` (in-memory) for any call where `primary` errors. */
export function withFallback(primary, fallback, log = console) {
    const wrap = (method) =>
        async (...args) => {
            try {
                return await primary[method](...args);
            } catch (err) {
                // Never log the Redis URL or token.
                log.error(`Contact form: ${primary.kind} store ${method} failed, using in-memory limits (${err && err.name ? err.name : "Error"})`);
                return fallback[method](...args);
            }
        };
    return { kind: `${primary.kind}+${fallback.kind}`, hit: wrap("hit"), claim: wrap("claim"), release: wrap("release") };
}

/**
 * Picks the store from the environment: Upstash Redis when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN (or Vercel KV's KV_REST_API_URL / KV_REST_API_TOKEN) are set,
 * otherwise in-memory.
 */
export function createContactStore(env = {}, { fetch: fetchImpl = globalThis.fetch, log = console } = {}) {
    const memory = createMemoryStore();
    const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
    const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
    if (url && token && fetchImpl) return withFallback(createUpstashStore({ url, token, fetch: fetchImpl }), memory, log);
    return memory;
}

/** Back-compat: a synchronous-looking per-IP limiter around an in-memory store. */
export function createRateLimiter(rule = RATE_LIMITS.ip) {
    const store = createMemoryStore();
    return async (key, now = Date.now()) => {
        const r = await store.hit([{ name: "ip", key: `ip:${key}`, ...rule }], now);
        return r.allowed ? { allowed: true } : { allowed: false, retryAfterSec: Math.ceil(r.retryAfterMs / 1000) };
    };
}

export function rateLimitRules(ip, limits = RATE_LIMITS) {
    return [
        { name: "burst", key: `${KEY_PREFIX}burst:${ip}`, ...limits.burst },
        { name: "ip", key: `${KEY_PREFIX}ip:${ip}`, ...limits.ip },
        { name: "global", key: `${KEY_PREFIX}global`, ...limits.global },
    ];
}

/** Key used to detect the same message being sent twice (case/whitespace-insensitive). */
export function duplicateKey(message) {
    const normalized = String(message).toLowerCase().replace(/\s+/g, " ").trim();
    return `${KEY_PREFIX}dup:${createHash("sha256").update(normalized).digest("hex")}`;
}

/** Validates the hidden timing fields. Both are client-clock timestamps, so clock skew doesn't matter. */
export function checkFillTime(body, minMs = MIN_FILL_MS) {
    const startedAt = Number(body && body.startedAt);
    const submittedAt = Number(body && body.submittedAt);
    if (!Number.isFinite(startedAt) || !Number.isFinite(submittedAt) || startedAt <= 0) return { ok: false, reason: "missing" };
    const elapsed = submittedAt - startedAt;
    if (elapsed < minMs) return { ok: false, reason: "too-fast", elapsed };
    return { ok: true, elapsed };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const SEND_FAILED = "Sorry, your message couldn't be sent right now. Please try again later or email me directly.";

function tooMany(retryAfterMs, blockedBy) {
    const retryAfter = Math.max(1, Math.ceil(retryAfterMs / 1000));
    const wait = retryAfter < 90 ? `${retryAfter} seconds` : `${Math.ceil(retryAfter / 60)} minutes`;
    const error =
        blockedBy === "global"
            ? `The contact form is getting a lot of messages right now. Please try again in ${wait} or email me directly.`
            : `You're sending messages too quickly. Please try again in ${wait}.`;
    return { status: 429, body: { ok: false, error, retryAfter, scope: blockedBy === "global" ? "global" : "client" }, headers: { "Retry-After": String(retryAfter) } };
}

/**
 * Handle one contact submission. Returns { status, body, headers? }.
 * deps: { env, fetch, store, now, log, limits, minFillMs, duplicateWindowMs }
 *
 * Order: honeypot -> fill time -> validation -> rate limits -> duplicate -> config -> Telegram.
 * Only well-formed submissions count toward the limits, so a typo never locks anyone out.
 * @returns {Promise<{ status: number, body: Record<string, unknown>, headers?: Record<string, string> }>}
 */
export async function handleContact(body, ip, deps) {
    const {
        env = {},
        fetch: fetchImpl,
        store = createMemoryStore(),
        now = () => new Date(),
        log = console,
        limits = RATE_LIMITS,
        minFillMs = MIN_FILL_MS,
        duplicateWindowMs = DUPLICATE_WINDOW_MS,
    } = deps;
    const input = body && typeof body === "object" ? body : {};

    // Honeypot: real users never fill the hidden "website" field. Pretend success.
    if (typeof input.website === "string" && input.website.trim() !== "") {
        return { status: 200, body: { ok: true, message: "Thanks! Your message has been sent." } };
    }

    const fill = checkFillTime(input, minFillMs);
    if (!fill.ok) {
        return {
            status: 400,
            body: { ok: false, error: fill.reason === "too-fast" ? "That was quick! Please wait a few seconds and send again." : "Please reload the page and try again." },
        };
    }

    const result = validateContact(input);
    if (!result.ok) {
        return { status: 400, body: { ok: false, error: "Please check the highlighted fields.", errors: result.errors } };
    }

    const nowMs = now().getTime();
    const limit = await store.hit(rateLimitRules(ip || "unknown", limits), nowMs);
    if (!limit.allowed) return tooMany(limit.retryAfterMs, limit.blockedBy);

    const dupKey = duplicateKey(result.data.message);
    if (!(await store.claim(dupKey, duplicateWindowMs, nowMs))) {
        return { status: 409, body: { ok: false, error: "Looks like you already sent this message. I'll get back to you soon." } };
    }

    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
        await store.release(dupKey);
        log.error("Contact form: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.");
        return { status: 503, body: { ok: false, error: "The contact form isn't configured yet. Please email me directly." } };
    }

    const apiBase = env.TELEGRAM_API_BASE || "https://api.telegram.org";
    try {
        const res = await fetchImpl(`${apiBase}/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: buildTelegramText(result.data, new Date(nowMs)),
                parse_mode: "HTML",
                disable_web_page_preview: true,
            }),
        });
        if (!res.ok) {
            let description = "";
            try {
                description = String((await res.json()).description || "").slice(0, 200);
            } catch {
                /* ignore */
            }
            // Never log the token or the request URL.
            log.error(`Contact form: Telegram sendMessage failed (${res.status}) ${description}`);
            await store.release(dupKey);
            return { status: 502, body: { ok: false, error: SEND_FAILED } };
        }
    } catch (err) {
        log.error(`Contact form: Telegram request error (${err && err.name ? err.name : "Error"})`);
        await store.release(dupKey);
        return { status: 502, body: { ok: false, error: SEND_FAILED } };
    }

    return { status: 200, body: { ok: true, message: "Thanks! Your message has been sent. I'll get back to you soon." } };
}
