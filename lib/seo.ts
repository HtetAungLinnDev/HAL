import { education, experience, featuredProject, personal, projects, skillGroups, socials } from "@/utils/data/site";

/** Canonical production URL. NEXT_PUBLIC_SITE_URL can override it (e.g. for a custom domain). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://htetaunglinn.vercel.app").replace(/\/+$/, "");
export const siteName = personal.name;
export const defaultTitle = `${personal.name} · Full-Stack Developer & CTO of PhiLo POS`;
export const shortTitle = "Full-Stack Developer · Co-Founder & CTO, PhiLo POS";
export const description =
    "Htet Aung Linn is a Full-Stack Software Developer in Mandalay, Myanmar, Co-Founder & CTO of PhiLo POS and Senior Developer at Ravus Law. " +
    "React, Next.js, Vue/Nuxt, TypeScript, PHP/Laravel, Node/NestJS, MySQL/PostgreSQL, AWS, Docker, React Native and Electron.";

export const keywords = [
    "Htet Aung Linn",
    "Full-Stack Developer",
    "Full-Stack Software Engineer",
    "Software Developer Myanmar",
    "Web Developer Mandalay",
    "PhiLo POS",
    "Co-Founder & CTO",
    "Ravus Law",
    "Senior Developer",
    "React",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "TypeScript",
    "PHP",
    "Laravel",
    "Node.js",
    "NestJS",
    "MySQL",
    "PostgreSQL",
    "AWS",
    "Docker",
    "React Native",
    "Electron",
    "POS system Myanmar",
];

export const sameAs = socials.map((s) => s.href);
const abs = (path: string) => new URL(path, `${siteUrl}/`).toString();

/** Primary brand mark for metadata and structured data (512×512 PNG). */
export const brandLogoUrl = abs("/brand/hal-logo-512.png");

/** schema.org graph for the home page: WebSite, ProfilePage, Person, organisations and projects. */
export function homeJsonLd() {
    const personId = `${siteUrl}/#person`;
    const websiteId = `${siteUrl}/#website`;
    const philoId = `${siteUrl}/#org-philo-pos`;
    const ravusId = `${siteUrl}/#org-ravus-law`;
    const knowsAbout = Array.from(new Set(skillGroups.flatMap((g) => g.items.map((i) => i.name))));
    const ravus = experience.find((e) => e.org === "Ravus Law");
    const university = education.find((e) => /university/i.test(e.org));
    const [city, country] = personal.location.split(",").map((s) => s.trim());

    const allProjects = [
        {
            "@type": "SoftwareApplication",
            name: featuredProject.name,
            description: `${featuredProject.tagline} ${featuredProject.description}`,
            url: featuredProject.url,
            image: abs(featuredProject.image),
            applicationCategory: "BusinessApplication",
            operatingSystem: featuredProject.apps[0].platforms.join(", "),
            featureList: featuredProject.features,
            creator: { "@id": personId },
            publisher: { "@id": philoId },
        },
        ...projects.map((p) => ({
            "@type": "CreativeWork",
            name: p.name,
            headline: p.tagline,
            description: p.description,
            url: p.url,
            ...(p.image ? { image: abs(p.image) } : {}),
            ...(p.stack ? { keywords: p.stack.join(", ") } : {}),
            locationCreated: { "@type": "Country", name: p.market },
            contributor: { "@id": personId },
        })),
    ];

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": websiteId,
                url: `${siteUrl}/`,
                name: siteName,
                description,
                inLanguage: "en",
                logo: brandLogoUrl,
                image: brandLogoUrl,
                publisher: { "@id": personId },
            },
            {
                "@type": "ProfilePage",
                "@id": `${siteUrl}/#profile`,
                url: `${siteUrl}/`,
                name: defaultTitle,
                isPartOf: { "@id": websiteId },
                about: { "@id": personId },
                mainEntity: { "@id": personId },
                primaryImageOfPage: abs(personal.profile),
                inLanguage: "en",
            },
            {
                "@type": "Person",
                "@id": personId,
                name: personal.name,
                url: `${siteUrl}/`,
                logo: brandLogoUrl,
                image: brandLogoUrl,
                email: `mailto:${personal.email}`,
                jobTitle: ["Full-Stack Software Developer", "Co-Founder & Chief Technology Officer (CTO)", "Senior Developer"],
                description,
                worksFor: [{ "@id": philoId }, { "@id": ravusId }],
                hasOccupation: [
                    { "@type": "Occupation", name: "Co-Founder & Chief Technology Officer (CTO)", description: featuredProject.description },
                    { "@type": "Occupation", name: "Senior Developer", ...(ravus?.text ? { description: ravus.text } : {}) },
                ],
                address: { "@type": "PostalAddress", addressLocality: city, addressCountry: country === "Myanmar" ? "MM" : country },
                ...(university ? { alumniOf: { "@type": "CollegeOrUniversity", name: university.org } } : {}),
                knowsAbout,
                sameAs,
            },
            { "@type": "Organization", "@id": philoId, name: "PhiLo POS", url: featuredProject.url, founder: { "@id": personId } },
            { "@type": "Organization", "@id": ravusId, name: "Ravus Law" },
            {
                "@type": "ItemList",
                "@id": `${siteUrl}/#projects`,
                name: "Projects by Htet Aung Linn",
                numberOfItems: allProjects.length,
                itemListElement: allProjects.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })),
            },
        ],
    };
}
