export const personal = {
    name: "Htet Aung Linn",
    title: "Full-Stack Software Engineer",
    subtitle: "Senior Developer at Ravus Law · Co-Founder & CTO at PhiLo POS",
    email: "htetaunglinn443@gmail.com",
    phone: "+959779009919",
    phoneDisplay: "+95 9 779 009 919",
    location: "Mandalay, Myanmar",
    resume: "/HtetAungLinn.pdf",
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
        "Kitchen & receipt printing — laser and thermal printers",
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
    url: string;
    displayUrl: string;
    linkLabel: string;
    image?: string;
    /** object-position for the screenshot inside the 16:10 frame */
    imagePosition?: string;
    /** Optional label shown above the name, e.g. "Freelance team project" */
    label?: string;
    /** Optional role badge, e.g. "Project Lead" */
    role?: string;
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
];

// Icon file names refer to /public/svg/skills/*.svg
export const skillGroups: { title: string; items: { name: string; icon?: string }[] }[] = [
    { title: "Frontend", items: [{ name: "React.js", icon: "react" }, { name: "Next.js", icon: "nextJS" }, { name: "Vue.js", icon: "vue" }, { name: "Nuxt.js", icon: "nuxtJS" }, { name: "TypeScript", icon: "typescript" }, { name: "JavaScript", icon: "javascript" }, { name: "Responsive UI" }] },
    { title: "Backend", items: [{ name: "PHP", icon: "php" }, { name: "Laravel", icon: "laravel" }, { name: "Node.js" }, { name: "NestJS" }, { name: "REST APIs" }, { name: "Authentication" }, { name: "Business Logic" }] },
    { title: "Database & Storage", items: [{ name: "MySQL", icon: "mysql" }, { name: "PostgreSQL", icon: "postgresql" }, { name: "Database Design" }, { name: "AWS S3", icon: "aws" }, { name: "Private File Access" }] },
    { title: "Cloud & DevOps", items: [{ name: "AWS", icon: "aws" }, { name: "Linux" }, { name: "Docker", icon: "docker" }, { name: "Deployment" }, { name: "Cloud Infrastructure" }] },
    { title: "Desktop & Mobile", items: [{ name: "Electron.js", icon: "electron" }, { name: "React Native" }, { name: "Ionic", icon: "ionic" }, { name: "Capacitor", icon: "capacitorjs" }] },
];

export const experience = [
    { role: "Senior Developer", org: "Ravus Law", text: "Professional software development involving application engineering, technical problem-solving, and maintainable software systems." },
    { role: "Co-Founder & Chief Technology Officer (CTO)", org: "PhiLo POS", link: { href: "https://philo.asia", label: "philo.asia" }, text: "A business software platform focused on sales management, inventory workflows, reporting, and operational efficiency." },
    { role: "PHP Internship", org: "Softguide", date: "Oct 2023" },
];

export const education = [
    { title: "Physics (second year)", org: "Mandalar University", date: "Since 2018" },
    { title: "High School", org: "Ye Kyi Pauk Basic Education High School", date: "2005 – 2016" },
];

export const certifications = [
    { title: "Professional Web Design Course", org: "Code Lab", date: "July 2022", image: "/cert/webDesign.png" },
    { title: "Fullstack Developer Course", org: "Code Lab", date: "September 2022", image: "/cert/fullstackDev.png" },
    { title: "Laravel + Vue.js Full-Stack Course", org: "Code Lab", date: "December 2022", image: "/cert/laravel+vue.png" },
    { title: "PHP Internship Course", org: "Softguide", date: "October 2023", image: "/cert/softguide_PHP_Internship.jpg" },
    { title: "Graphic Design Course", org: "IT Home Mandalay", date: "August 2018", image: "/cert/graphicDesign.png" },
];

export const journeyPhotos = [
    "sg_group1.jpg", "photo_2025-09-28_20-08-05.jpg", "sg_group2.jpg", "photo_2025-09-28_20-09-31.jpg",
    "boss_bathday_party.jpg", "photo_2025-09-28_20-09-54.jpg", "sg_group3.jpg", "photo_2025-09-28_20-09-52.jpg",
];
