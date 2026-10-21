"use client";
import dynamic from "next/dynamic";

// lottie-web touches `document` as soon as it is imported. Node 21+ defines a
// global `navigator`, which makes lottie-web's browser check pass on the server,
// so importing it during prerender throws "document is not defined".
// Load it only in the browser.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const AnimationLottie = ({ animationPath, width = "100%" }) => {
    const defaultOption = {
        loop: true,
        autoplay: true,
        animationData: animationPath,
        style: {
            width: width,
        },
    };
    return <Lottie {...defaultOption} />;
};

export default AnimationLottie;
