import React from "react";
import Link from "next/link";
const navItem = ({ url, name }) => {
    return (
        <Link
            href={url}
            className="block px-4 py-2 no-underline outline-none hover:no-underline"
        >
            <div className="text-sm text-white transition-colors duration-300 hover:text-pink-600">
                {name}
            </div>
        </Link>
    );
};

export default navItem;
