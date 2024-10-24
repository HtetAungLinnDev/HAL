"use client";
import React, { useState, useEffect } from "react";
import CommonTitle from "@/app/components/common/CommonTitle";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import { IoMdCall, IoLogoGithub } from "react-icons/io";
import { BiLogoLinkedin } from "react-icons/bi";
import { FaXTwitter, FaFacebook, FaStackOverflow } from "react-icons/fa6";
import { TbMailForward } from "react-icons/tb";
import { personalData } from "@/utils/data/personal-data";

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (res.ok) {
                setResponseMessage(result.message);
                setFormData({
                    name: "",
                    email: "",
                    message: "",
                });
            } else {
                setResponseMessage(result.error);
            }
        } catch (e) {
            console.log(e);
            setResponseMessage("An error occurred while sending the message.");
        } finally {
            setIsSubmitting(false);
        }
    };
    useEffect(() => {
        if (responseMessage) {
            const timer = setTimeout(() => {
                setResponseMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [responseMessage]);

    return (
        <CommonTitle id="contact" title="Contact">
            <div className="flex flex-col justify-center gap-8 lg:gap-16 items-center">
                <Fade
                    direction="up"
                    delay={600}
                    cascade
                    damping={1e-1}
                    triggerOnce={true}
                >
                    <p className="font-medium text-[#16f2b3] text-2xl uppercase">
                        Contact with me
                    </p>
                </Fade>
                <Fade
                    direction="up"
                    delay={800}
                    cascade
                    damping={1e-1}
                    triggerOnce={true}
                >
                    <div className="max-w-2xl text-white rounded-lg border border-[#464c6a] p-24">
                        <p className="text-sm text-[#d3d8e8]">
                            {
                                "If you have any questions or concerns, please don't hesitate to contact me. I am open to work opportunities that align with my skill and interests."
                            }
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-base">
                                        Your Name:
                                    </label>
                                    <input
                                        className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
                                        type="text"
                                        name="name"
                                        maxLength="100"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-base">
                                        Your Email:
                                    </label>
                                    <input
                                        className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
                                        type="email"
                                        name="email"
                                        maxLength="100"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-base">
                                        Your Message:
                                    </label>
                                    <textarea
                                        className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
                                        name="message"
                                        maxLength="500"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-2 mt-6">
                                    <div
                                        href="#contact"
                                        className="bg-gradient-to-r from-violet-600 to-pink-500 p-[1px] rounded-full transition-all duration-300 hover:from-pink-500 hover:to-violet-600"
                                    >
                                        <button
                                            type="submit"
                                            className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0d1224] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#ffff] no-underline transition-all duration-200 ease-out md:font-semibold flex items-center gap-1 hover:gap-3"
                                            disabled={isSubmitting}
                                        >
                                            <span>
                                                {isSubmitting
                                                    ? "Sending..."
                                                    : "Contact me"}
                                            </span>
                                            <TbMailForward size={16} />
                                        </button>
                                    </div>
                                </div>
                                {responseMessage && (
                                    <p className="mt-4 text-sm text-[#36fe65]">
                                        {responseMessage}
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </Fade>
                <Fade
                    direction="up"
                    delay={1000}
                    cascade
                    damping={1e-1}
                    triggerOnce={true}
                >
                    <div className="flex items-center gap-5 lg:gap-10">
                        <Link
                            href={"tel:" + personalData.phone}
                            target="_blank"
                        >
                            <IoMdCall
                                className="bg-white p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                                size={48}
                            />
                        </Link>
                        <Link href={personalData.github} target="_blank">
                            <IoLogoGithub
                                className="bg-white p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                                size={48}
                            />
                        </Link>
                        <Link href={personalData.linkedIn} target="_blank">
                            <BiLogoLinkedin
                                className="bg-white p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                                size={48}
                            />
                        </Link>
                        <Link href={personalData.twitter} target="_blank">
                            <FaXTwitter
                                className="bg-white p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                                size={48}
                            />
                        </Link>
                        <Link href={personalData.stackOverflow} target="_blank">
                            <FaStackOverflow
                                className="bg-white p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                                size={48}
                            />
                        </Link>
                        <Link href={personalData.facebook} target="_blank">
                            <FaFacebook
                                className="bg-white p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                                size={48}
                            />
                        </Link>
                    </div>
                </Fade>
            </div>
        </CommonTitle>
    );
};

export default ContactSection;
