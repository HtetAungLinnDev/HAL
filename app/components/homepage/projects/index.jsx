"use client";
import React from "react";
import { projectsData } from "@/utils/data/projects-data";
import ProjectCard from "./project-card";
import CommonTitle from "@/app/components/common/CommonTitle";
import { Fade } from "react-awesome-reveal";
const Projects = () => {
    return (
        <CommonTitle id="projects">
            <Fade
                direction="down"
                delay={400}
                cascade
                damping={1e-1}
                triggerOnce={true}
            >
                <div className="sticky top-10">
                    <div className="text-pink-500 text-[14px] my-24 flex justify-center uppercase tracking-widest">
                        [ Testimonials ]
                    </div>
                </div>
            </Fade>
            <div className="pt-24">
                <Fade
                    direction="up"
                    delay={600}
                    cascade
                    damping={1e-1}
                    triggerOnce={true}
                >
                    <div className="flex flex-col gap-6">
                        {projectsData.slice(0, 6).map((project, index) => (
                            <div
                                id={`sticky-card-${index + 1}`}
                                key={index}
                                className="sticky-card w-full mx-auto sticky"
                            >
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                </Fade>
            </div>
        </CommonTitle>
    );
};

export default Projects;
