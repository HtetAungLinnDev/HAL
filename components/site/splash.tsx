"use client";

import { useEffect, useState } from "react";
import { MagicLoader } from "@/components/lightswind/magic-loader";

export const SPLASH_KEY = "hal-splash-seen";

/**
 * Runs before first paint (inlined in <head>): marks <html data-splash> only on the first
 * visit of the session and never for prefers-reduced-motion. Without that attribute the
 * splash stays display:none, so returning visitors and crawlers never see it.
 */
export const splashScript = `try{if(!sessionStorage.getItem("${SPLASH_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-splash","")}}catch(e){}`;

/**
 * Short first-visit splash using Lightswind's MagicLoader. The page renders normally
 * underneath (no content is withheld); the overlay fades itself out with a CSS animation
 * after ~0.9s (see #splash in globals.css), so it ends even if JavaScript is slow.
 * Server and client render the same markup, so there is nothing to mismatch on hydration.
 */
export default function Splash() {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        if (!root.hasAttribute("data-splash")) return;
        setActive(true);
        try {
            sessionStorage.setItem(SPLASH_KEY, "1");
        } catch { }
        const t = window.setTimeout(() => {
            root.removeAttribute("data-splash");
            setActive(false);
        }, 1300);
        return () => window.clearTimeout(t);
    }, []);

    return (
        <div id="splash" aria-hidden="true" className="fixed inset-0 z-[100] flex-col items-center justify-center gap-3 bg-bg">
            <div className="relative flex items-center justify-center">
                <MagicLoader size={150} particleCount={3} speed={1.2} tickStep={3} active={active} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/hal-logo-dark.svg" alt="" width={56} height={56} className="pointer-events-none absolute h-14 w-14" />
            </div>
            <p className="font-display text-sm font-semibold tracking-wide text-ink-2">Htet Aung Linn</p>
        </div>
    );
}
