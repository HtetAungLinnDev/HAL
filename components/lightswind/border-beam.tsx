"use client";

// Lightswind UI "border-beam" (https://lightswind.com/components/border-beam),
// copied as source per Lightswind's CLI model. Local changes: typed props
// (no `any`), and the beam is not rendered when the user prefers reduced motion.
import React from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/components/lib/utils";

interface BorderBeamProps {
    size?: number;
    duration?: number;
    delay?: number;
    colorFrom?: string;
    colorTo?: string;
    transition?: Transition;
    className?: string;
    style?: React.CSSProperties;
    reverse?: boolean;
    initialOffset?: number;
    opacity?: number;
    glowIntensity?: number;
    beamBorderRadius?: number;
}

export const BorderBeam = ({
    className,
    size = 50,
    delay = 0,
    duration = 6,
    colorFrom = "#7400ff",
    colorTo = "#9b41ff",
    transition,
    style,
    reverse = false,
    initialOffset = 0,
    opacity = 1,
    glowIntensity = 0,
    beamBorderRadius,
}: BorderBeamProps) => {
    const reduceMotion = useReducedMotion();
    if (reduceMotion) return null;

    const glowEffect =
        glowIntensity > 0 ? `0 0 ${glowIntensity * 5}px ${glowIntensity * 2}px var(--color-from)` : undefined;

    const beamStyle = {
        width: size,
        offsetPath: `rect(0 auto auto 0 round ${beamBorderRadius ?? size}px)`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        opacity,
        boxShadow: glowEffect,
        borderRadius: beamBorderRadius ? `${beamBorderRadius}px` : undefined,
        ...style,
    } as React.CSSProperties;

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
        >
            <motion.div
                className={cn(
                    "absolute aspect-square",
                    "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
                    className,
                )}
                style={beamStyle}
                initial={{ offsetDistance: `${initialOffset}%` }}
                animate={{
                    offsetDistance: reverse
                        ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
                        : [`${initialOffset}%`, `${100 + initialOffset}%`],
                }}
                transition={{ repeat: Infinity, ease: "linear", duration, delay: -delay, ...transition }}
            />
        </div>
    );
};
