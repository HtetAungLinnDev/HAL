"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personal, socials } from "@/utils/data/site";

type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const icons: Record<string, string> = {
    github: "M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z",
    linkedin: "M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H9z",
    stackoverflow: "M17.4 20.4v-5.3h1.8V22H3v-6.9h1.8v5.3zM6.8 14.6l8.8 1.8.4-1.7-8.8-1.8zm1.2-4.2l8.2 3.8.7-1.6-8.2-3.8zm2.3-4l6.9 5.8 1.1-1.4-6.9-5.8zM14.8 2l-1.4 1.1 5.4 7.2 1.4-1.1zM6.6 18.7h9v-1.8h-9z",
    facebook: "M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z",
};

const inputClass =
    "mt-2 w-full rounded-lg border bg-bg px-4 py-3 text-ink placeholder:text-ink-3/70 transition-colors focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/20";

export default function Contact() {
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
        setStatus("sending");
        setErrors({});
        setMessage("");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string; errors?: FieldErrors };
            if (res.ok && json.ok) {
                setStatus("success");
                setMessage(json.message || "Thanks! Your message has been sent.");
                form.reset();
            } else {
                setStatus("error");
                setErrors(json.errors || {});
                setMessage(json.error || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setMessage("Network error. Please check your connection and try again.");
        }
    }

    const field = (name: keyof FieldErrors) => ({
        "aria-invalid": errors[name] ? true : undefined,
        "aria-describedby": errors[name] ? `${name}-error` : undefined,
        className: `${inputClass} ${errors[name] ? "border-red-400/70" : "border-line"}`,
    });

    return (
        <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-24 lg:py-32">
            <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint">Contact</p>
                    <h2 id="contact-title" className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                        Let’s build something meaningful together.
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-ink-3">
                        If you have any questions, please don’t hesitate to contact me. I’m open to work opportunities that align with my skills and interests.
                    </p>
                    <dl className="mt-10 space-y-5">
                        <div>
                            <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Email</dt>
                            <dd>
                                <a href={`mailto:${personal.email}`} className="text-lg font-medium text-ink transition-colors hover:text-mint">
                                    {personal.email}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Phone</dt>
                            <dd>
                                <a href={`tel:${personal.phone}`} className="text-lg font-medium text-ink transition-colors hover:text-mint">
                                    {personal.phoneDisplay}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Location</dt>
                            <dd className="text-lg font-medium text-ink">{personal.location}</dd>
                        </div>
                    </dl>
                    <ul className="mt-10 flex gap-3">
                        {socials.map((s) => (
                            <li key={s.name}>
                                <a
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${s.name} (opens in a new tab)`}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-2 transition hover:-translate-y-0.5 hover:border-mint hover:text-mint"
                                >
                                    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d={icons[s.icon]} />
                                    </svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.form
                    onSubmit={onSubmit}
                    noValidate
                    aria-label="Contact form"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative rounded-3xl border border-line bg-surface p-6 sm:p-8"
                >
                    <div className="grid gap-5">
                        {/* Honeypot: hidden from people and assistive tech, bots tend to fill it */}
                        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                            <label htmlFor="f-website">Website</label>
                            <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                        </div>
                        <div>
                            <label htmlFor="f-name" className="text-sm font-medium text-ink">
                                Name
                            </label>
                            <input id="f-name" name="name" required maxLength={100} autoComplete="name" placeholder="Your name" {...field("name")} />
                            {errors.name && <p id="name-error" className="mt-1.5 text-sm text-red-300">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="f-email" className="text-sm font-medium text-ink">
                                Email
                            </label>
                            <input id="f-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@company.com" {...field("email")} />
                            {errors.email && <p id="email-error" className="mt-1.5 text-sm text-red-300">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="f-message" className="text-sm font-medium text-ink">
                                Message
                            </label>
                            <textarea id="f-message" name="message" required maxLength={2000} rows={5} placeholder="Tell me about your project" {...field("message")} />
                            {errors.message && <p id="message-error" className="mt-1.5 text-sm text-red-300">{errors.message}</p>}
                        </div>
                        <motion.button
                            type="submit"
                            disabled={status === "sending"}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-mint px-5 text-sm font-semibold text-bg shadow-lg shadow-mint/20 transition-colors hover:bg-[#5ef0c6] disabled:cursor-wait disabled:opacity-80"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {status === "sending" ? (
                                    <motion.span key="sending" className="inline-flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                                        <svg aria-hidden="true" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                                            <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        Sending…
                                    </motion.span>
                                ) : (
                                    <motion.span key="idle" className="inline-flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                                        Send message <span aria-hidden="true">→</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                        <div aria-live="polite" role="status" className="min-h-[3.25rem]">
                            <AnimatePresence mode="wait">
                                {status === "success" && (
                                    <motion.div
                                        key="ok"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-3 rounded-lg border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-ink"
                                    >
                                        <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <motion.circle cx="12" cy="12" r="10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                                            <motion.path d="M7.5 12.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.4 }} />
                                        </svg>
                                        {message}
                                    </motion.div>
                                )}
                                {status === "error" && (
                                    <motion.div
                                        key="err"
                                        initial={{ opacity: 0, x: 0 }}
                                        animate={{ opacity: 1, x: [0, -6, 6, -3, 3, 0] }}
                                        transition={{ duration: 0.45 }}
                                        exit={{ opacity: 0 }}
                                        className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                                    >
                                        {message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.form>
            </div>
        </section>
    );
}
