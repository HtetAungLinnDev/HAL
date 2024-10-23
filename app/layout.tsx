import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import "./css/card.scss";
import "./css/globals.scss";
import Navbar from "./components/navbar";
const cabin = Cabin({ subsets: ["latin"] });
export const metadata: Metadata = {
    title: "HAL Plortfolio",
    description: "Plortfolio by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cabin.className}>
                <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem]">
                    <Navbar />
                    {children}
                </main>
            </body>
        </html>
    );
}
