"use client";

/**
 * ThreeDImageCarousel, adapted from Lightswind UI's "3d-image-carousel"
 * (https://lightswind.com, MIT, @codewithmuhilan).
 * Changes for this site:
 * - Same cascade layout (centre slide + 2 on each side, scaled and greyed), but slides to the
 *   right are "next" and the CSS lives in globals.css (.cascade-*), not an inline <style>.
 * - No min-width (it overflowed phones); responsive slide sizes instead.
 * - next/image with quality 90; only slides near the active one mount an image, so 20 photos
 *   don't download at once.
 * - Accessible: real <button>s, arrow-key navigation, a pause/play control for autoplay
 *   (WCAG 2.2.2), off-screen slides hidden from assistive tech, polite live status.
 * - Autoplay pauses on hover/focus, when off-screen, and never runs with reduced motion.
 */
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface CarouselSlide {
    src: string;
    alt: string;
}

const posClass = (offset: number) =>
    offset === 0 ? "is-now" : offset === 1 ? "is-next" : offset === -1 ? "is-prev" : offset === 2 ? "is-next2" : offset === -2 ? "is-prev2" : "";

export function ThreeDImageCarousel({
    slides,
    autoplay = true,
    delay = 3.5,
    className,
    label = "Photo carousel",
}: {
    slides: CarouselSlide[];
    autoplay?: boolean;
    delay?: number;
    className?: string;
    label?: string;
}) {
    const total = slides.length;
    const [active, setActive] = useState(0);
    const [playing, setPlaying] = useState(autoplay);
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);
    const reduce = useReducedMotion();
    const rootRef = useRef<HTMLDivElement>(null);
    const startX = useRef<number | null>(null);

    const go = useCallback((dir: 1 | -1) => setActive((a) => (a + dir + total) % total), [total]);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!playing || reduce || hovered || !visible || total < 2) return;
        const id = window.setInterval(() => go(1), delay * 1000);
        return () => window.clearInterval(id);
    }, [playing, reduce, hovered, visible, total, delay, go]);

    const offsetOf = (i: number) => {
        let d = i - active;
        if (d > total / 2) d -= total;
        if (d < -total / 2) d += total;
        return d;
    };

    return (
        <div
            ref={rootRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            tabIndex={0}
            className={cn("cascade relative outline-none focus-visible:ring-2 focus-visible:ring-mint/60 rounded-2xl", className)}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    go(1);
                }
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    go(-1);
                }
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false);
            }}
            onPointerDown={(e) => {
                startX.current = e.clientX;
            }}
            onPointerUp={(e) => {
                if (startX.current === null) return;
                const dx = e.clientX - startX.current;
                if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                startX.current = null;
            }}
        >
            <ul className="cascade-track">
                {slides.map((s, i) => {
                    const off = offsetOf(i);
                    const near = Math.abs(off) <= 3;
                    const shown = Math.abs(off) <= 2;
                    return (
                        <li
                            key={s.src}
                            className={cn("cascade-item", posClass(off))}
                            aria-hidden={off !== 0}
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${total}`}
                            onClick={() => {
                                if (off !== 0 && shown) setActive(i);
                            }}
                        >
                            <div className="cascade-frame">
                                {near && (
                                    <Image
                                        src={s.src}
                                        alt={off === 0 ? s.alt : ""}
                                        fill
                                        quality={90}
                                        sizes="(min-width: 1100px) 420px, (min-width: 576px) 340px, 240px"
                                        className="object-cover"
                                        draggable={false}
                                    />
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="cascade-arrow left-1 sm:-left-2">
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="cascade-arrow right-1 sm:-right-2">
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? "Pause autoplay" : "Start autoplay"}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-mint/50 hover:text-ink motion-reduce:hidden"
                >
                    {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
                <p className="font-mono text-xs text-ink-3" aria-live="polite">
                    {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </p>
            </div>
        </div>
    );
}

export default ThreeDImageCarousel;
