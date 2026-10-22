"use client";

/**
 * ChainCarousel, adapted from Lightswind UI (https://lightswind.com, MIT, @codewithmuhilan).
 * Changes for this site:
 * - Same effect: two curved "chains" of items scroll past a highlighted centre item.
 * - Items take an image logo (the skill SVGs) instead of Lucide icons.
 * - The search box was dropped; prev/next buttons and arrow keys control it instead.
 *   The moving chains are decorative (aria-hidden); the
 *   centre item is announced politely only when the user steps through it.
 * - Autoplay stops when off-screen (IntersectionObserver instead of a scroll listener that
 *   re-rendered on every scroll), on hover/focus, and never runs with reduced motion.
 * - Columns sized for this layout; overflow is clipped so phones never scroll sideways.
 */
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/components/lib/utils";

export interface ChainItem {
    id: string;
    name: string;
    details?: string;
    logo: string;
}

const Logo = ({ src, size }: { src: string; size: number }) => (
    <span
        className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white p-2 shadow-md"
        style={{ width: size + 16, height: size + 16 }}
    >
        <Image src={src} alt="" width={size} height={size} unoptimized className="h-full w-full object-contain" />
    </span>
);

function Chain({ items, side }: { items: (ChainItem & { d: number })[]; side: "left" | "right" }) {
    return (
        <div
            aria-hidden="true"
            className="relative flex h-[380px] w-full items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)]"
        >
            {items.map((c) => {
                const dist = Math.abs(c.d);
                return (
                    <motion.div
                        key={c.id}
                        className={cn("absolute flex items-center gap-3 px-4 py-2", side === "left" ? "flex-row-reverse" : "flex-row")}
                        initial={false}
                        animate={{ opacity: 1 - dist / 4, scale: 1 - dist * 0.1, y: c.d * 78, x: side === "left" ? -dist * 34 : dist * 34 }}
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                        <Logo src={c.logo} size={24} />
                        <span className={cn("flex flex-col", side === "left" ? "text-right" : "text-left")}>
                            <span className="whitespace-nowrap text-base font-semibold text-ink">{c.name}</span>
                            {c.details && <span className="whitespace-nowrap text-xs text-ink-3">{c.details}</span>}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}

export function ChainCarousel({
    items,
    scrollSpeedMs = 1800,
    visibleItemCount = 7,
    className,
    label = "Skills carousel",
}: {
    items: ChainItem[];
    scrollSpeedMs?: number;
    visibleItemCount?: number;
    className?: string;
    label?: string;
}) {
    const total = items.length;
    const [index, setIndex] = useState(0);
    // const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);
    const [manual, setManual] = useState(false);
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // useEffect(() => {
    //     if (hovered || !visible || reduce || total < 2) return;
    //     const id = window.setInterval(() => setIndex((i) => (i + 1) % total), scrollSpeedMs);
    //     return () => window.clearInterval(id);
    // }, [hovered, visible, reduce, total, scrollSpeedMs]);

    const step = useCallback(
        (dir: 1 | -1) => {
            setManual(true);
            setIndex((i) => (i + dir + total) % total);
        },
        [total],
    );

    const half = Math.floor((visibleItemCount % 2 ? visibleItemCount : visibleItemCount + 1) / 2);
    const visibleItems = Array.from({ length: half * 2 + 1 }, (_, k) => {
        const d = k - half;
        return { ...items[(index + d + total * 10) % total], d };
    });
    const current = items[index];
    // const btn =
    //     "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-mint/50 hover:text-ink";

    return (
        <div
            ref={ref}
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            tabIndex={0}
            className={cn("rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-mint/60", className)}
            onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                    e.preventDefault();
                    step(1);
                }
                if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    step(-1);
                }
            }}
        // onMouseEnter={() => setHovered(true)}
        // onMouseLeave={() => setHovered(false)}
        // onFocus={() => setHovered(true)}
        // onBlur={(e) => {
        //     if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false);
        // }}
        >
            <div className="grid items-center gap-2 md:grid-cols-[1fr_minmax(220px,260px)_1fr] md:gap-6">
                <div className="hidden md:block">
                    <Chain items={visibleItems} side="left" />
                </div>
                <div className="flex flex-col items-center py-4 text-center">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col items-center"
                    >
                        <span className="rounded-full bg-gradient-to-br from-mint/50 to-iris/50 p-[3px] shadow-lg shadow-mint/10">
                            <Logo src={current.logo} size={44} />
                        </span>
                        <p className="mt-4 font-display text-2xl font-bold text-ink" aria-live={manual ? "polite" : "off"}>
                            {current.name}
                        </p>
                        {current.details && <p className="mt-1 text-sm text-ink-3">{current.details}</p>}
                    </motion.div>
                    {/* <div className="mt-6 flex items-center gap-2">
                        <button type="button" onClick={() => step(-1)} aria-label="Previous skill" className={btn}>
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => step(1)} aria-label="Next skill" className={btn}>
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div> */}
                    <p className="mt-3 font-mono text-[11px] text-ink-3">
                        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </p>
                </div>
                <div>
                    <Chain items={visibleItems} side="right" />
                </div>
            </div>
        </div>
    );
}

export default ChainCarousel;
