"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavItem from "./common/navItem";
import { Fade } from "react-awesome-reveal";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const navLinks = [
    { url: "/#about", name: "About" },
    { url: "/#experience", name: "Awards" },
    { url: "/#skills", name: "Skills" },
    { url: "/#education", name: "Offers" },
    { url: "/#blog", name: "Blog" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsMenuOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

    return (
        <nav className="bg-transparent relative z-[60]" aria-label="Main">
            <Fade
                direction="down"
                delay={400}
                cascade
                damping={1e-1}
                triggerOnce={true}
            >
                <div className="flex items-center justify-between py-5">
                    <div className="flex flex-shrink-0 items-center">
                        <Link href="/" onClick={closeMenu}>
                            <Image
                                src="/logo.png"
                                alt="logo"
                                width="56"
                                height="56"
                            ></Image>
                        </Link>
                    </div>
                    <ul
                        id="navbar-default"
                        className="mt-4 lg:flex h-screen hidden max-h-0 w-full flex-col items-start text-sm opacity-0 md:mt-0 md:h-auto md:max-h-screen md:w-auto md:flex-row md:space-x-1 md:border-0 md:opacity-100"
                    >
                        {navLinks.map((link) => (
                            <li key={link.url}>
                                <NavItem url={link.url} name={link.name} />
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16f2b3]"
                        aria-controls="navbar-mobile"
                        aria-expanded={isMenuOpen}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setIsMenuOpen((open) => !open)}
                    >
                        <span className="flex items-center justify-center w-full h-full rounded-full bg-[#0d1224] text-white">
                            {isMenuOpen ? (
                                <HiOutlineX size={22} aria-hidden="true" />
                            ) : (
                                <HiOutlineMenu size={22} aria-hidden="true" />
                            )}
                        </span>
                    </button>
                </div>
            </Fade>
            <div
                id="navbar-mobile"
                hidden={!isMenuOpen}
                className="lg:hidden absolute left-0 right-0 top-full"
            >
                <ul className="flex flex-col rounded-lg border border-[#1b2c68a0] bg-[#0d1224] py-2 shadow-lg shadow-violet-900/30">
                    {navLinks.map((link) => (
                        <li
                            key={link.url}
                            className="border-b border-[#25213b] last:border-b-0"
                        >
                            <NavItem
                                url={link.url}
                                name={link.name}
                                onClick={closeMenu}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
