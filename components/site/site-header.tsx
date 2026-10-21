"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, personal } from "@/utils/data/site";

export default function SiteHeader() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<string>("");

    // Active-section indicator: watch which section is in the middle of the viewport.
    useEffect(() => {
        const ids = navLinks.map((l) => l.href.slice(1));
        const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.id;
                    if (entry.isIntersecting) setActive(id);
                    // Clear the pill when its section leaves the middle band (e.g. back at the hero).
                    else setActive((prev) => (prev === id ? "" : prev));
                });
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );
        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-lg">
            <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                <a href="#top" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                    <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
                    <span className="font-display text-[15px] font-semibold text-ink">{personal.name}</span>
                </a>
                <ul className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => {
                        const isActive = active === link.href.slice(1);
                        return (
                            <li key={link.href} className="relative">
                                <a
                                    href={link.href}
                                    aria-current={isActive ? "true" : undefined}
                                    className={`relative z-10 block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? "text-ink" : "text-ink-2 hover:text-ink"}`}
                                >
                                    {link.name}
                                </a>
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-active"
                                        aria-hidden="true"
                                        className="absolute inset-0 rounded-md border border-mint/30 bg-mint/10"
                                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
                <div className="flex items-center gap-2">
                    <a
                        href={personal.resume}
                        className="hidden rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-bg transition hover:-translate-y-0.5 hover:bg-[#5ef0c6] sm:inline-flex"
                    >
                        Resume
                    </a>
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-white/25 lg:hidden"
                        aria-controls="mobile-menu"
                        aria-expanded={open}
                        aria-label={open ? "Close menu" : "Open menu"}
                        onClick={() => setOpen((o) => !o)}
                    >
                        <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                            <motion.path initial={false} animate={{ d: open ? "M6 6L18 18" : "M4 7L20 7" }} transition={{ duration: 0.25 }} />
                            <motion.path initial={false} animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.15 }} d="M4 12L20 12" />
                            <motion.path initial={false} animate={{ d: open ? "M6 18L18 6" : "M4 17L20 17" }} transition={{ duration: 0.25 }} />
                        </svg>
                    </button>
                </div>
            </nav>
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-menu"
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute inset-x-0 top-full border-b border-line bg-bg px-5 pb-5 pt-2 shadow-2xl shadow-black/60 lg:hidden"
                    >
                        <motion.ul
                            className="flex flex-col"
                            initial="hidden"
                            animate="show"
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                        >
                            {navLinks.map((link) => (
                                <motion.li key={link.href} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}>
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        aria-current={active === link.href.slice(1) ? "true" : undefined}
                                        className="block rounded-lg px-4 py-3 text-base text-ink-2 hover:bg-white/5 hover:text-ink aria-[current=true]:text-mint"
                                    >
                                        {link.name}
                                    </a>
                                </motion.li>
                            ))}
                        </motion.ul>
                        <a href={personal.resume} className="mt-3 flex justify-center rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-bg">
                            Download resume
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
