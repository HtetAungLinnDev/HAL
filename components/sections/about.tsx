import SectionHeader from "@/components/site/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { whatIDo } from "@/utils/data/site";

export default function About() {
    return (
        <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 lg:py-32">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeader id="about-title" eyebrow="About me" title="Building Scalable Software. Solving Real-World Problems." />
                <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
                    <Reveal className="space-y-5 text-[17px] leading-relaxed text-ink-2">
                        <p>
                            I’m Htet Aung Linn, a Full-Stack Software Developer and technology leader passionate about building reliable, scalable, and
                            user-focused software solutions.
                        </p>
                        <p>
                            Currently, I work as a Senior Developer at Ravus Law and serve as the Chief Technology Officer (CTO) of PhiLo POS, a
                            point-of-sale software platform designed to help businesses streamline their daily operations.
                        </p>
                        <p className="text-ink-3">
                            My work spans the entire software development lifecycle, from designing system architecture and developing responsive user
                            interfaces to building robust backend services, managing databases, and deploying applications. I enjoy turning complex
                            business requirements into practical, maintainable, and efficient software solutions.
                        </p>
                    </Reveal>
                    <Reveal as="aside" delay={0.1} className="rounded-2xl border border-line bg-surface p-7">
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-mint">My approach</h3>
                        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                            I believe great software is more than just code. It should solve real problems, create meaningful value for users, and remain
                            reliable as a business grows.
                        </p>
                        <p className="mt-3 text-[15px] leading-relaxed text-ink-3">
                            I focus on writing clean, maintainable code, choosing the right technologies for each problem, and continuously improving my
                            technical and problem-solving skills. Whether I’m developing a new feature, optimizing an existing system, or designing backend
                            infrastructure, my goal is to build software that is practical, secure, and ready for the future.
                        </p>
                        <blockquote className="mt-6 border-l-2 border-mint pl-4">
                            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Mission</p>
                            <p className="mt-1 font-display text-lg font-semibold leading-snug text-ink">
                                Build technology that makes businesses more efficient and people’s work easier.
                            </p>
                        </blockquote>
                    </Reveal>
                </div>

                <Reveal>
                    <h3 className="mt-20 font-display text-2xl font-semibold text-ink">What I do</h3>
                </Reveal>
                <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {whatIDo.map((w) => (
                        <StaggerItem
                            key={w.title}
                            className="group rounded-2xl border border-line bg-surface p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-mint/30"
                        >
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mint/10 text-mint transition-transform duration-300 group-hover:scale-110">
                                <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d={w.icon} />
                                </svg>
                            </span>
                            <h4 className="mt-4 font-display text-lg font-semibold text-ink">{w.title}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-ink-3">{w.text}</p>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}
