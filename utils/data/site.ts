export const personal = {
    name: "Htet Aung Linn",
    title: "Full-Stack Software Engineer",
    subtitle: "Full Stack Developer at Ravus Law Chambers · Co-Founder & CTO at PhiLo POS",
    email: "htetaunglinn443@gmail.com",
    phone: "+959779009919",
    phoneDisplay: "+95 9 779 009 919",
    location: "Mandalay, Myanmar",
    resume: "/Htet_Aung_Linn_CV.pdf",
    profile: "/profile.jpg",
};

export const socials = [
    { name: "GitHub", href: "https://github.com/HtetAungLinn443", icon: "github" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/htet-aung-linn-2778b525a", icon: "linkedin" },
    { name: "Stack Overflow", href: "https://stackoverflow.com/users/21542467/htet-aung-linn", icon: "stackoverflow" },
    { name: "Facebook", href: "https://www.facebook.com/HtetAungLinnDev", icon: "facebook" },
] as const;

export const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Certifications", href: "#certifications" },
    { name: "Contact", href: "#contact" },
];

export const whatIDo = [
    { title: "Full-Stack Development", text: "Modern web apps with React, Next.js, Vue.js, Nuxt.js, Laravel, PHP and Node.js.", icon: "M4 6h16M4 12h16M4 18h10" },
    { title: "Backend Engineering", text: "RESTful APIs, business logic, database structures, authentication systems and scalable architectures.", icon: "M5 7h14v4H5zM5 13h14v4H5z" },
    { title: "Desktop & Mobile Development", text: "Electron.js, React Native, Ionic and Capacitor.", icon: "M7 4h10v16H7zM11 17h2" },
    { title: "Cloud & DevOps", text: "AWS infrastructure, Linux, Docker, deployment workflows and cloud storage architecture.", icon: "M7 17a4 4 0 010-8 5 5 0 019.6-1.5A3.5 3.5 0 0117 17z" },
    { title: "System Design", text: "Turning business requirements into technical solutions focused on maintainability, security, performance and scalability.", icon: "M4 4h6v6H4zM14 14h6v6h-6zM10 7h4v10" },
    { title: "Technical Leadership", text: "Architectural decisions, technical planning and product development, balancing business needs with engineering quality.", icon: "M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9 5.5-.8z" },
];

export const featuredProject = {
    name: "PhiLo POS",
    role: "Co-Founder & CTO",
    tagline: "Point-of-sale and inventory for shops and restaurants in Myanmar.",
    description: "A business software platform focused on sales management, inventory workflows, reporting, and operational efficiency.",
    features: [
        "Sales & checkout",
        "Inventory & stock transfer",
        "Multi-branch",
        "Reports",
        "Kitchen display (KDS) & barcode printing",
        "Kitchen & receipt printing - laser and thermal printers",
    ],
    apps: [
        { name: "PhiLo POS app", platforms: ["Android", "iOS", "Desktop (Windows)", "macOS", "Web"] },
        { name: "KDS app", platforms: ["Android"] },
        { name: "PhiLo POS Manager", platforms: ["Android", "iOS"] },
        { name: "Admin panel", platforms: ["Web"] },
    ],
    stack: ["PHP API", "TypeScript"],
    url: "https://philo.asia",
    displayUrl: "philo.asia",
    image: "/projects/philo.webp",
    mobileImage: "/projects/philo-mobile.webp",
};

export type Project = {
    name: string;
    market: string;
    tagline: string;
    description: string;
    features: string[];
    stack?: string[];
    /** Public site or product page; omit when unreleased. */
    url?: string;
    /** Shown in the browser chrome; use a neutral label when there is no public URL. */
    displayUrl: string;
    linkLabel?: string;
    image?: string;
    /** object-position for the screenshot inside the 16:10 frame */
    imagePosition?: string;
    /** Optional label shown above the name, e.g. "Freelance team project" */
    label?: string;
    /** Optional role badge, e.g. "Project Lead" */
    role?: string;
    /** Hiring organisation or product owner */
    client?: string;
    /** Extra scope line (e.g. frontend-only); shown under the role badge when set */
    scope?: string;
    /** Product status badge on the card */
    status?: "in-development" | "live";
};

