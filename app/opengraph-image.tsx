import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { personal } from "@/utils/data/site";
import { shortTitle, siteUrl } from "@/lib/seo";

// Generated at build time (static), on the default Node.js runtime.
export const alt = `${personal.name}: ${shortTitle}, ${personal.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = { bg: "#0A0E17", surface: "#0F1523", ink: "#EEF1F7", ink2: "#C5CCDA", ink3: "#97A1B5", mint: "#34E0B0", iris: "#8B93FF" };
const chips = ["React", "Next.js", "Vue / Nuxt", "TypeScript", "Laravel", "Node / NestJS", "AWS"];

type Font = { name: string; data: ArrayBuffer; weight: 400 | 500 | 600 | 700; style: "normal" };

/** Loads a Google Font as TTF (Satori can't read woff2). Returns null when offline so the build never fails. */
async function googleFont(family: string, weight: Font["weight"]): Promise<Font | null> {
    try {
        const css = await (
            await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`, { signal: AbortSignal.timeout(8000) })
        ).text();
        const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
        if (!url) return null;
        const data = await (await fetch(url, { signal: AbortSignal.timeout(8000) })).arrayBuffer();
        return { name: family, data, weight, style: "normal" };
    } catch {
        return null;
    }
}

async function portrait() {
    try {
        const file = await readFile(join(process.cwd(), "public", personal.profile.replace(/^\//, "")));
        return `data:image/jpeg;base64,${file.toString("base64")}`;
    } catch {
        return null;
    }
}

async function brandMark() {
    try {
        const file = await readFile(join(process.cwd(), "public", "brand", "hal-logo-dark-1024.png"));
        return `data:image/png;base64,${file.toString("base64")}`;
    } catch {
        return null;
    }
}

export default async function Image() {
    const [photo, logo, ...fonts] = await Promise.all([
        portrait(),
        brandMark(),
        googleFont("Space Grotesk", 700),
        googleFont("Inter", 400),
        googleFont("Inter", 600),
        googleFont("JetBrains Mono", 500),
    ]);
    const loaded = fonts.filter((f): f is Font => f !== null);
    const has = (name: string) => loaded.some((f) => f.name === name);
    const display = has("Space Grotesk") ? "Space Grotesk" : "sans-serif";
    const sans = has("Inter") ? "Inter" : "sans-serif";
    const mono = has("JetBrains Mono") ? "JetBrains Mono" : "monospace";
    const host = new URL(siteUrl).host;
    // Same framing as the hero ID card: the square portrait at 2x, zoomed around (64%, 18%).
    const PHOTO = 232;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    position: "relative",
                    backgroundColor: colors.bg,
                    fontFamily: sans,
                    color: colors.ink2,
                    overflow: "hidden",
                }}
            >
                {/* grid + glows, as in the hero */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        backgroundImage:
                            "linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: -200,
                        top: -260,
                        width: 900,
                        height: 700,
                        display: "flex",
                        backgroundImage: "radial-gradient(closest-side, rgba(52,224,176,0.22), rgba(52,224,176,0))",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: -220,
                        top: -200,
                        width: 860,
                        height: 760,
                        display: "flex",
                        backgroundImage: "radial-gradient(closest-side, rgba(139,147,255,0.26), rgba(139,147,255,0))",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 6,
                        display: "flex",
                        backgroundImage: `linear-gradient(90deg, ${colors.mint}, #3fb7c9, ${colors.iris})`,
                    }}
                />

                <div style={{ display: "flex", width: "100%", padding: "64px 72px 70px", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "column", maxWidth: 740 }}>
                        <div style={{ display: "flex", alignItems: "center", fontFamily: mono, fontSize: 22, letterSpacing: 3, color: colors.mint, textTransform: "uppercase" }}>
                            {logo && (
                                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                                <img src={logo} width={40} height={40} style={{ display: "flex", marginRight: 14, borderRadius: 10 }} />
                            )}
                            {host}
                        </div>
                        <div style={{ display: "flex", marginTop: 26, fontFamily: display, fontWeight: 700, fontSize: 92, lineHeight: 1, letterSpacing: -2.5, color: colors.ink }}>
                            {personal.name}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontFamily: display, fontWeight: 700, fontSize: 40, lineHeight: 1.2, letterSpacing: -0.5 }}>
                            <span style={{ color: colors.ink }}>Full-Stack Developer</span>
                            <span style={{ color: colors.mint }}>Co-Founder &amp; CTO, PhiLo POS</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginTop: 28, fontSize: 26, color: colors.ink2 }}>
                            <div style={{ display: "flex", width: 14, height: 14, borderRadius: 999, backgroundColor: colors.mint, marginRight: 14, boxShadow: "0 0 0 6px rgba(52,224,176,0.18)" }} />
                            {personal.location}
                            <span style={{ color: colors.ink3, margin: "0 14px" }}>·</span>
                            Full Stack Developer at Ravus Law Chambers
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 34 }}>
                            {chips.map((c) => (
                                <div
                                    key={c}
                                    style={{
                                        display: "flex",
                                        marginRight: 10,
                                        marginBottom: 10,
                                        padding: "8px 14px",
                                        borderRadius: 8,
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                        fontSize: 20,
                                        fontWeight: 600,
                                        color: colors.ink2,
                                    }}
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>

                    {photo && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: 300,
                                padding: "0 0 26px",
                                borderRadius: 28,
                                border: "1px solid rgba(255,255,255,0.10)",
                                backgroundColor: colors.surface,
                                boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
                                overflow: "hidden",
                            }}
                        >
                            <div style={{ display: "flex", width: "100%", height: 64, backgroundImage: `linear-gradient(90deg, rgba(52,224,176,0.85), #3fb7c9, rgba(139,147,255,0.9))` }} />
                            <div
                                style={{
                                    display: "flex",
                                    position: "relative",
                                    marginTop: -36,
                                    width: PHOTO,
                                    height: PHOTO,
                                    borderRadius: 24,
                                    border: `5px solid ${colors.surface}`,
                                    overflow: "hidden",
                                    backgroundColor: "#141B2D",
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                                <img
                                    src={photo}
                                    width={PHOTO * 2}
                                    height={PHOTO * 2}
                                    style={{ position: "absolute", left: -PHOTO * 0.64, top: -PHOTO * 0.18, width: PHOTO * 2, height: PHOTO * 2 }}
                                />
                            </div>
                            <div style={{ display: "flex", marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 26, color: colors.ink }}>{personal.name}</div>
                            <div style={{ display: "flex", marginTop: 4, fontSize: 18, fontWeight: 600, color: colors.mint }}>Full-Stack Software Engineer</div>
                        </div>
                    )}
                </div>
            </div>
        ),
        { ...size, fonts: loaded },
    );
}
