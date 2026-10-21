"use client";

/**
 * HangingIdCard, adapted from Lightswind UI (https://lightswind.com, MIT, @codewithmuhilan).
 * Changes for this site:
 * - Physics writes the rotation straight to the DOM through a ref (no React re-render per frame).
 * - Keyboard support: the card is focusable and Enter or Space gives it a push.
 * - prefers-reduced-motion: no swing (static card); a gentle one-off swing on first view otherwise.
 * - Unique SVG gradient ids (useId), so two cards on a page cannot clash.
 * - Card body is passed in as children (portrait + details), styled for the dark theme.
 */
import React, { useCallback, useEffect, useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/components/lib/utils";

const DAMPING = 0.92;
const GRAVITY = 3000;

const Lanyard = ({ length, color }: { length: number; color: string }) => {
    const uid = useId().replace(/:/g, "");
    const clampY = length;
    const ringY = length + 10;
    const hookY = length + 18;
    return (
        <svg
            width="44"
            height={length + 38}
            viewBox={`0 0 44 ${length + 38}`}
            style={{ display: "block", margin: "0 auto", overflow: "visible" }}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={`metal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a1a1aa" />
                    <stop offset="35%" stopColor="#3f3f46" />
                    <stop offset="70%" stopColor="#71717a" />
                    <stop offset="100%" stopColor="#27272a" />
                </linearGradient>
                <linearGradient id={`hook-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="40%" stopColor="#27272a" />
                    <stop offset="100%" stopColor="#52525b" />
                </linearGradient>
                <linearGradient id={`strap-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#000" stopOpacity="0.45" />
                    <stop offset="25%" stopColor="#fff" stopOpacity="0.12" />
                    <stop offset="75%" stopColor="#fff" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
                </linearGradient>
            </defs>
            <rect x="12" y="0" width="20" height={clampY + 4} rx="2" fill={color} />
            <rect x="12" y="0" width="20" height={clampY + 4} rx="2" fill={`url(#strap-${uid})`} />
            <line x1="13.5" y1="0" x2="13.5" y2={clampY + 4} stroke="#fff" strokeOpacity="0.15" strokeWidth="0.75" strokeDasharray="3 2" />
            <line x1="30.5" y1="0" x2="30.5" y2={clampY + 4} stroke="#fff" strokeOpacity="0.15" strokeWidth="0.75" strokeDasharray="3 2" />
            <rect x="10" y={clampY} width="24" height="10" rx="2.5" fill={`url(#metal-${uid})`} stroke="#18181b" strokeWidth="0.8" />
            <circle cx="13.5" cy={clampY + 5} r="1.3" fill="#d4d4d8" />
            <circle cx="30.5" cy={clampY + 5} r="1.3" fill="#d4d4d8" />
            <path
                d={`M 15 ${clampY + 9} C 15 ${ringY + 6}, 29 ${ringY + 6}, 29 ${clampY + 9}`}
                fill="none"
                stroke={`url(#metal-${uid})`}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <rect x="19" y={ringY + 2} width="6" height="6" rx="1" fill={`url(#metal-${uid})`} />
            <path
                d={`M 20 ${ringY + 7} L 20 ${hookY + 6} C 20 ${hookY + 15}, 24 ${hookY + 15}, 24 ${hookY + 6} L 24 ${ringY + 7}`}
                fill="none"
                stroke={`url(#hook-${uid})`}
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <line x1="20.5" y1={hookY + 1} x2="20.5" y2={hookY + 10} stroke="#e4e4e7" strokeWidth="1.2" />
        </svg>
    );
};

export interface HangingIdCardProps {
    children: React.ReactNode;
    ropeLength?: number;
    ropeColor?: string;
    className?: string;
    cardClassName?: string;
    label?: string;
    hint?: string;
}

export function HangingIdCard({
    children,
    ropeLength = 110,
    ropeColor = "#141B2D",
    className,
    cardClassName,
    label = "ID card. Press Enter to swing it.",
    hint = "Drag or tap the card",
}: HangingIdCardProps) {
    const reduce = useReducedMotion();
    const swingRef = useRef<HTMLDivElement>(null);
    const phys = useRef({ angle: 0, vel: 0 });
    const raf = useRef<number | null>(null);
    const prevT = useRef<number | null>(null);
    const prevAngle = useRef(0);
    const dragging = useRef(false);
    const dragStartX = useRef(0);
    const dragAngle0 = useRef(0);
    const L = ropeLength + 110;

    const paint = () => {
        if (swingRef.current) swingRef.current.style.transform = `rotate(${(phys.current.angle * 180) / Math.PI}deg)`;
    };

    const tick = useCallback(
        (now: number) => {
            if (prevT.current === null) prevT.current = now;
            const dt = Math.min((now - prevT.current) / 1000, 0.05);
            prevT.current = now;
            const s = phys.current;
            if (!dragging.current) {
                const torque = -(GRAVITY / L) * Math.sin(s.angle) - DAMPING * s.vel;
                s.vel += torque * dt;
                s.angle += s.vel * dt;
                paint();
                if (Math.abs(s.angle) > 0.001 || Math.abs(s.vel) > 0.001) {
                    raf.current = requestAnimationFrame(tick);
                } else {
                    s.angle = 0;
                    s.vel = 0;
                    paint();
                    raf.current = null;
                }
            } else {
                if (dt > 0) s.vel = (s.angle - prevAngle.current) / dt;
                prevAngle.current = s.angle;
                raf.current = requestAnimationFrame(tick);
            }
        },
        [L],
    );

    const start = useCallback(() => {
        if (raf.current) cancelAnimationFrame(raf.current);
        prevT.current = null;
        raf.current = requestAnimationFrame(tick);
    }, [tick]);

    const push = useCallback(
        (v = 2.6) => {
            if (reduce) return;
            phys.current.vel += v;
            start();
        },
        [reduce, start],
    );

    // A gentle one-off swing once the card has painted (skipped for reduced motion).
    useEffect(() => {
        if (reduce) return;
        const t = window.setTimeout(() => push(1.6), 600);
        return () => window.clearTimeout(t);
    }, [reduce, push]);

    useEffect(
        () => () => {
            if (raf.current) cancelAnimationFrame(raf.current);
        },
        [],
    );

    const onPointerDown = (e: React.PointerEvent) => {
        if (reduce) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        dragStartX.current = e.clientX;
        dragAngle0.current = phys.current.angle;
        prevAngle.current = phys.current.angle;
        start();
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        const a = Math.max(-1.2, Math.min(1.2, dragAngle0.current - (e.clientX - dragStartX.current) / L));
        phys.current.angle = a;
        paint();
    };
    const endDrag = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        e.currentTarget.releasePointerCapture(e.pointerId);
        dragging.current = false;
        const moved = Math.abs(e.clientX - dragStartX.current) > 4;
        if (!moved && Math.abs(phys.current.vel) < 0.1) phys.current.vel = 2.6; // tap = push
        start();
    };

    return (
        <div className={cn("flex select-none flex-col items-center", className)}>
            <div className="relative z-10 h-3.5 w-3.5 rounded-full border border-zinc-600 bg-zinc-900 shadow-md" aria-hidden="true" />
            <div
                ref={swingRef}
                role="group"
                aria-label={label}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        push();
                    }
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={cn(
                    "-mt-1.5 flex origin-top flex-col items-center rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-mint/70",
                    "cursor-grab touch-pan-y active:cursor-grabbing motion-reduce:cursor-auto",
                )}
                style={{ willChange: "transform" }}
            >
                <Lanyard length={ropeLength} color={ropeColor} />
                <div className={cn("relative -mt-4 overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl shadow-black/60", cardClassName)}>
                    <div className="flex justify-center border-b border-white/10 bg-surface-2 pb-1 pt-2.5" aria-hidden="true">
                        <div className="flex h-2.5 w-8 items-center justify-center rounded-full border border-zinc-700 bg-black shadow-inner">
                            <div className="h-1 w-6 rounded-full bg-zinc-950" />
                        </div>
                    </div>
                    {children}
                </div>
            </div>
            {/* Render-time output never depends on the reduced-motion hook (avoids hydration mismatches); CSS hides the hint instead. */}
            <p className="pointer-events-none mt-6 select-none text-[11px] font-medium text-ink-3 motion-reduce:hidden" aria-hidden="true">
                {hint}
            </p>
        </div>
    );
}

export default HangingIdCard;
