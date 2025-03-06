import Link from "next/link";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-[#0d1224]">
      <div
        className="from-[#0d1224] border-[#1b2c68a0] relative rounded-lg border bg-gradient-to-r to-[#0a0d37] w-full"
        style={{
          backgroundImage: ' url("/noise.png")',
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="flex flex-row">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
          <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
        </div>

        <div className="overflow-hidden px-4 lg:px-8 py-4 lg:py-8">
          <code className="font-mono text-xs md:text-sm lg:text-base">
            <div className="">
              <div className="p-3 bg-violet-500 text-white rounded-full inline-block mr-3">
                {project?.id}
              </div>
              <div className="text-amber-300 mt-3 text-2xl font-semibold">
                {project?.name}
              </div>
            </div>
            <div className="">
              <span className="mr-2">Author:</span>
              <span className="text-orange-400">{project?.role}</span>
            </div>
            {project.language ? (
              <div className="">
                <span className="mr-2">Language:</span>
                <span className="text-red-500 font-bold">
                  {project.language ? project.language.join(", ") : []}
                </span>
              </div>
            ) : (
              ""
            )}
            <div className="mr-2 mt-5">
              <span className="text-white">{project?.description}</span>
            </div>
            <Link
              href={project?.url}
              target="_blank"
              className="mr-2 mt-5 bg-[#16f2b3] rounded-full px-3 py-2 inline-block"
            >
              <span className="text-black">{project?.tag}</span>
            </Link>
          </code>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
