import SectionHeader from "@/components/site/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { GlowingCards } from "@/components/lightswind/glowing-cards";
import { glowCard } from "@/components/lightswind/glowing-card";
import { ThreeDImageCarousel } from "@/components/lightswind/three-d-image-carousel";
import { education, experience, journeyPhotos } from "@/utils/data/site";

const card = "rounded-2xl border border-line bg-surface p-6";
const MINT = "#34E0B0";
const IRIS = "#8B93FF";

export default function Experience() {
    return (
        <section id="experience" aria-labelledby="exp-title" className="border-t border-line py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeader id="exp-title" eyebrow="Experience & Education" title="Where I work and what I studied" />
                <GlowingCards className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mint">Experience</h3>
                        <Stagger as="ol" className="mt-6 space-y-4">
                            {experience.map((e) => (
                                <StaggerItem key={e.role} {...glowCard(MINT, card)}>
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <p className="font-display text-lg font-semibold text-ink">{e.role}</p>
                                        {e.date && <p className="font-mono text-xs text-ink-3">{e.date}</p>}
                                    </div>
                                    <p className="text-sm font-medium text-ink-2">
                                        {e.org}
                                        {e.link && (
                                            <>
                                                {" · "}
                                                <a
                                                    href={e.link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-mint underline-offset-4 hover:underline"
                                                >
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
                                <StaggerItem key={e.title} {...glowCard(IRIS, card)}>
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <p className="font-display text-lg font-semibold text-ink">{e.title}</p>
                                        <p className="font-mono text-xs text-ink-3">{e.date}</p>
                                    </div>
                                    <p className="text-sm font-medium text-ink-2">{e.org}</p>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                </GlowingCards>

                <Reveal className="mt-20">
                    <h3 className="font-display text-2xl font-semibold text-ink">My journey through code</h3>
                    <p className="mt-2 max-w-xl text-sm text-ink-3">
                        A visual timeline of my development journey, capturing moments of growth, learning, and achievement.
                    </p>
                </Reveal>
                <Reveal className="mt-10">
                    <ThreeDImageCarousel
                        label="My journey through code: photos"
                        slides={journeyPhotos.map((photo, i) => ({
                            src: `/history/${photo}`,
                            alt: `Moment from my developer journey, photo ${i + 1} of ${journeyPhotos.length}`,
                        }))}
                    />
                </Reveal>
            </div>
        </section>
    );
}
