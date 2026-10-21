"use client";

// Lightswind UI "magnetic-button" (https://lightswind.com/components/magnetic-button),
// copied as source. Local changes: renders an <a> when `href` is given (our CTAs are
// links), styling is passed in via className instead of Lightswind theme tokens, and
// the magnetic pull is disabled when the user prefers reduced motion.
import React, { useRef, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/components/lib/utils";

interface MagneticButtonProps {
    children: React.ReactNode;
    href?: string;
    strength?: number;
    radius?: number;
    className?: string;
    download?: boolean;
}

export function MagneticButton({ children, href, strength = 0.3, radius = 80, className, download }: MagneticButtonProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const reduceMotion = useReducedMotion();
    const springConfig = { stiffness: 200, damping: 18, mass: 0.6 };
    const rawX = useSpring(0, springConfig);
    const rawY = useSpring(0, springConfig);
    const textX = useTransform(rawX, (v) => v * 0.4);
    const textY = useTransform(rawY, (v) => v * 0.4);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (reduceMotion) return;
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) return;
        const distX = e.clientX - (rect.left + rect.width / 2);
        const distY = e.clientY - (rect.top + rect.height / 2);
        if (Math.sqrt(distX ** 2 + distY ** 2) < radius) {
            rawX.set(distX * strength);
            rawY.set(distY * strength);
            setIsHovered(true);
        } else {
            reset();
        }
    };
    const reset = () => {
        rawX.set(0);
        rawY.set(0);
        setIsHovered(false);
    };

    const classes = cn("relative inline-flex items-center justify-center overflow-hidden rounded-lg font-semibold tracking-tight transition-colors", className);
    const inner = (
        <>
            <motion.span
                aria-hidden="true"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute inset-0 rounded-[inherit] bg-white/10"
            />
            <motion.span style={{ x: textX, y: textY }} className="relative z-10 flex items-center gap-2">
                {children}
            </motion.span>
        </>
    );
    const motionProps = {
        style: { x: rawX, y: rawY },
        animate: { scale: isHovered ? 1.04 : 1 },
        whileTap: { scale: 0.97 },
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
        className: classes,
    };

    return (
        <div ref={wrapRef} onMouseMove={handleMouseMove} onMouseLeave={reset} className="-m-3 inline-flex p-3">
            {href ? (
                <motion.a href={href} download={download} {...motionProps}>
                    {inner}
                </motion.a>
            ) : (
                <motion.button type="button" {...motionProps}>
                    {inner}
                </motion.button>
            )}
        </div>
    );
}
