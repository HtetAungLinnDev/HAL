import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./utils/**/*.{js,ts}"],
    theme: {
        extend: {
            colors: {
                bg: "#0A0E17",
                surface: "#0F1523",
                "surface-2": "#141B2D",
                line: "rgba(255,255,255,0.08)",
                ink: "#EEF1F7",
                "ink-2": "#C5CCDA",
                "ink-3": "#97A1B5",
                mint: "#34E0B0",
                iris: "#8B93FF",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
                mono: ["var(--font-mono)", "ui-monospace", "monospace"],
            },
            keyframes: {
                drift: {
                    "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
                    "33%": { transform: "translate3d(6%,-4%,0) scale(1.08)" },
                    "66%": { transform: "translate3d(-5%,5%,0) scale(0.95)" },
                },
            },
            animation: {
                drift: "drift 18s ease-in-out infinite",
                "drift-slow": "drift 26s ease-in-out infinite reverse",
            },
        },
    },
    plugins: [],
};
export default config;
