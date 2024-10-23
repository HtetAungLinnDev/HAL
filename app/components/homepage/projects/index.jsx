import React from "react";
import { projectsData } from "@/utils/data/projects-data";
import ProjectCard from "./project-card";
import CommonTitle from "@/app/components/common/CommonTitle";
const Projects = () => {
    return (
        <CommonTitle id="projects">
            <div className="sticky top-10">
                <div className="text-pink-500 text-[14px] my-24 flex justify-center uppercase tracking-widest">
                    [ Testimonials ]
                </div>
            </div>
            <div className="pt-24">
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
            </div>
        </CommonTitle>
    );
};

export default Projects;
