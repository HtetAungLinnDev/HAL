"use client";

/**
 * InteractiveCard, adapted from Lightswind UI (https://lightswind.com, MIT, @codewithmuhilan).
 * Same effect: the card tilts in 3D towards the pointer and a radial colour light follows it.
 * Changes for this site:
 * - Fluid size (fills its grid cell) instead of a fixed 320px card; renders any tag (article/li).
 * - Hover state is CSS (group-hover), so React never re-renders while the pointer moves;
 *   rotation and light position are framer-motion values written straight to styles.
 * - Mouse/pen only; touch and prefers-reduced-motion get a flat card. Resets on leave.
 */
import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/components/lib/utils";

export function InteractiveCard({
    children,
    className,
    interactiveColor = "rgba(52,224,176,0.16)",
    rotationFactor = 0.35,
    tilt = true,
}: {
    children: React.ReactNode;
    className?: string;
    interactiveColor?: string;
    rotationFactor?: number;
    /** When false, only the pointer-following glow is shown (no 3D tilt). */
    tilt?: boolean;
}) {
    const effectiveRotation = tilt ? rotationFactor : 0;
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    const sx = useSpring(x, { stiffness: 220, damping: 22 });
    const sy = useSpring(y, { stiffness: 220, damping: 22 });
    const rotateX = useTransform(sy, [0, 1], [effectiveRotation * 15, -effectiveRotation * 15]);
    const rotateY = useTransform(sx, [0, 1], [-effectiveRotation * 15, effectiveRotation * 15]);
    const px = useTransform(x, (v) => `${v * 100}%`);
    const py = useTransform(y, (v) => `${v * 100}%`);
    const light = useMotionTemplate`radial-gradient(circle at ${px} ${py}, ${interactiveColor} 0%, transparent 65%)`;

    const onMove = (e: React.PointerEvent) => {
        if (reduce || e.pointerType === "touch") return;
        const b = ref.current?.getBoundingClientRect();
        if (!b) return;
        x.set((e.clientX - b.left) / b.width);
        y.set((e.clientY - b.top) / b.height);
    };
    const reset = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={reset}
            className={cn("group/ic h-full", tilt && effectiveRotation > 0 && "[perspective:1000px]")}
        >
            <motion.div
                style={tilt && effectiveRotation > 0 ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
                className={cn("relative h-full", className)}
            >
                <motion.div
                    aria-hidden="true"
                    style={{ background: light }}
                    className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/ic:opacity-100 motion-reduce:hidden"
                />
                {children}
            </motion.div>
        </div>
    );
}

export default InteractiveCard;
