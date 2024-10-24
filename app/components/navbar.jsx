"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavItem from "./common/navItem";
import { Fade } from "react-awesome-reveal";

const navbar = () => {
    return (
        <nav className="bg-transparent">
            <Fade
                direction="down"
                delay={400}
                cascade
                damping={1e-1}
                triggerOnce={true}
            >
                <div className="flex items-center lg:justify-between justify-center py-5">
                    <div className="flex flex-shrink-0 items-center">
                        <Link href="/">
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
                        <li>
                            <NavItem url="/#about" name="About" />
                        </li>
                        <li>
                            <NavItem url="/#experience" name="Awards" />
                        </li>
                        <li>
                            <NavItem url="/#skills" name="Skills" />
                        </li>
                        <li>
                            <NavItem url="/#education" name="Offers" />
                        </li>
                        <li>
                            <NavItem url="/#blog" name="Blog" />
                        </li>
                    </ul>
                </div>
            </Fade>
        </nav>
    );
};

export default navbar;
