"use client";

/**
 * MagicLoader, adapted from Lightswind UI (https://lightswind.com, MIT, @codewithmuhilan).
 * Same canvas effect (a spiralling, hue-shifting particle trail with sparkles).
 * Changes for this site: the loop only runs while `active` is true; optional tickStep speeds the ring up for a short splash and stops itself when
 * unmounted; the colour range defaults to the site's mint-to-indigo palette; canvas sizing
 * is set once per mount (devicePixelRatio aware); decorative (aria-hidden).
 */
import React, { useEffect, useRef } from "react";
import { cn } from "@/components/lib/utils";

interface Particle {
    radius: number;
    x: number;
    y: number;
    angle: number;
    speed: number;
    accel: number;
    decay: number;
    life: number;
}

const DEFAULT_HUE: [number, number] = [160, 245];

export function MagicLoader({
    size = 160,
    particleCount = 2,
    speed = 1,
    hueRange = DEFAULT_HUE,
    active = true,
    tickStep = 1,
    className,
}: {
    size?: number;
    particleCount?: number;
    speed?: number;
    hueRange?: [number, number];
    active?: boolean;
    /** How fast the emitter travels around the ring (1 = original). */
    tickStep?: number;
    className?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);
        ctx.globalCompositeOperation = "lighter";

        const particles: Particle[] = [];
        let tick = 0;
        let globalAngle = 0;
        let globalRotation = 0;
        let raf = 0;
        const c = size / 2;
        const minSize = size * 0.5;
        const span = hueRange[1] - hueRange[0];

        const frame = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    radius: 7,
                    x: c + (Math.cos(tick / 20) * minSize) / 2,
                    y: c + (Math.sin(tick / 20) * minSize) / 2,
                    angle: globalRotation + globalAngle,
                    speed: 0,
                    accel: 0.01,
                    decay: 0.01,
                    life: 1,
                });
            }
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.speed += p.accel;
                p.x += Math.cos(p.angle) * p.speed * speed;
                p.y += Math.sin(p.angle) * p.speed * speed;
                p.angle += Math.PI / 64;
                p.accel *= 1.01;
                p.life -= p.decay;
                if (p.life <= 0) particles.splice(i, 1);
            }
            ctx.clearRect(0, 0, size, size);
            particles.forEach((p, i) => {
                const hue = hueRange[0] + ((tick + p.life * 120) % span);
                ctx.fillStyle = ctx.strokeStyle = `hsla(${hue}, 90%, 62%, ${p.life})`;
                const prev = particles[i - 1];
                if (prev) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(prev.x, prev.y);
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.001, p.life * p.radius), 0, Math.PI * 2);
                ctx.fill();
                const s = Math.random() * 1.25;
                ctx.fillRect(Math.floor(p.x + (Math.random() - 0.5) * 35 * p.life), Math.floor(p.y + (Math.random() - 0.5) * 35 * p.life), s, s);
            });
            globalRotation += (Math.PI / 6) * speed;
            globalAngle += (Math.PI / 6) * speed;
            tick += tickStep;
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [active, size, particleCount, speed, hueRange, tickStep]);

    return (
        <div className={cn("flex items-center justify-center", className)} aria-hidden="true">
            <canvas ref={canvasRef} style={{ width: size, height: size }} />
        </div>
    );
}

export default MagicLoader;
