import { skillsData } from "@/utils/data/skills";
import { skillsImage } from "@/utils/skill-image";
import Marquee from "react-fast-marquee";
import Image from "next/image";
const Skills = () => {
    return (
        <div
            id="skills"
            className="relative z-50 border-t my-12 border-[#25213b]"
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
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full"></div>
                </div>
            </div>
            <div className="text-pink-500 text-[14px] my-24 flex justify-center uppercase tracking-widest">
                [ Skills ]
            </div>
            <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>
            <div className="w-full mt-12">
                <Marquee
                    gradient={false}
                    speed={80}
                    pauseOnHover={true}
                    pauseOnClick={true}
                    delay={0}
                    play={true}
                    direction="left"
                >
                    {skillsData.map((skill, id) => (
                        <div
                            key={id}
                            className="w-36 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group relative cursor-pointer"
                        >
                            <div className="h-full w-full rounded-lg border border-[#1f223c] bg-[#11152c] shadow-gray-50 group-hover:border-violet-500 transition-all duration-500">
                                <div className="flex -translate-y-[1px] justify-center">
                                    <div className="w-3/4">
                                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-3 p-6">
                                    <div className="h-8 sm:h-10">
                                        <Image
                                            src={skillsImage(skill)?.src}
                                            alt={skill}
                                            width={40}
                                            height={40}
                                            className="h-full w-auto rounded-lg"
                                        />
                                    </div>
                                    <p className="text-sm sm:text-lg">
                                        {skill}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export default Skills;
