"use client";
import Image from "next/image";
import Link from "next/link";
import { personalData } from "@/utils/data/personal-data";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import CommonTitle from "@/app/components/common/CommonTitle";
import { Fade } from "react-awesome-reveal";
const AboutSection = () => {
    return (
        <CommonTitle id="about" title="About Me">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <div className="order-2 lg:order-1 overflow-x-hidden">
                    <Fade
                        direction="left"
                        delay={400}
                        cascade
                        damping={1e-1}
                        triggerOnce={true}
                    >
                        <div className="font-medium mb-5 text-[#16f2b3] text-3xl mt-5 uppercase">
                            Who I am ?
                        </div>
                    </Fade>
                    <Fade
                        direction="left"
                        delay={600}
                        cascade
                        damping={1e-1}
                        triggerOnce={true}
                    >
                        <p className="text-gray-200 text-sm lg:text-lg !leading-10">
                            {personalData.description}
                        </p>
                    </Fade>
                    <Fade
                        direction="left"
                        delay={800}
                        cascade
                        damping={1e-1}
                        triggerOnce={true}
                    >
                        <div className="my-6 flex items-center gap-5 pl-4">
                            <Link
                                href={personalData.github}
                                target="_blank"
                                className="transition-all text-white hover:scale-125 w-[40px] h-[40px] bg-pink-500 rounded-full flex justify-center pt-2 duration-300"
                            >
                                <BsGithub size={24} />
                            </Link>
                            <Link
                                href={personalData.linkedIn}
                                target="_blank"
                                className="transition-all text-white hover:scale-125 w-[40px] h-[40px] bg-pink-500 rounded-full flex justify-center pt-2 duration-300"
                            >
                                <BsLinkedin size={24} />
                            </Link>
                            <Link
                                href={personalData.facebook}
                                target="_blank"
                                className="transition-all text-white hover:scale-125 w-[40px] h-[40px] bg-pink-500 rounded-full flex justify-center pt-2 duration-300"
                            >
                                <FaFacebook size={24} />
                            </Link>
                            <Link
                                href={personalData.twitter}
                                target="_blank"
                                className="transition-all text-white hover:scale-125 w-[40px] h-[40px] bg-pink-500 rounded-full flex justify-center pt-2 duration-300"
                            >
                                <FaTwitterSquare size={24} />
                            </Link>
                        </div>
                    </Fade>
                </div>
                <div className="flex justify-center order-1 lg:order-2 overflow-x-hidden">
                    <Fade
                        direction="right"
                        delay={400}
                        cascade
                        damping={1e-1}
                        triggerOnce={true}
                    >
                        <Image
                            src={personalData.profile}
                            width={470}
                            height={630}
                            alt="Profile"
                            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 cursor-pointer"
                        />
                    </Fade>
                </div>
            </div>
        </CommonTitle>
    );
};

export default AboutSection;
