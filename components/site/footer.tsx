import { personal } from "@/utils/data/site";

export default function Footer() {
    return (
        <footer className="border-t border-line py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-ink-3 sm:flex-row sm:px-8">
                <p>
                    © {new Date().getFullYear()} {personal.name}
                </p>
                <a href="#top" className="transition-colors hover:text-ink">
                    Back to top <span aria-hidden="true">↑</span>
                </a>
            </div>
        </footer>
    );
}
