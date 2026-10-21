import Image from "next/image";
import SectionHeader from "@/components/site/section-header";
import BrowserFrame from "@/components/site/browser-frame";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { BorderBeam } from "@/components/lightswind/border-beam";
import { featuredProject as fp, projects, type Project } from "@/utils/data/site";

const ExternalIcon = () => (
    <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.59l-6.3 6.29a1 1 0 101.42 1.42L15 6.41V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);

const Stack = ({ items }: { items: string[] }) => (
    <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
        {items.map((s) => (
            <li key={s} className="rounded-full bg-mint/10 px-2.5 py-1 font-mono text-[12px] text-mint">
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

function Featured() {
    return (
        <Reveal as="article" className="relative overflow-hidden rounded-3xl border border-line bg-surface">
            <BorderBeam size={280} duration={12} colorFrom="#34E0B0" colorTo="#8B93FF" beamBorderRadius={24} />
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-iris/20 blur-[110px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-mint/10 blur-[110px]" aria-hidden="true" />
            <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-12 lg:p-12">
                <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-mint px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-bg">Featured product</span>
                        <RoleBadge role={fp.role} />
                    </div>
                    <h3 id="philo-title" className="mt-5 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                        {fp.name}
                    </h3>
                    <p className="mt-3 text-lg font-medium text-ink">{fp.tagline}</p>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-3">{fp.description}</p>
                    <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Key features</h4>
                    <Stagger className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" stagger={0.05}>
                        {fp.features.map((f) => (
                            <StaggerItem key={f} className="flex items-center gap-2.5 rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-sm text-ink-2">
                                <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-mint" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
                                </svg>
                                {f}
                            </StaggerItem>
                        ))}
                    </Stagger>
                    <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">The product suite</h4>
                    <ul className="mt-3 grid grid-cols-2 gap-2">
                        {fp.apps.map((a) => (
                            <li key={a.name} className="rounded-lg bg-white/[0.03] px-3 py-2.5">
                                <p className="text-sm font-medium text-ink">{a.name}</p>
                                <p className="font-mono text-[11px] text-ink-3">{a.platforms}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8">
                        <Stack items={fp.stack} />
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <a
                            href={fp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-2 rounded-lg bg-mint px-5 py-3 text-sm font-semibold text-bg shadow-lg shadow-mint/20 transition hover:-translate-y-0.5 hover:bg-[#5ef0c6]"
                        >
                            Visit {fp.displayUrl} <ExternalIcon />
                            <span className="sr-only">(opens in a new tab)</span>
                        </a>
                        <span className="text-xs text-ink-3">Source code is private</span>
                    </div>
                </div>
                <div className="group relative self-center pb-10 lg:pb-0">
                    <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
                        <BrowserFrame url={fp.displayUrl} image={fp.image} alt="Screenshot of the philo.asia website" sizes="(min-width: 1024px) 560px, 90vw" zoomOnHover />
                    </div>
                    <div className="absolute -bottom-2 right-2 w-[34%] max-w-[180px] rounded-[1.6rem] border-[5px] border-[#1c2336] bg-[#1c2336] shadow-2xl shadow-black/60 transition-transform duration-500 ease-out group-hover:-translate-y-3 sm:-bottom-8 sm:-right-4">
                        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.25rem]">
                            <Image src={fp.mobileImage} alt="philo.asia on a phone" fill sizes="180px" className="object-cover object-top" />
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
    return (
        <StaggerItem as="li" className="h-full">
            <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-white/20 sm:p-5">
                {/* hover glow (opacity only) */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(600px_circle_at_50%_0%,rgba(52,224,176,0.12),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <BrowserFrame
                    url={p.displayUrl}
                    image={p.image}
                    alt={p.image ? `Screenshot of ${p.displayUrl}` : p.name}
                    placeholder={p.name}
                    position={p.imagePosition}
                    aspect="aspect-[16/9]"
                    sizes="(min-width: 768px) 540px, 92vw"
                    zoomOnHover
                />
                <div className="relative flex flex-1 flex-col px-1 pt-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                            {String(index + 2).padStart(2, "0")} · {p.market}
                            {p.label ? ` · ${p.label}` : ""}
                        </span>
                        {p.role && <RoleBadge role={p.role} />}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
                    <p className="mt-1 text-[15px] font-medium text-ink-2">{p.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-3">{p.description}</p>
                    <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-ink-2" aria-label="Key features">
                        {p.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" aria-hidden="true" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    {p.stack && (
                        <div className="mt-5">
                            <Stack items={p.stack} />
                        </div>
                    )}
                    <div className="mt-auto pt-6">
                        <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-mint hover:text-mint"
                        >
                            {p.linkLabel}
                            <span className="sr-only">: {p.name} (opens in a new tab)</span> <ExternalIcon />
                        </a>
                    </div>
                </div>
            </article>
        </StaggerItem>
    );
}

export default function Projects() {
    return (
        <section id="projects" aria-labelledby="projects-title" className="border-t border-line bg-[linear-gradient(180deg,#0A0E17,#0C1220_40%,#0A0E17)] py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeader
                    id="projects-title"
                    eyebrow="Projects"
                    title="Products I’ve built and shipped"
                    intro="From a point-of-sale platform I lead as CTO to client and team projects delivered for businesses in Myanmar and Japan."
                />
                <Featured />
                <Reveal>
                    <h3 className="mb-6 mt-20 font-display text-2xl font-semibold text-ink">Client &amp; team projects</h3>
                </Reveal>
                <Stagger className="grid gap-6 md:grid-cols-2" stagger={0.1}>
                    {projects.map((p, i) => (
                        <ProjectCard key={p.name} p={p} index={i} />
                    ))}
                </Stagger>
            </div>
        </section>
    );
}
