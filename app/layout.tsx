import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/motion-provider";
import Splash, { splashScript } from "@/components/site/splash";
import Meteors from "@/components/site/meteors";
import { defaultTitle, description, keywords, siteName, siteUrl } from "@/lib/seo";
import { personal } from "@/utils/data/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: { default: defaultTitle, template: `%s | ${siteName}` },
    description,
    applicationName: siteName,
    keywords,
    authors: [{ name: personal.name, url: `${siteUrl}/` }],
    creator: personal.name,
    publisher: personal.name,
    category: "technology",
    alternates: { canonical: "/" },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    // Images come from app/opengraph-image.tsx and app/twitter-image.tsx.
    openGraph: {
        type: "profile",
        url: "/",
        siteName,
        locale: "en_US",
        title: defaultTitle,
        description,
        firstName: "Htet Aung",
        lastName: "Linn",
    },
    twitter: { card: "summary_large_image", title: defaultTitle, description },
    // app/favicon.ico is picked up automatically; the 1024px logo doubles as the Apple touch icon.
    icons: { apple: [{ url: "/logo.png", sizes: "1024x1024", type: "image/png" }] },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0A0E17",
    colorScheme: "dark",
};

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
