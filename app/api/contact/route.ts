import { NextResponse } from "next/server";
import { createContactStore, getClientIp, handleContact } from "@/lib/contact.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One store per server instance. With UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN set the
// limits live in Redis and are shared by every instance; otherwise they are kept in memory.
const store = createContactStore(process.env);

const MAX_BODY_BYTES = 16 * 1024;

export async function POST(req: Request) {
    const length = Number(req.headers.get("content-length") || 0);
    if (length > MAX_BODY_BYTES) {
        return NextResponse.json({ ok: false, error: "Message is too large." }, { status: 413 });
    }

    let body: unknown = null;
    try {
        const text = await req.text();
        if (text.length > MAX_BODY_BYTES) {
            return NextResponse.json({ ok: false, error: "Message is too large." }, { status: 413 });
        }
        body = JSON.parse(text);
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const result = await handleContact(body, getClientIp(req.headers), {
        env: process.env,
        fetch,
        store,
    });
    return NextResponse.json(result.body, {
        status: result.status,
        headers: { "Cache-Control": "no-store", ...result.headers },
    });
}
