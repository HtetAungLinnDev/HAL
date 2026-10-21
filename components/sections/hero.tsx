"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { MagneticButton } from "@/components/lightswind/magnetic-button";
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
                    <motion.h1 variants={item} className="mt-4 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]">
                        Full-Stack
                        <br className="hidden sm:block" />{" "}
                        <span className="bg-gradient-to-r from-ink via-ink to-mint bg-clip-text text-transparent">Software Engineer</span>
                    </motion.h1>
                    <motion.p variants={item} className="mt-5 text-lg font-medium text-mint">
                        Senior Developer at Ravus Law <span className="text-ink-3">·</span> CTO at PhiLo POS
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
                        <a href={personal.resume} className="group inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
                            <svg aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
                            </svg>
                            Resume (PDF)
                        </a>
                    </motion.div>
                    <motion.ul variants={item} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-ink-3" aria-label="Roles">
                        <li>Full-Stack Developer</li>
                        <li aria-hidden="true">/</li>
                        <li>Senior Developer</li>
                        <li aria-hidden="true">/</li>
                        <li>CTO</li>
                    </motion.ul>
                </motion.div>

                <motion.div
                    className="relative mx-auto w-full max-w-sm"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease, delay: 0.2 }}
                >
                    <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-mint/30 via-transparent to-iris/30 blur-2xl" aria-hidden="true" />
                    <figure className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface">
                        <Image src={personal.profile} alt="Portrait of Htet Aung Linn" width={1280} height={1280} priority sizes="(min-width: 1024px) 384px, 90vw" className="aspect-[4/5] w-full object-cover" />
                    </figure>
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease, delay: 0.7 }}
                        className="absolute -left-6 bottom-16 rounded-xl border border-line bg-surface-2/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-10"
                    >
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">CTO</p>
                        <p className="text-sm font-semibold text-ink">PhiLo POS</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease, delay: 0.85 }}
                        className="absolute -right-4 top-10 rounded-xl border border-line bg-surface-2/95 px-4 py-3 shadow-xl backdrop-blur sm:-right-8"
                    >
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">Senior Developer</p>
                        <p className="text-sm font-semibold text-ink">Ravus Law</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease, delay: 1 }}
                        className="absolute -bottom-4 right-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-xs text-ink-2 shadow-lg"
                    >
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                        </span>
                        {personal.location}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
