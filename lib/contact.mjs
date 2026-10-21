// Contact form logic: validation, spam protection and the Telegram notification.
// Plain ESM so it can be unit-tested with `node --test` without a build step.

export const LIMITS = { name: 100, email: 254, message: 2000 };
export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

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

/** Simple fixed-window, in-memory rate limiter (per server instance). */
export function createRateLimiter({ max, windowMs } = RATE_LIMIT) {
    const hits = new Map();
    return function check(key, now = Date.now()) {
        const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
        if (recent.length >= max) {
            hits.set(key, recent);
            return { allowed: false, retryAfterSec: Math.ceil((windowMs - (now - recent[0])) / 1000) };
        }
        recent.push(now);
        hits.set(key, recent);
        if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
        return { allowed: true };
    };
}

/**
 * Handle one contact submission. Returns { status, body, headers? }.
 * deps: { env, fetch, rateLimit, now, log }
 */
export async function handleContact(body, ip, deps) {
    const { env = {}, fetch: fetchImpl, rateLimit, now = () => new Date(), log = console } = deps;

    const limit = rateLimit(ip || "unknown");
    if (!limit.allowed) {
        return {
            status: 429,
            body: { ok: false, error: "Too many messages. Please try again in a few minutes." },
            headers: { "Retry-After": String(limit.retryAfterSec) },
        };
    }

    // Honeypot: real users never fill the hidden "website" field. Pretend success.
    if (body && typeof body === "object" && typeof body.website === "string" && body.website.trim() !== "") {
        return { status: 200, body: { ok: true, message: "Thanks! Your message has been sent." } };
    }

    const result = validateContact(body);
    if (!result.ok) {
        return { status: 400, body: { ok: false, error: "Please check the highlighted fields.", errors: result.errors } };
    }

    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
        log.error("Contact form: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.");
        return { status: 500, body: { ok: false, error: "The contact form isn't configured yet. Please email me directly." } };
    }

    const apiBase = env.TELEGRAM_API_BASE || "https://api.telegram.org";
    try {
        const res = await fetchImpl(`${apiBase}/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: buildTelegramText(result.data, now()),
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
            return { status: 502, body: { ok: false, error: "Sorry, your message couldn't be sent right now. Please try again later or email me directly." } };
        }
    } catch (err) {
        log.error(`Contact form: Telegram request error (${err && err.name ? err.name : "Error"})`);
        return { status: 502, body: { ok: false, error: "Sorry, your message couldn't be sent right now. Please try again later or email me directly." } };
    }

    return { status: 200, body: { ok: true, message: "Thanks! Your message has been sent. I'll get back to you soon." } };
}
