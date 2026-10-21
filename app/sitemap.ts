import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { personal } from "@/utils/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    return [
        { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
        { url: `${siteUrl}${personal.resume}`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    ];
}
