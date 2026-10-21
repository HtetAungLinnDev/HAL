import SiteHeader from "@/components/site/site-header";
import Footer from "@/components/site/footer";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Experience from "@/components/sections/experience";
import Certifications from "@/components/sections/certifications";
import Contact from "@/components/sections/contact";
import JsonLd from "@/components/site/json-ld";
import { homeJsonLd } from "@/lib/seo";

export default function Home() {
    return (
        <>
            <JsonLd data={homeJsonLd()} />
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-mint focus:px-4 focus:py-2 focus:text-bg"
            >
                Skip to content
            </a>
            <SiteHeader />
            <main id="main">
                <Hero />
                <About />
                <Projects />
                <Skills />
                <Experience />
                <Certifications />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
