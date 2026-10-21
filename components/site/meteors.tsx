/**
 * Meteors background. Lightswind's "meteors" is a Pro (paid) component, so this is a
 * lightweight equivalent built for this site with the same look: thin streaks with a fading
 * tail falling diagonally across the page.
 * - Pure CSS keyframes on transform/opacity (compositor-only), no JavaScript at runtime.
 * - Deterministic positions (no Math.random), so server and client markup match.
 * - Fixed behind all content, pointer-events off, decorative (aria-hidden).
 * - 14 meteors on desktop, 6 on phones; hidden entirely for prefers-reduced-motion.
 */
// Integer hash (identical in every JS engine, unlike Math.sin) -> [0, 1).
const seed = (i: number, k: number) => {
    let h = Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(k + 1, 0x85ebca77);
    h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
    h ^= h >>> 12;
    return (h >>> 0) / 4294967296;
};

export default function Meteors({ count = 14, mobileCount = 6 }: { count?: number; mobileCount?: number }) {
    const meteors = Array.from({ length: count }, (_, i) => ({
        left: `${Math.round(seed(i, 1) * 120 - 5)}%`,
        top: `${Math.round(seed(i, 2) * 45 - 10)}%`,
        delay: `${(seed(i, 3) * 10).toFixed(2)}s`,
        duration: `${(6 + seed(i, 4) * 6).toFixed(2)}s`,
        mobile: i < mobileCount,
    }));
    return (
        <div aria-hidden="true" className="meteors pointer-events-none fixed inset-0 -z-10 overflow-hidden motion-reduce:hidden">
            {meteors.map((m, i) => (
                <span
                    key={i}
                    className={`meteor ${m.mobile ? "" : "max-sm:hidden"}`}
                    style={{ left: m.left, top: m.top, animationDelay: m.delay, animationDuration: m.duration }}
                />
            ))}
        </div>
    );
}
