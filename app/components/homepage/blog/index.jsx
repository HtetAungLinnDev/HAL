import React from "react";
import CommonTitle from "../../common/CommonTitle";
import BlogCard from "./blog-card";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
const Blog = ({ blogs }) => {
    return (
        <CommonTitle id="blog" title="Blog">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
                {blogs
                    .slice(0, 6)
                    .map(
                        (blog, i) =>
                            blog.cover_image && <BlogCard blog={blog} key={i} />
                    )}
            </div>
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
        </CommonTitle>
    );
};

export default Blog;
