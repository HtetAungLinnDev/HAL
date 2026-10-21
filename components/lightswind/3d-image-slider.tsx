"use client";

/**
 * ImageSlider3D, adapted from Lightswind UI "3d-image-slider"
 * (https://lightswind.com/components/3d-image-slider, MIT).
 * Site changes: no stock default images, { src, alt } slides, optional maxSlides, pause off-screen via useInView.
 */
import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/components/lib/utils";

export type Slider3DImage = { src: string; alt: string };
export type Slider3DImageInput = string | Slider3DImage;

function normalizeImages(images: Slider3DImageInput[]): Slider3DImage[] {
    return images.map((item, i) =>
        typeof item === "string" ? { src: item, alt: `Slide ${i + 1}` } : item,
    );
}

export default function ImageSlider3D({
    images,
    duration = 32,
    cardWidth = "17.5em",
    cardAspectRatio = "7/10",
    perspective = "35em",
    containerClassName = "",
    imageClassName = "",
    rotationDirection = "left",
    withMask = true,
    maxSlides,
    ringScale = 1,
}: {
    images: Slider3DImageInput[];
    duration?: number;
    cardWidth?: string;
    cardAspectRatio?: string;
    perspective?: string;
    containerClassName?: string;
    imageClassName?: string;
    rotationDirection?: "left" | "right";
    withMask?: boolean;
    maxSlides?: number;
    ringScale?: number;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { margin: "200px" });
    const prefersReducedMotion = useReducedMotion();

    const slides = useMemo(() => {
        const list = normalizeImages(images);
        if (!maxSlides || list.length <= maxSlides) return list;
        return Array.from({ length: maxSlides }, (_, i) => list[Math.floor((i * list.length) / maxSlides)]);
    }, [images, maxSlides]);

    const n = slides.length;
    const animationDuration = prefersReducedMotion ? duration * 4 : duration;
    const rotationValues = rotationDirection === "left" ? [0, 360] : [360, 0];

    const maskStyles = withMask
        ? {
            WebkitMask: "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
            mask: "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
        }
        : {};

    if (n === 0) return null;

    return (
        <div
            ref={containerRef}
            className={cn("grid h-full min-h-[500px] w-full place-items-center overflow-hidden", containerClassName)}
            style={{ perspective, ...maskStyles }}
            role="region"
            aria-label="Photo gallery"
        >
            <motion.div
                className="pointer-events-auto grid place-self-center will-change-transform"
                style={{ transformStyle: "preserve-3d", scale: ringScale }}
                animate={isInView ? { rotateY: rotationValues } : false}
                transition={{ duration: animationDuration, ease: "linear", repeat: Infinity }}
            >
                {slides.map((slide, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        key={slide.src}
                        src={slide.src}
                        alt={slide.alt}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className={cn("col-start-1 row-start-1 rounded-[1.5em] border border-white/10 object-cover shadow-2xl shadow-black/50", imageClassName)}
                        style={{
                            width: cardWidth,
                            aspectRatio: cardAspectRatio,
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: `rotateY(calc(${i} * (1turn / ${n}))) translateZ(calc(-1 * (0.5 * ${cardWidth} + 0.5em) / tan(0.5 * (1turn / ${n}))))`,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}

export { ImageSlider3D };
