"use client";

import { motion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

type Tag = "div" | "li" | "ul" | "article" | "header" | "aside" | "ol";

/** Fades and slides its content in once it scrolls into view (transform + opacity only). */
export function Reveal({ children, className, delay = 0, as = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: Tag }) {
    const M = motion[as];
    return (
        <M
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: fadeUp.hidden, show: { ...(fadeUp.show as object), transition: { duration: 0.6, ease, delay } } }}
        >
            {children}
        </M>
    );
}

/** Container that staggers its <StaggerItem> children as it scrolls into view. */
export function Stagger({ children, className, as = "ul", stagger = 0.08 }: { children: React.ReactNode; className?: string; as?: Tag; stagger?: number }) {
    const M = motion[as];
    return (
        <M
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
        >
            {children}
        </M>
    );
}

export function StaggerItem({
    children,
    className,
    as = "li",
    style,
}: {
    children: React.ReactNode;
    className?: string;
    as?: Tag;
    style?: React.CSSProperties;
}) {
    const M = motion[as];
    return (
        <M className={className} style={style} variants={fadeUp}>
            {children}
        </M>
    );
}
