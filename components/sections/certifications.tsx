import Image from "next/image";
import SectionHeader from "@/components/site/section-header";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { GlowingCards } from "@/components/lightswind/glowing-cards";
import { glowCard } from "@/components/lightswind/glowing-card";
import { certifications } from "@/utils/data/site";

export default function Certifications() {
    return (
        <section id="certifications" aria-labelledby="cert-title" className="border-t border-line py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeader id="cert-title" eyebrow="Certifications" title="Courses and training" />
                <GlowingCards>
                    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                        {certifications.map((c, i) => (
                            <StaggerItem
                                key={c.title}
                                {...glowCard(i % 2 ? "#8B93FF" : "#34E0B0", "group overflow-hidden rounded-2xl border border-line bg-surface")}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                                    <Image
                                        src={c.image}
                                        alt={`${c.title} certificate from ${c.org}`}
                                        fill
                                        quality={90}
                                        sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-5">
                                    <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">{c.date}</p>
                                    <h3 className="mt-1.5 font-display text-base font-semibold text-ink">{c.title}</h3>
                                    <p className="mt-1 text-sm text-ink-3">{c.org}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </GlowingCards>
            </div>
        </section>
    );
}
