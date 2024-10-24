"use client";
import React from "react";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";

const CommonTitle = ({ children, title, id }) => {
    return (
        <div
            id={id}
            className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]"
        >
            <Image
                src="/section.svg"
                alt="Hero"
                width={1572}
                height={795}
                className=" absolute top-0 -z-10"
            />
            <div className=" flex justify-center -translate-y-[1px]">
                <div className="w-3/4">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full"></div>
                </div>
            </div>
            {title ? (
                <Fade
                    direction="down"
                    delay={400}
                    cascade
                    damping={1e-1}
                    triggerOnce={true}
                >
                    <div className="text-pink-500 text-[14px] my-24 flex justify-center uppercase tracking-widest">
                        [ {title} ]
                    </div>
                </Fade>
            ) : (
                ""
            )}
            {children}
        </div>
    );
};

export default CommonTitle;
