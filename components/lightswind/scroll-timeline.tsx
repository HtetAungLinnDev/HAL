"use client";

/**
 * Scroll-linked vertical timeline for long-form sections (e.g. project portfolio).
 * Progress line fills as the user scrolls; centered rail with alternating media and copy on large screens.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import BrowserFrame from "@/components/site/browser-frame";
import { InteractiveCard } from "@/components/lightswind/interactive-card";
import type { Project } from "@/utils/data/site";
import { cn } from "@/components/lib/utils";

const ExternalIcon = () => (
    <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.59l-6.3 6.29a1 1 0 101.42 1.42L15 6.41V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);

const Stack = ({ items }: { items: string[] }) => (
    <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
        {items.map((s) => (
            <li key={s} className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-ink-2">
                {s}
            </li>
        ))}
    </ul>
);

const RoleBadge = ({ role }: { role: string }) => (
    <span className="rounded-full border border-iris/50 bg-iris/10 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-[#C9CCFF]">
        Role · {role}
    </span>
);

const StatusBadge = ({ status }: { status: NonNullable<Project["status"]> }) => {
    if (status === "live") {
        return (
            <span className="rounded-full border border-mint/40 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-mint">
                Live
            </span>
        );
    }
    return (
        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-amber-200">
            In development
        </span>
    );
};

function projectCoverAlt(p: Project) {
    if (!p.image) return `${p.name} preview placeholder`;
    if (p.name === "Ravus AI FX - Ghost Candle Projection") {
        return "Ravus AI FX Ghost Candle Projection dashboard showing EUR/USD ghost candles and quantile ranges";
    }
    if (p.name === "MyTogether") return "Screenshot of the MyTogether website at mytogether.org";
    if (p.name === "Raveon Live" || p.name === "Raveon Live Mini") {
        return "Raveon Live - projection control on laptop and monitor with venue screens in the background";
    }
    return `Screenshot of ${p.displayUrl}`;
}

function TimelineStep({ p, index, listIndex }: { p: Project; index: number; listIndex: number }) {
    const imageFirst = listIndex % 2 === 0;
    const accent = listIndex % 2 ? "rgba(139,147,255,0.14)" : "rgba(52,224,176,0.12)";

    return (
        <motion.li
            className="relative"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
            <div
                className="absolute left-5 top-10 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs font-semibold text-mint shadow-lg shadow-black/40 lg:left-1/2"
                aria-hidden="true"
            >
                {String(index).padStart(2, "0")}
            </div>

            <div className="grid gap-8 pb-20 pl-14 last:pb-4 lg:grid-cols-2 lg:gap-12 lg:pl-0 lg:pb-28">
                <div className={cn("min-w-0", imageFirst ? "lg:order-1 lg:pr-10" : "lg:order-2 lg:pl-10")}>
                    <InteractiveCard interactiveColor={accent} className="overflow-hidden rounded-2xl border border-line bg-surface/80 shadow-xl shadow-black/20">
                        <div className="p-3 sm:p-4">
                            <BrowserFrame
                                url={p.displayUrl}
                                image={p.image}
                                alt={projectCoverAlt(p)}
                                placeholder={p.name}
                                position={p.imagePosition}
                                aspect="aspect-[16/10]"
                                sizes="(min-width: 1024px) 480px, 92vw"
                                zoomOnHover
                            />
                        </div>
                    </InteractiveCard>
                </div>

                <div className={cn("flex flex-col justify-center", imageFirst ? "lg:order-2 lg:pl-10" : "lg:order-1 lg:pr-10")}>
                    <InteractiveCard
                        tilt={false}
                        interactiveColor={accent}
                        className="overflow-hidden rounded-2xl border border-line bg-surface/60 backdrop-blur-sm"
                    >
                        <article className="relative z-[1] p-6 sm:p-8">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                                    {p.market}
                                    {p.label ? ` · ${p.label}` : ""}
                                    {p.client && p.client !== p.label ? ` · ${p.client}` : ""}
                                </span>
                                {p.status && <StatusBadge status={p.status} />}
                                {p.role && <RoleBadge role={p.role} />}
                            </div>
                            <h4 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{p.name}</h4>
                            {p.scope && <p className="mt-2 text-sm leading-relaxed text-ink-3">{p.scope}</p>}
                            <p className="mt-3 text-base font-medium text-ink-2">{p.tagline}</p>
                            <p className="mt-4 text-sm leading-relaxed text-ink-3">{p.description}</p>

                            <h5 className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-mint">Key features</h5>
                            <ul className="mt-3 space-y-2.5" aria-label="Key features">
                                {p.features.map((f) => (
                                    <li key={f} className="flex gap-2.5 text-sm leading-snug text-ink-2">
                                        <svg aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-mint" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {p.stack && (
                                <div className="mt-6">
                                    <h5 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Stack</h5>
                                    <div className="mt-3">
                                        <Stack items={p.stack} />
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 border-t border-line pt-6">
                                {p.url && p.linkLabel ? (
                                    <a
                                        href={p.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/link inline-flex items-center gap-2 rounded-lg bg-mint px-5 py-2.5 text-sm font-semibold text-bg transition hover:-translate-y-0.5 hover:bg-[#5ef0c6]"
                                    >
                                        {p.linkLabel}
                                        <ExternalIcon />
                                        <span className="sr-only">: {p.name} (opens in a new tab)</span>
                                    </a>
                                ) : (
                                    <p className="text-sm text-ink-3">
                                        {p.status === "in-development" ? "No public link - product unreleased." : "No public link."}
                                    </p>
                                )}
                            </div>
                        </article>
                    </InteractiveCard>
                </div>
            </div>
        </motion.li>
    );
}

export function ProjectsScrollTimeline({ projects, startIndex = 2 }: { projects: Project[]; startIndex?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.2"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
    const scaleY = useTransform(smooth, [0, 1], [0, 1]);

    return (
        <div ref={ref} className="relative mt-4">
            <div className="pointer-events-none absolute bottom-0 left-5 top-0 w-px bg-line lg:left-1/2 lg:-translate-x-px" aria-hidden="true" />
            {!reduce && (
                <motion.div
                    className="pointer-events-none absolute bottom-0 left-5 top-0 w-px origin-top bg-gradient-to-b from-mint via-[#3fb7c9] to-iris lg:left-1/2 lg:-translate-x-px"
                    style={{ scaleY }}
                    aria-hidden="true"
                />
            )}

            <ol className="relative list-none">
                {projects.map((p, i) => (
                    <TimelineStep key={p.name} p={p} index={startIndex + i} listIndex={i} />
                ))}
            </ol>
        </div>
    );
}

export default ProjectsScrollTimeline;
