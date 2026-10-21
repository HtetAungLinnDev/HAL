import Image from "next/image";
import SectionHeader from "@/components/site/section-header";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { ChainCarousel } from "@/components/lightswind/chain-carousel";
import { GlowingCards } from "@/components/lightswind/glowing-cards";
import { glowCard } from "@/components/lightswind/glowing-card";
import { skillGroups } from "@/utils/data/site";

const Icon = ({ name }: { name: string }) => (
    <Image src={`/svg/skills/${name}.svg`} alt="" width={18} height={18} unoptimized className="h-[18px] w-[18px] rounded bg-white p-[2px]" />
);

export default function Skills() {
    // Unique skills that have a logo, labelled with their category, for the chain carousel.
    const withIcons = Array.from(
        new Map(skillGroups.flatMap((g) => g.items.filter((i) => i.icon).map((i) => [i.icon as string, { ...i, group: g.title }] as const))).values(),
    );
    return (
        <section id="skills" aria-labelledby="skills-title" className="border-t border-line py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeader id="skills-title" eyebrow="Skills" title="Tools I work with every day" />
                <Reveal className="mb-12">
                    <ChainCarousel
                        label="Skills I work with"
                        items={withIcons.map((s) => ({ id: s.icon as string, name: s.name, details: s.group, logo: `/svg/skills/${s.icon}.svg` }))}
                    />
                </Reveal>
                <GlowingCards>
                    <Stagger as="div" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {skillGroups.map((g, i) => (
                            <StaggerItem as="div" key={g.title} {...glowCard(i % 2 ? "#8B93FF" : "#34E0B0", "rounded-2xl border border-line bg-surface p-6")}>
                                <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mint">{g.title}</h3>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                    {g.items.map((s) => (
                                        <li
                                            key={s.name}
                                            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-2.5 py-1 text-[13px] text-ink-2 transition-colors hover:border-mint/40 hover:text-ink"
                                        >
                                            {s.icon && <Icon name={s.icon} />}
                                            {s.name}
                                        </li>
                                    ))}
                                </ul>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </GlowingCards>
            </div>
        </section>
    );
}
