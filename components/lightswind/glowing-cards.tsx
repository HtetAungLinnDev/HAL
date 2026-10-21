"use client";

/**
 * GlowingCards / GlowingCard, adapted from Lightswind UI (https://lightswind.com, MIT, @codewithmuhilan).
 * Same effect as the original: while the pointer is over a group, cards near it light up
 * with their own glow colour (tinted fill + coloured border) inside a soft radial spotlight.
 * Changes for this site:
 * - The original duplicated every card in an overlay (double DOM, duplicate text for screen
 *   readers) and re-rendered React on every mousemove. Here each card draws the glow with two
 *   pseudo-elements (see .glow-card in globals.css) and the pointer position is written as CSS
 *   variables once per animation frame. No React state, no duplicated content.
 * - Works with any layout (grids, lists); the cards keep their own markup and semantics.
 * - Mouse/pen only (no effect on touch); hidden for prefers-reduced-motion.
 */
import React, { useEffect, useRef } from "react";
import { cn } from "@/components/lib/utils";

export function GlowingCards({
    children,
    className,
    glowRadius = 22,
}: {
    children: React.ReactNode;
    className?: string;
    /** Spotlight radius in rem. */
    glowRadius?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;
        let frame = 0;
        let last: PointerEvent | null = null;
        const update = () => {
            frame = 0;
            if (!last) return;
            root.querySelectorAll<HTMLElement>(".glow-card").forEach((card) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty("--x", `${last!.clientX - r.left}px`);
                card.style.setProperty("--y", `${last!.clientY - r.top}px`);
            });
        };
        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            last = e;
            root.style.setProperty("--glow-on", "1");
            if (!frame) frame = requestAnimationFrame(update);
        };
        const onLeave = () => root.style.setProperty("--glow-on", "0");
        root.addEventListener("pointermove", onMove, { passive: true });
        root.addEventListener("pointerleave", onLeave);
        return () => {
            root.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerleave", onLeave);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div ref={ref} className={cn("glow-group", className)} style={{ "--glow-radius": `${glowRadius}rem` } as React.CSSProperties}>
            {children}
        </div>
    );
}

export { glowCard, GlowingCard } from "./glowing-card";
