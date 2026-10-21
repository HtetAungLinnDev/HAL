import Image from "next/image";

export default function BrowserFrame({
    url,
    image,
    alt,
    placeholder,
    priority,
    sizes,
    position = "top",
    aspect = "aspect-[16/10]",
    zoomOnHover = false,
    fillHeight = false,
}: {
    url: string;
    image?: string;
    alt: string;
    placeholder?: string;
    priority?: boolean;
    sizes: string;
    position?: string;
    aspect?: string;
    zoomOnHover?: boolean;
    /** Fills parent height (e.g. timeline card media pane); drops outer frame chrome styling. */
    fillHeight?: boolean;
}) {
    const viewportClass = fillHeight
        ? "relative min-h-[220px] flex-1 overflow-hidden bg-[#0c111d] sm:min-h-[260px] lg:min-h-[320px]"
        : `relative ${aspect} overflow-hidden bg-[#0c111d]`;

    return (
        <div
            className={
                fillHeight
                    ? "flex h-full min-h-[260px] flex-col overflow-hidden bg-[#0c111d] lg:min-h-full"
                    : "overflow-hidden rounded-xl border border-line bg-surface-2 shadow-2xl shadow-black/40"
            }
        >
            <div className="flex shrink-0 items-center gap-2 border-b border-line bg-[#0c111d] px-3 py-2" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-0.5 text-center font-mono text-[11px] text-ink-3">{url}</span>
            </div>
            <div className={viewportClass}>
                {image ? (
                    <Image
                        src={image}
                        alt={alt}
                        fill
                        quality={90}
                        sizes={sizes}
                        priority={priority}
                        style={{ objectPosition: position }}
                        className={`object-cover transition-transform duration-700 ease-out will-change-transform ${zoomOnHover ? "group-hover:scale-[1.04]" : ""}`}
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_top,rgba(139,147,255,.18),transparent_60%)] text-center">
                        <span className="font-display text-2xl font-semibold text-ink">{placeholder}</span>
                        <span className="font-mono text-xs text-ink-3">Preview not available yet</span>
                    </div>
                )}
            </div>
        </div>
    );
}
