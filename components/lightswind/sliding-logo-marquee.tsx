"use client";

// Lightswind UI "sliding-logo-marquee" (https://lightswind.com/components/sliding-logo-marquee),
// copied as source. Local changes for accessibility/performance:
// - the scrolling strip is decorative (aria-hidden) and items are not focusable;
//   the same content is listed accessibly elsewhere (the Skills grid);
// - the progressive backdrop-blur edges and spill effect were removed (expensive),
//   a CSS mask fades the edges instead;
// - animation stops for prefers-reduced-motion; the pause/play button is kept (WCAG 2.2.2).
import React, { useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/components/lib/utils";

export interface SlidingLogoMarqueeItem {
    id: string;
    content: React.ReactNode;
}

export interface SlidingLogoMarqueeProps {
    items: SlidingLogoMarqueeItem[];
    speed?: number;
    pauseOnHover?: boolean;
    height?: string;
    gap?: string;
    className?: string;
    showControls?: boolean;
}

export function SlidingLogoMarquee({
    items,
    speed = 1,
    pauseOnHover = true,
    height = "100px",
    gap = "2rem",
    className,
    showControls = true,
}: SlidingLogoMarqueeProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const doubled = useMemo(() => [...items, ...items], [items]);
    const running = isPlaying && !(pauseOnHover && isHovered);

    return (
        <div
            className={cn("lw-marquee relative", className)}
            data-running={running}
            style={{ "--speed": speed, "--gap": gap, height } as React.CSSProperties}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="lw-marquee-inner" aria-hidden="true">
                <ul className="lw-marquee-list" style={{ paddingRight: gap }}>
                    {doubled.map((item, i) => (
                        <li key={`${item.id}-${i}`} className="grid place-items-center">
                            {item.content}
                        </li>
                    ))}
                </ul>
            </div>
            {showControls && (
                <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-line bg-surface-2/90 p-2 text-ink-2 transition-colors hover:text-ink motion-reduce:hidden"
                    aria-label={isPlaying ? "Pause skills animation" : "Play skills animation"}
                >
                    {isPlaying ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
                </button>
            )}
        </div>
    );
}