export const projects: Project[] = [
    {
        name: "Kenja Cloud",
        market: "Japan",
        tagline: "Enterprise communication and knowledge sharing for Japanese companies.",
        description: "Built with Laravel and Nuxt.js. My role focused on backend logic, API design and frontend integration.",
        features: ["Document management", "Scheduling", "Chat", "Collaboration tools"],
        stack: ["Laravel", "Nuxt.js"],
        url: "https://satt.jp/product/kenja-cloud/",
        displayUrl: "satt.jp/product/kenja-cloud",
        linkLabel: "Product page",
    },
    {
        name: "ShweMonywaNet WiFi Bill Management",
        market: "Myanmar",
        tagline: "Subscriptions, bandwidth and billing for an internet service provider.",
        description: "A web-based system that lets admins manage user accounts, monitor usage in real time, generate invoices and handle customer support.",
        features: ["Customer subscriptions", "Bandwidth control", "Billing & invoices", "Real-time usage"],
        stack: ["Laravel", "jQuery", "Ajax"],
        url: "https://shwemonywanet.com",
        displayUrl: "shwemonywanet.com",
        linkLabel: "Visit site",
        image: "/projects/shwemonywanet.webp",
        imagePosition: "left top",
    },
    {
        name: "Estage CRM",
        market: "Myanmar",
        tagline: "Customer and property management for a real estate office.",
        description: "I developed key modules with Laravel and jQuery, and implemented real-time chat and notifications with Socket.io.",
        features: ["Customer management", "Property management", "Real-time chat", "Notifications"],
        stack: ["Laravel", "jQuery", "Ajax", "Socket.io"],
        url: "https://emhle.com",
        displayUrl: "emhle.com",
        linkLabel: "Visit site",
        image: "/projects/estage.webp",
        imagePosition: "left top",
    },
    {
        name: "Property.com.mm",
        market: "Myanmar",
        tagline: "Myanmar real estate portal for listings, rentals and sales.",
        description: "I contributed to backend development, focusing on admin panel functionality, user management and property data handling.",
        features: ["Admin panel", "User management", "Property data"],
        stack: ["PHP", "CodeIgniter"],
        url: "https://www.property.com.mm",
        displayUrl: "property.com.mm",
        linkLabel: "Visit site",
        image: "/projects/property.webp",
    },
    {
        name: "Estate Myanmar",
        market: "Myanmar",
        tagline: "Listing platform connecting buyers, sellers and agents.",
        description: "I worked on backend modules that streamline property uploads, search and user interactions.",
        features: ["Property uploads", "Search", "User interactions"],
        stack: ["PHP", "CodeIgniter"],
        url: "https://www.estatemyanmar.com.mm",
        displayUrl: "estatemyanmar.com.mm",
        linkLabel: "Visit site",
        image: "/projects/estatemyanmar.webp",
        imagePosition: "center top",
    },
    {
        name: "Shan Naung Yoe",
        label: "Freelance team project",
        role: "Project Lead",
        market: "Myanmar",
        tagline: "Website for a Yangon uniform and custom garment manufacturer.",
        description: "A company website presenting Shan Naung Yoe's uniform collections, its 7-step production process, capabilities and blog, with ways to send requirements.",
        features: ["Product categories", "7-step process", "Capabilities", "Blog", "Contact & requirements"],
        stack: ["Laravel", "jQuery"],
        url: "https://shannaungyoe.com",
        displayUrl: "shannaungyoe.com",
        linkLabel: "Visit site",
        image: "/projects/shannaungyoe.webp",
    },
    {
        name: "Raveon Live",
        label: "Ravus Law",
        client: "Ravus Law",
        market: "Singapore",
        role: "Software Engineer",
        tagline: "Live-event engagement for concerts - requests, gifting, and multi-screen projection.",
        description:
            "Raveon Live is a live-event engagement platform for concerts and large events. I contribute as a software engineer on the web admin panels (Super Admin and Organization), the audience mobile app, and the projection control app that drives venue screens.",
        features: [
            "Super Admin & Organization web panels - create and manage events",
            "Review song/sound requests - approve or reject incoming requests",
            "Raveon Live mobile app - performers, gifts, and paid song/sound requests",
            "Paid-request flow - system returns the amount the requester must pay",
            "Projection app - canvas control across multiple projectors and screens",
            "Customizable “Top gift” layouts on venue projectors",
            "RubexPay payment gateway integration",
        ],
        stack: [
            "Backend · Laravel (API)",
            "Admin · Next.js",
            "Mobile · React + Ionic",
            "Projection · Next.js + Electron",
            "RubexPay (payments)",
        ],
        displayUrl: "Unreleased · in development",
        image: "/projects/raveon-live.jpg",
        imagePosition: "left top",
    },
    {
        name: "Raveon Live Mini",
        label: "Ravus Law",
        client: "Ravus Law",
        market: "Singapore",
        role: "Software Engineer",
        tagline: "Lightweight Raveon Live for KTV venues and small events.",
        description:
            "A smaller packaging of the Raveon Live experience for karaoke (KTV) rooms and intimate events. It reuses the core song-request, gifting, and paid-request flows in a simpler product surface suited to smaller venues, with the same Super Admin and Organization admin scope as Raveon Live in a reduced feature set for KTV and small events.",
        features: [
            "Super Admin & Organization panels - same scope as Raveon Live, reduced for KTV and small events",
            "Song and sound requests with paid-request pricing feedback",
            "Gifting flows shared with Raveon Live",
            "RubexPay payment gateway integration",
        ],
        stack: [
            "Backend · Laravel (API)",
            "Admin · Next.js",
            "Mobile · React + Ionic",
            "RubexPay (payments)",
        ],
        displayUrl: "Unreleased · in development",
        image: "/projects/raveon-live.jpg",
        imagePosition: "left top",
    },
    {
        name: "Ravus AI FX - Ghost Candle Projection",
        market: "Singapore",
        role: "Software Engineer",
        scope: "Frontend only (Next.js) - provided prediction & market-data APIs",
        tagline: "TradingView-style chart with AI “ghost candle” projections and quantile ranges.",
        description:
            "A public-facing FX dashboard that visualises an AI model’s prediction for the next candle on a candlestick chart. The active prediction appears as a bright blue ghost candle; historical predictions remain as faded ghosts. I built the frontend only in Next.js, consuming the provided prediction and market-data APIs.",
        features: [
            "Ghost candle overlay - active prediction plus faded historical predictions",
            "Q10 / Q50 / Q90 upper and lower ranges (price and pips)",
            "Prediction time, expiry time, and current close",
            "Market Watch - symbol, bid, ask, daily %",
            "Pair & timeframe display (e.g. EUR/USD, M5) and model status",
            "In-UI note: “Not a buy/sell signal”",
        ],
        stack: ["Next.js", "TradingView Lightweight Charts"],
        displayUrl: "https://fx-trading.asantesting.com",
        image: "/projects/ravus-ai-fx.png",
        imagePosition: "left top",
        url: "https://fx-trading.asantesting.com/",
        linkLabel: "Visit site",
    },
    {
        name: "MyTogether",
        label: "Team project",
        client: "MyTogether Team",
        market: "Thailand · Myanmar community",
        status: "live",
        role: "Senior Developer",
        scope: "Team project - Senior Developer on backend (NestJS + PostgreSQL) and React.js admin panel (not the mobile app or public website)",
        tagline: "Guide for Myanmar people in Thailand - shops, news, visa info, rates, and community tools.",
        description:
            "MyTogether helps Myanmar residents in Thailand find Myanmar shops and food with map locations, read verified official news and announcements, check visa and document guidance, follow daily THB→MMK exchange rates, use community lost-and-found, and discover travel spots across Thailand. As Senior Developer on the team, I contributed backend and admin-panel work.",
        features: [
            "Myanmar shops & food with map locations",
            "Verified official news and announcements",
            "Visa and document information",
            "Daily THB to MMK exchange rates",
            "Community lost-and-found",
            "Travel spots across Thailand",
            "React.js admin panel (my scope)",
        ],
        stack: ["NestJS", "PostgreSQL", "Prisma", "AWS S3", "React.js"],
        url: "https://mytogether.org/",
        displayUrl: "mytogether.org",
        linkLabel: "Visit site",
        image: "/projects/mytogether.png",
    },
];

