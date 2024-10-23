import { personalData } from "@/utils/data/personal-data";
import BlogCard from "@/app/components/homepage/blog/blog-card";
import Image from "next/image";

async function getBlogs() {
    const res = await fetch(
        `https://dev.to/api/articles?username=${personalData.devUsername}`
    );
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data;
}

async function page() {
    const blogs = await getBlogs();
    return (
        <div className="py-8">
            <Image
                src="/section.svg"
                alt="Hero"
                width={1572}
                height={795}
                className="absolute top-0 -z-10"
            />
            <div className="flex justify-center -translate-y-[1px]">
                <div className="w-3/4">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
                </div>
            </div>

            <div className="flex justify-center my-5 lg:py-8">
                <div className="flex items-center">
                    <span className="text-pink-500 text-[14px] uppercase tracking-widest">
                        [ All Blogs ]
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
                {blogs.map(
                    (blog, i) =>
                        blog.cover_image && <BlogCard blog={blog} key={i} />
                )}
            </div>
        </div>
    );
}

export default page;
