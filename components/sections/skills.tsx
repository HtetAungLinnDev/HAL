import Image from "next/image";
import SectionHeader from "@/components/site/section-header";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { SlidingLogoMarquee } from "@/components/lightswind/sliding-logo-marquee";
import { skillGroups } from "@/utils/data/site";

const Icon = ({ name }: { name: string }) => (
    <Image src={`/svg/skills/${name}.svg`} alt="" width={18} height={18} unoptimized className="h-[18px] w-[18px] rounded bg-white p-[2px]" />
);

export default function Skills() {
    const withIcons = Array.from(
        new Map(skillGroups.flatMap((g) => g.items).filter((i) => i.icon).map((i) => [i.icon as string, i])).values(),
    );
    return (
        <section id="skills" aria-labelledby="skills-title" className="border-t border-line py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeader id="skills-title" eyebrow="Skills" title="Tools I work with every day" />
                <Reveal className="mb-10">
                    <SlidingLogoMarquee
                        speed={4}
                        height="84px"
                        gap="1rem"
                        items={withIcons.map((s) => ({
                            id: s.icon as string,
                            content: (
                                <span className="flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-2">
                                    <Image src={`/svg/skills/${s.icon}.svg`} alt="" width={24} height={24} unoptimized className="h-6 w-6 rounded bg-white p-[3px]" />
                                    {s.name}
                                </span>
                            ),
                        }))}
                    />
                </Reveal>
                <Stagger as="div" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {skillGroups.map((g) => (
                        <StaggerItem as="div" key={g.title} className="rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-white/20">
                            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mint">{g.title}</h3>
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {g.items.map((s) => (
                                    <li key={s.name} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-2.5 py-1 text-[13px] text-ink-2 transition-colors hover:border-mint/40 hover:text-ink">
                                        {s.icon && <Icon name={s.icon} />}
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}
