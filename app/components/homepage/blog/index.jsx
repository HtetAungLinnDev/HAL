"use client";
import React from "react";
import CommonTitle from "../../common/CommonTitle";
import BlogCard from "./blog-card";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
const Blog = ({ blogs }) => {
    return (
        <CommonTitle id="blog" title="Blog">
            {blogs.length > 0 ? (
                <div className="">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
                        <Fade
                            direction="up"
                            delay={400}
                            cascade
                            damping={1e-1}
                            triggerOnce={true}
                        >
                            {blogs
                                .slice(0, 6)
                                .map(
                                    (blog, i) =>
                                        blog.cover_image && (
                                            <BlogCard blog={blog} key={i} />
                                        )
                                )}
                        </Fade>
                    </div>
                    <Fade
                        direction="up"
                        delay={600}
                        cascade
                        damping={1e-1}
                        triggerOnce={true}
                    >
                        <div className="flex justify-center mt-5 lg:mt-12">
                            <Link
                                className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
                                role="button"
                                href="/blog"
                            >
                                <span>View More</span>
                                <FaArrowRight size={16} />
                            </Link>
                        </div>
                    </Fade>
                </div>
            ) : (
                <div className="from-[#0d1224] border-[#1b2c68a0] relative rounded-lg border  w-full">
                    <div className="flex flex-row">
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
                        <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
                    </div>
                    <div className="flex justify-center items-center h-[400px]">
                        <p className="font-bold text-2xl text-yellow-600 ">
                            There is no Blogs
                        </p>
                    </div>
                </div>
            )}
        </CommonTitle>
    );
};

export default Blog;
