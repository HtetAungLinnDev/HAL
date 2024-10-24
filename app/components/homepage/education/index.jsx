"use client";
import React from "react";
import CommonTitle from "@/app/components/common/CommonTitle";
import GlowCard from "@/app/components/helper/glow-card";
import { offers } from "@/utils/data/education";
import { BsBasket } from "react-icons/bs";
import { Fade } from "react-awesome-reveal";
const Education = () => {
    return (
        <CommonTitle id="education" title="Offers">
            <div className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
                    <Fade
                        direction="up"
                        delay={400}
                        cascade
                        damping={1e-1}
                        triggerOnce={true}
                    >
                        {offers.map((education) => (
                            <GlowCard
                                className=""
                                key={education.id}
                                identifier={`education-${education.id}`}
                            >
                                <div className="p-5 relative">
                                    <div className="gap-x-8 px-3 py-5">
                                        <div className="text-violet-500 mb-5 transition-all duration-300">
                                            <BsBasket size={36} />
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="text-base sm:text-xl mt-3 font-medium">
                                            {education.title}
                                        </p>
                                        <p className="text-sm sm:text-base !leading-8 mt-3">
                                            {education.service}
                                        </p>
                                    </div>
                                    <div className="">
                                        <p className="text-xs sm:text-sm mt-3 text-[#16f2b3]">
                                            {education.duration}
                                        </p>
                                    </div>
                                </div>
                            </GlowCard>
                        ))}
                    </Fade>
                </div>
            </div>
        </CommonTitle>
    );
};

export default Education;
