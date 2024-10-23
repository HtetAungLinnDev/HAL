import { experiences, awards } from "@/utils/data/experience";
import Image from "next/image";
import GlowCard from "@/app/components/helper/glow-card";
import CommonTitle from "@/app/components/common/CommonTitle";
const Experience = () => {
    return (
        <CommonTitle id="experience" title="Awards & Honours">
            <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>
            <div className="">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    <div className="flex flex-col gap-6">
                        {awards.map((award) => (
                            <GlowCard
                                identifier={`award-${award.id}`}
                                key={award.id}
                            >
                                <div className="p-3 relative">
                                    <Image
                                        src="/blur-23.svg"
                                        alt="Hero"
                                        width={1080}
                                        height={200}
                                        className="absolute bottom opacity-80"
                                    />
                                    <div className="flex justify-end absolute right-0 mr-5 mt-3">
                                        <p className="text-xs sm:text-sm bg-[#16f2b3] rounded-full text-black px-3 py-2">
                                            {award.duration}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-x-8 px-3 py-2">
                                        <Image
                                            src="/placeholder.png"
                                            width={80}
                                            height={40}
                                            alt="Awards"
                                            className="hover:scale-125 rounded-xl"
                                        />
                                        <div>
                                            <p className="text-base sm:text-xl mb-2 font-medium uppercase">
                                                {award.title}
                                            </p>
                                            <p className="text-sm sm:text-base">
                                                {award.company}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                    <div className="">
                        <div className="flex flex-col gap-6">
                            {experiences.map((experience) => (
                                <GlowCard
                                    identifier={`experience-${experience.id}`}
                                    key={experience.id}
                                >
                                    <div className="p-3 relative">
                                        <Image
                                            src="/blur-23.svg"
                                            alt="Hero"
                                            width={1080}
                                            height={200}
                                            className="absolute bottom opacity-80"
                                        />
                                        <div className="flex justify-end absolute right-0 mr-5 mt-3">
                                            <p className="text-xs sm:text-sm bg-[#16f2b3] rounded-full text-black px-3 py-2">
                                                {experience.duration}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-x-8 px-3 py-2">
                                            <Image
                                                src="/img-1.png"
                                                width={80}
                                                height={40}
                                                alt="Experience"
                                                className="hover:scale-125 rounded-xl"
                                            />
                                            <div>
                                                <p className="text-base sm:text-xl mb-2 font-medium uppercase">
                                                    {experience.title}
                                                </p>
                                                <p className="text-sm sm:text-base">
                                                    {experience.company}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GlowCard>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </CommonTitle>
    );
};

export default Experience;
