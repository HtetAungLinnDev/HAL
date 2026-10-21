import SectionHeader from "@/components/site/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { GlowingCards } from "@/components/lightswind/glowing-cards";
import { glowCard } from "@/components/lightswind/glowing-card";
import ImageSlider3D from "@/components/lightswind/3d-image-slider";
import { education, experience, type ExperienceEntry, journeyPhotos } from "@/utils/data/site";

const card = "rounded-2xl border border-line bg-surface p-6";
const MINT = "#34E0B0";
const IRIS = "#8B93FF";

function groupExperienceByOrg(entries: ExperienceEntry[]) {
    const groups: { org: string; entries: ExperienceEntry[] }[] = [];
    for (const entry of entries) {
        const last = groups[groups.length - 1];
        if (last && last.org === entry.org) {
            last.entries.push(entry);
        } else {
            groups.push({ org: entry.org, entries: [entry] });
        }
    }
    return groups;
}

function ExperienceMeta({ entry }: { entry: ExperienceEntry }) {
    const orgLine = [entry.org, entry.detail].filter(Boolean).join(" · ");
    return (
        <>
            <p className="text-sm font-medium text-ink-2">
                {orgLine}
                {entry.link && (
                    <>
                        {" · "}
                        <a
                            href={entry.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mint underline-offset-4 hover:underline"
                        >
                            {entry.link.label}
                        </a>
                    </>
                )}
            </p>
            {entry.location && <p className="mt-1 text-xs text-ink-3">{entry.location}</p>}
            {entry.text && <p className="mt-3 text-sm leading-relaxed text-ink-3">{entry.text}</p>}
            {entry.skills && entry.skills.length > 0 && (
                <p className="mt-2 font-mono text-[11px] text-ink-3">Skills: {entry.skills.join(", ")}</p>
            )}
        </>
    );
}

function ExperienceRoleBlock({ entry, nested }: { entry: ExperienceEntry; nested?: boolean }) {
    return (
        <div className={nested ? "relative pl-5" : undefined}>
            {nested && (
                <span
                    className="absolute left-0 top-2 h-[calc(100%-0.25rem)] w-px bg-line"
                    aria-hidden="true"
                />
            )}
            {nested && <span className="absolute left-0 top-2 h-2 w-2 -translate-x-1/2 rounded-full border border-line bg-surface" aria-hidden="true" />}
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className={`font-display font-semibold text-ink ${nested ? "text-base" : "text-lg"}`}>{entry.role}</p>
                {entry.date && <p className="font-mono text-xs text-ink-3">{entry.date}</p>}
            </div>
            {nested ? (
                <>
                    {entry.location && <p className="mt-1 text-xs text-ink-3">{entry.location}</p>}
                    {entry.text && <p className="mt-2 text-sm leading-relaxed text-ink-3">{entry.text}</p>}
                    {entry.skills && entry.skills.length > 0 && (
                        <p className="mt-2 font-mono text-[11px] text-ink-3">Skills: {entry.skills.join(", ")}</p>
                    )}
                </>
            ) : (
                <ExperienceMeta entry={entry} />
            )}
        </div>
    );
}

export default function Experience() {
    const workGroups = groupExperienceByOrg(experience);

    return (
        <section id="experience" aria-labelledby="exp-title" className="border-t border-line py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeader
                    id="exp-title"
                    eyebrow="Experience"
                    title="Work and formal education"
                    intro="Roles I’ve held in product and client teams, plus my university and school background. Professional courses and certificates are listed under Certifications."
                />
                <GlowingCards className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mint">Work experience</h3>
                        <Stagger as="ol" className="mt-6 space-y-4">
                            {workGroups.map((group) => (
                                <StaggerItem key={group.org} {...glowCard(MINT, card)}>
                                    {group.entries.length === 1 ? (
                                        <>
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <p className="font-display text-lg font-semibold text-ink">{group.entries[0].role}</p>
                                                {group.entries[0].date && (
                                                    <p className="font-mono text-xs text-ink-3">{group.entries[0].date}</p>
                                                )}
                                            </div>
                                            <ExperienceMeta entry={group.entries[0]} />
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-display text-lg font-semibold text-ink">{group.org}</p>
                                            {group.entries[0].detail && (
                                                <p className="mt-1 text-sm font-medium text-ink-2">{group.entries[0].detail}</p>
                                            )}
                                            <ol className="mt-5 space-y-6">
                                                {group.entries.map((entry) => (
                                                    <li key={entry.role}>
                                                        <ExperienceRoleBlock entry={entry} nested />
                                                    </li>
                                                ))}
                                            </ol>
                                        </>
                                    )}
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mint">Formal education</h3>
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
                <Reveal className="mt-10 cascade--journey rounded-2xl px-2 py-6 sm:px-6 sm:py-10">
                    <ImageSlider3D
                        maxSlides={12}
                        images={journeyPhotos.map((photo, i) => ({
                            src: `/history/${photo}`,
                            alt: `Moment from my developer journey, photo ${i + 1} of ${journeyPhotos.length}`,
                        }))}
                        duration={50}
                        cardWidth="20rem"
                        cardAspectRatio="7/10"
                        perspective="54rem"
                        ringScale={1.1}
                        containerClassName="min-h-[500px] sm:min-h-[560px] bg-transparent"
                    />
                </Reveal>
            </div>
        </section>
    );
}
