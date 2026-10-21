import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/motion-provider";
import Splash, { splashScript } from "@/components/site/splash";
import Meteors from "@/components/site/meteors";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hal-three.vercel.app";
const title = "Htet Aung Linn · Full-Stack Software Engineer";
const description =
    "Htet Aung Linn is a full-stack software engineer: Senior Developer at Ravus Law and Co-Founder & CTO at PhiLo POS. Projects, skills, experience and contact.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        url: "/",
        siteName: "Htet Aung Linn",
        title,
        description,
        images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Htet Aung Linn, Full-Stack Software Engineer" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0A0E17" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        // suppressHydrationWarning: the inline splash script may add data-splash to <html> before hydration.
        <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: splashScript }} />
            </head>
            <body className="bg-bg font-sans text-ink-2 antialiased">
                <Meteors />
                <Splash />
                <MotionProvider>{children}</MotionProvider>
            </body>
        </html>
    );
}
