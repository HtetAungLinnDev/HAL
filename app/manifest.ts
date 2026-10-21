import type { MetadataRoute } from "next";
import { description, siteName } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${siteName} · Full-Stack Developer`,
        short_name: siteName,
        description,
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0A0E17",
        theme_color: "#0A0E17",
        lang: "en",
        categories: ["portfolio", "technology"],
        icons: [
            { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
            { src: "/brand/hal-logo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/brand/hal-logo-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/brand/hal-logo-dark-1024.png", sizes: "1024x1024", type: "image/png", purpose: "maskable" },
        ],
    };
}
