import Image from "next/image";
import SectionHeader from "@/components/site/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { education, experience, journeyPhotos } from "@/utils/data/site";

const card = "rounded-2xl border border-line bg-surface p-6";

export default function Experience() {
    return (
        <section id="experience" aria-labelledby="exp-title" className="border-t border-line py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeader id="exp-title" eyebrow="Experience & Education" title="Where I work and what I studied" />
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mint">Experience</h3>
                        <Stagger as="ol" className="mt-6 space-y-4">
                            {experience.map((e) => (
                                <StaggerItem key={e.role} className={card}>
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <p className="font-display text-lg font-semibold text-ink">{e.role}</p>
                                        {e.date && <p className="font-mono text-xs text-ink-3">{e.date}</p>}
                                    </div>
                                    <p className="text-sm font-medium text-ink-2">
                                        {e.org}
                                        {e.link && (
                                            <>
                                                {" · "}
                                                <a href={e.link.href} target="_blank" rel="noopener noreferrer" className="text-mint underline-offset-4 hover:underline">
                                                    {e.link.label}
                                                </a>
                                            </>
                                        )}
                                    </p>
                                    {e.text && <p className="mt-3 text-sm leading-relaxed text-ink-3">{e.text}</p>}
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mint">Education</h3>
                        <Stagger as="ol" className="mt-6 space-y-4">
                            {education.map((e) => (
                                <StaggerItem key={e.title} className={card}>
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <p className="font-display text-lg font-semibold text-ink">{e.title}</p>
                                        <p className="font-mono text-xs text-ink-3">{e.date}</p>
                                    </div>
                                    <p className="text-sm font-medium text-ink-2">{e.org}</p>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                </div>

                <Reveal className="mt-20">
                    <h3 className="font-display text-2xl font-semibold text-ink">My journey through code</h3>
                    <p className="mt-2 max-w-xl text-sm text-ink-3">
                        A visual timeline of my development journey, capturing moments of growth, learning, and achievement.
                    </p>
                </Reveal>
                <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.05}>
                    {journeyPhotos.map((photo, i) => (
                        <StaggerItem key={photo} className="relative aspect-square overflow-hidden rounded-xl border border-line">
                            <Image
                                src={`/history/${photo}`}
                                alt={`Moment from my developer journey ${i + 1}`}
                                fill
                                sizes="(min-width: 640px) 270px, 45vw"
                                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                            />
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}
