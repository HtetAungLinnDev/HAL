import { NextResponse } from "next/server";
import { createRateLimiter, handleContact } from "@/lib/contact.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimit = createRateLimiter();

function clientIp(req: Request) {
    const forwarded = req.headers.get("x-forwarded-for");
    return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
    let body: unknown = null;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const result = await handleContact(body, clientIp(req), {
        env: process.env,
        fetch,
        rateLimit,
    });
    return NextResponse.json(result.body, { status: result.status, headers: result.headers });
}