// Icon file names refer to /public/svg/skills/*.svg
export const skillGroups: { title: string; items: { name: string; icon?: string }[] }[] = [
    { title: "Frontend", items: [{ name: "React.js", icon: "react" }, { name: "Next.js", icon: "nextJS" }, { name: "Vue.js", icon: "vue" }, { name: "Nuxt.js", icon: "nuxtJS" }, { name: "TypeScript", icon: "typescript" }, { name: "JavaScript", icon: "javascript" }, { name: "Responsive UI" }] },
    { title: "Backend", items: [{ name: "PHP", icon: "php" }, { name: "Laravel", icon: "laravel" }, { name: "Node.js" }, { name: "NestJS" }, { name: "REST APIs" }, { name: "Authentication" }, { name: "Business Logic" }] },
    { title: "Database & Storage", items: [{ name: "MySQL", icon: "mysql" }, { name: "PostgreSQL", icon: "postgresql" }, { name: "Database Design" }, { name: "AWS S3", icon: "aws" }, { name: "Private File Access" }] },
    { title: "Cloud & DevOps", items: [{ name: "AWS", icon: "aws" }, { name: "Linux" }, { name: "Docker", icon: "docker" }, { name: "Deployment" }, { name: "Cloud Infrastructure" }] },
    { title: "Desktop & Mobile", items: [{ name: "Electron.js", icon: "electron" }, { name: "React Native" }, { name: "Ionic", icon: "ionic" }, { name: "Capacitor", icon: "capacitorjs" }] },
];

