import { Reveal } from "@/components/motion/reveal";

export default function SectionHeader({ id, eyebrow, title, intro }: { id: string; eyebrow: string; title: string; intro?: string }) {
    return (
        <Reveal as="header" className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mint">{eyebrow}</p>
            <h2 id={id} className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {title}
            </h2>
            {intro && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-3">{intro}</p>}
        </Reveal>
    );
}
