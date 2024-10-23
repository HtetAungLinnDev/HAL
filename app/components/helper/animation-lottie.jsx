"use client";
import Lottie from "lottie-react";
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
