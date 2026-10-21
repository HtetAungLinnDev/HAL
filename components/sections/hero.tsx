"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { MagneticButton } from "@/components/lightswind/magnetic-button";
import { HangingIdCard } from "@/components/lightswind/hanging-id-card";
import { personal } from "@/utils/data/site";

const ease = [0.22, 1, 0.36, 1] as const;
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };

export default function Hero() {
    return (
        <section id="top" aria-label="Introduction" className="relative overflow-hidden">
            {/* Animated glow background: transform-only CSS keyframes, paused for reduced motion */}
            <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -top-48 left-[10%] h-[520px] w-[620px] animate-drift rounded-full bg-mint/[0.12] blur-[110px] will-change-transform" />
                <div className="absolute -top-24 right-[5%] h-[460px] w-[520px] animate-drift-slow rounded-full bg-iris/[0.16] blur-[120px] will-change-transform" />
            </div>

            <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:pb-32 lg:pt-24">
                <motion.div variants={container} initial="hidden" animate="show">
                    <motion.p variants={item} className="font-display text-lg text-ink-2">
                        Hi, I’m {personal.name} <span aria-hidden="true">👋</span>
                    </motion.p>
                    <motion.h1
                        variants={item}
                        className="mt-4 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]"
                    >
                        Full-Stack
                        <br className="hidden sm:block" />{" "}
                        <span className="bg-gradient-to-r from-ink via-ink to-mint bg-clip-text text-transparent">Software Engineer</span>
                    </motion.h1>
                    <motion.p variants={item} className="mt-5 text-lg font-medium text-mint">
                        <span className="whitespace-nowrap">Senior Developer at Ravus Law</span> <span className="text-ink-3">·</span>{" "}
                        <span className="whitespace-nowrap">Co-Founder &amp; CTO at PhiLo POS</span>
                    </motion.p>
                    <motion.p variants={item} className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">
                        I build scalable web applications, robust backend systems, and practical software solutions that solve real-world problems.
                    </motion.p>
                    <motion.p variants={item} className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-3">
                        From frontend experiences with React and Next.js to backend engineering with Laravel and Node.js, I enjoy working across the entire
                        technology stack to turn ideas into reliable products.
                    </motion.p>
                    <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
                        <MagneticButton href="#projects" className="bg-mint px-5 py-3 text-sm text-bg shadow-lg shadow-mint/20 hover:bg-[#5ef0c6]">
                            View projects <span aria-hidden="true">→</span>
                        </MagneticButton>
                        <MagneticButton href="#contact" className="border border-white/15 px-5 py-3 text-sm text-ink hover:border-white/40">
                            Contact me
                        </MagneticButton>
                        <a
                            href={personal.resume}
                            className="group inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-ink-2 transition-colors hover:text-ink"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
                            </svg>
                            Resume (PDF)
                        </a>
                    </motion.div>
                    <motion.ul
                        variants={item}
                        className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-ink-3"
                        aria-label="Roles"
                    >
                        <li>Full-Stack Developer</li>
                        <li aria-hidden="true">/</li>
                        <li>Senior Developer</li>
                        <li aria-hidden="true">/</li>
                        <li>Co-Founder &amp; CTO</li>
                    </motion.ul>
                </motion.div>

                <motion.div
                    className="relative mx-auto w-full max-w-sm"
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.15 }}
                >
                    <div
                        className="absolute inset-x-6 top-24 bottom-10 rounded-[2rem] bg-gradient-to-br from-mint/25 via-transparent to-iris/25 blur-3xl"
                        aria-hidden="true"
                    />
                    <HangingIdCard
                        ropeLength={84}
                        className="relative -mt-4 lg:-mt-24"
                        cardClassName="w-[17rem] sm:w-72"
                        label="ID card of Htet Aung Linn. Press Enter to swing it."
                    >
                        <div className="relative h-14 bg-gradient-to-r from-mint/80 via-[#3fb7c9] to-iris/90" aria-hidden="true">
                            <span className="absolute left-3 top-3 grid h-5 w-6 grid-cols-2 gap-px rounded-[3px] border border-amber-500/80 bg-amber-300/90 p-px shadow-sm">
                                <span className="bg-amber-600/40" />
                                <span className="bg-amber-600/40" />
                                <span className="bg-amber-600/40" />
                                <span className="bg-amber-600/40" />
                            </span>
                            <span className="absolute right-3 top-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-bg/80">Engineer</span>
                        </div>
                        <div className="relative mx-auto -mt-8 h-36 w-36 overflow-hidden rounded-2xl border-4 border-surface bg-surface-2 shadow-xl sm:h-40 sm:w-40">
                            <Image
                                src={personal.profile}
                                alt="Portrait of Htet Aung Linn"
                                width={800}
                                height={800}
                                priority
                                quality={90}
                                sizes="320px"
                                className="h-full w-full scale-[2] object-cover"
                                // Original 800x800 file, framed with CSS only: a 2x zoom around this origin
                                // centres his face and shoulders in the square photo slot.
                                style={{ transformOrigin: "64% 18%" }}
                                draggable={false}
                            />
                        </div>
                        <div className="px-5 pb-5 pt-4 text-center">
                            <p className="font-display text-xl font-bold text-ink">{personal.name}</p>
                            <p className="mt-0.5 text-sm font-medium text-mint">Full-Stack Software Engineer</p>
                            <dl className="mt-4 space-y-2 text-left text-[13px]">
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2">
                                    <dt className="text-ink">Co-Founder &amp; CTO</dt>
                                    <dd className="font-mono text-[11px] text-ink-3">PhiLo POS</dd>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2">
                                    <dt className="text-ink">Senior Developer</dt>
                                    <dd className="font-mono text-[11px] text-ink-3">Ravus Law</dd>
                                </div>
                            </dl>
                            <p className="mt-3 inline-flex items-center gap-2 text-xs text-ink-2">
                                <span className="relative flex h-2 w-2" aria-hidden="true">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                                </span>
                                {personal.location}
                            </p>
                            <div className="mt-4 flex h-6 items-end justify-center gap-[2px]" aria-hidden="true">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className="rounded-[1px] bg-ink-2/80"
                                        style={{ width: i % 3 === 0 ? 3 : 1.5, height: `${30 + ((i * 37) % 11) * 6}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </HangingIdCard>
                </motion.div>
            </div>
        </section>
    );
}
