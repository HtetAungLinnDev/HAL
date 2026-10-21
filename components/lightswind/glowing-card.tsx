/**
 * GlowingCard (server-safe half of the adapted Lightswind GlowingCards; see glowing-cards.tsx).
 * Kept out of the "use client" module so server components can call glowCard().
 */
import React from "react";
import { cn } from "@/components/lib/utils";

/** Props to spread onto any card element (or pass to StaggerItem) to make it a GlowingCard. */
export const glowCard = (glowColor = "#34E0B0", className?: string) => ({
    className: cn("glow-card", className),
    style: { "--glow": glowColor } as React.CSSProperties,
});

export function GlowingCard({
    children,
    className,
    glowColor = "#34E0B0",
    as: Tag = "div",
}: {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    as?: "div" | "li" | "article";
}) {
    const p = glowCard(glowColor, className);
    return (
        <Tag className={p.className} style={p.style}>
            {children}
        </Tag>
    );
}
