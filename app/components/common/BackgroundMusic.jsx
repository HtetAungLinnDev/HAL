"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { FaRegCirclePlay } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgress } from "@nextui-org/react";

const BackgroundMusic = () => {
    const audioRef = useRef(null);
    const cardRef = useRef(null);
    const [volume, setVolume] = useState(0.5);
    const [isCardVisible, setIsCardVisible] = useState(false);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioUrls = [
        "/audio/music3.mp3",
        "/audio/music1.mp3",
        "/audio/music2.mp3",
        "/audio/music4.mp3",
    ];
    const playNextAudio = () => {
        setCurrentAudioIndex((prevIndex) =>
            prevIndex === audioUrls.length - 1 ? 0 : prevIndex + 1
        );
    };
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = audioUrls[currentAudioIndex];
            audioRef.current.volume = 0.5;
            audioRef.current.loop = false;
            audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch((error) => {
                    console.error("Autoplay was prevented:", error);
                });
        }
    }, []);
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.volume = volume;

            const handleAudioEnd = () => {
                playNextAudio();
            };

            audioRef.current.addEventListener("ended", handleAudioEnd);

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener(
                        "ended",
                        handleAudioEnd
                    );
                }
            };
        }
    }, [currentAudioIndex, isPlaying]);
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };
    const toggleCardVisibility = () => {
        setIsCardVisible((prev) => !prev);
        if (audioRef.current && !isPlaying) {
            audioRef.current.volume = volume;
            audioRef.current.play().then(() => setIsPlaying(true));
        }
    };
    const handleClickOutside = (event) => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
            setIsCardVisible(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="fixed bottom-7 right-5 !z-[10000]">
            <div
                onClick={toggleCardVisibility}
                className="cursor-pointer rounded-full bg-slate-900 w-11 h-11 text-gray-100 shadow-lg flex justify-center align-middle pt-2"
            >
                <div>
                    {isCardVisible ? (
                        <IoCloseCircleOutline className="text-3xl" />
                    ) : (
                        <FaRegCirclePlay className="text-3xl" />
                    )}
                </div>
            </div>
            <audio ref={audioRef} />
            <AnimatePresence>
                {isCardVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-20 right-2"
                    >
                        <Card
                            ref={cardRef}
                            isBlurred
                            shadow="lg"
                            className="p-4 bg-[#10172d] text-gray-100"
                        >
                            <CardHeader>
                                <div>
                                    <h1>Audio Volume Control</h1>
                                    <div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            className="bg-red-500"
                                            onChange={handleVolumeChange}
                                            style={{ width: "200px" }}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="flex justify-center mt-4">
                                    <CircularProgress
                                        aria-label="Loading..."
                                        size="lg"
                                        value={Math.round(volume * 100)}
                                        color={
                                            Math.round(volume * 100) >= 90
                                                ? "danger"
                                                : Math.round(volume * 100) <= 40
                                                ? "primary"
                                                : "success"
                                        }
                                        showValueLabel={true}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BackgroundMusic;