export type ExperienceEntry = {
    role: string;
    org: string;
    date?: string;
    location?: string;
    detail?: string;
    text?: string;
    skills?: string[];
    link?: { href: string; label: string };
};

export const experience: ExperienceEntry[] = [
    {
        role: "Co-Founder & Chief Technology Officer (CTO)",
        org: "PhiLo POS",
        date: "Since 1 Feb 2026",
        link: { href: "https://philo.asia", label: "philo.asia" },
        text: "A business software platform focused on sales management, inventory workflows, reporting, and operational efficiency.",
    },
    {
        role: "Full Stack Developer",
        org: "Ravus Law Chambers",
        date: "Sep 2025 – Present",
        detail: "Full-time",
        location: "Singapore · Remote",
        text: "Full-stack application engineering for client systems - Laravel, NestJS, and related technologies.",
        skills: ["Laravel", "NestJS"],
    },
    {
        role: "Project Leader",
        org: "SoftGuide Software House",
        date: "Jan 2025 – Sep 2025",
        detail: "Full-time · On-site",
        location: "Yangon Region, Myanmar",
        text: "Project leadership and delivery, including CRM-focused client work.",
        skills: ["Customer Relationship Management (CRM)"],
    },
    {
        role: "Web Developer",
        org: "SoftGuide Software House",
        date: "Jun 2023 – Jul 2025",
        detail: "Full-time · On-site",
        location: "Yangon, Myanmar",
        text: "Web development on SoftGuide and client products with PHP, Nuxt.js, and the wider stack used in production.",
        skills: ["Nuxt.js", "PHP"],
    },
];

export const education = [
    { title: "Diploma in Computing", org: "NiT College", date: "Aug 2025 – Present" },
    { title: "Bachelor of Science in Physics", org: "Mandalar University", date: "2018 – Present" },
];

export const certifications = [
    { title: "Professional Web Design Course", org: "Code Lab", date: "July 2022", image: "/cert/webDesign.png" },
    { title: "Fullstack Developer Course", org: "Code Lab", date: "September 2022", image: "/cert/fullstackDev.png" },
    { title: "Laravel + Vue.js Full-Stack Course", org: "Code Lab", date: "December 2022", image: "/cert/laravel+vue.png" },
    { title: "PHP Internship Course", org: "SoftGuide", date: "October 2023", image: "/cert/softguide_PHP_Internship.jpg" },
    { title: "Graphic Design Course", org: "IT Home Mandalay", date: "August 2018", image: "/cert/graphicDesign.png" },
];

export const journeyPhotos = [
    "sg_group1.jpg",
    "photo_2025-09-28_20-08-05.jpg",
    "sg_group2.jpg",
    "photo_2025-09-28_20-09-31.jpg",
    "boss_bathday_party.jpg",
    "photo_2025-09-28_20-09-54.jpg",
    "sg_group3.jpg",
    "photo_2025-09-28_20-09-52.jpg",
    "boss_bathday_party2.jpg",
    "photo_2025-09-28_20-09-35.jpg",
    "photo_2025-09-28_20-09-37.jpg",
    "photo_2025-09-28_20-09-38.jpg",
    "photo_2025-09-28_20-09-40.jpg",
    "photo_2025-09-28_20-09-41.jpg",
    "photo_2025-09-28_20-09-42.jpg",
    "photo_2025-09-28_20-09-43.jpg",
    "photo_2025-09-28_20-09-45.jpg",
    "photo_2025-09-28_20-09-46.jpg",
    "photo_2025-09-28_20-09-48.jpg",
    "photo_2025-09-28_20-09-49.jpg",
];
