"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import {
    FaRegCirclePlay,
    FaPause,
    FaForward,
    FaBackward,
} from "react-icons/fa6";
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
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioUrls = [
        { url: "/audio/music3.mp3", name: "Radio -Lu Hpring" },
        { url: "/audio/music1.mp3", name: "ပျောက်ဆုံးနေသောနိဗ္ဗာန်ဘုံ" },
        { url: "/audio/music2.mp3", name: "Mary - NEED" },
        { url: "/audio/music4.mp3", name: "သီချင်းလေးကြားရင်" },
        { url: "/audio/music5.mp3", name: "စိတ်ညစ်မှာစိုး" },
    ];
    const playNextAudio = () => {
        setCurrentAudioIndex((prevIndex) =>
            prevIndex === audioUrls.length - 1 ? 0 : prevIndex + 1
        );
    };
    const playPreviousAudio = () => {
        setCurrentAudioIndex((prevIndex) =>
            prevIndex === 0 ? audioUrls.length - 1 : prevIndex - 1
        );
    };
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = audioUrls[currentAudioIndex].url;
            audioRef.current.volume = volume;
            audioRef.current.load();
            audioRef.current.loop = false;
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [currentAudioIndex]);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            const handleAudioEnd = () => {
                playNextAudio();
            };
            const updateTime = () => {
                setCurrentTime(audioRef.current.currentTime);
                setDuration(audioRef.current.duration);
            };
            audioRef.current.addEventListener("ended", handleAudioEnd);
            audioRef.current.addEventListener("timeupdate", updateTime);
            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener(
                        "ended",
                        handleAudioEnd
                    );
                    audioRef.current.removeEventListener(
                        "timeupdate",
                        updateTime
                    );
                }
            };
        }
    }, [isPlaying, volume]);
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    const handleProgressChange = (e) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };
    const toggleCardVisibility = () => {
        setIsCardVisible((prev) => !prev);
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
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
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
                            className="p-4 bg-[#10172d] text-gray-100 w-[360px]"
                        >
                            <CardBody>
                                <h1 className="text-center">Music Player</h1>
                                <p>Volume</p>
                                <div className="flex flex-col justify-between items-center my-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="w-60"
                                    />
                                    <CircularProgress
                                        className="my-3"
                                        aria-label="Volume"
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
                                <div className="flex flex-col items-center">
                                    <p className="text-center mb-4">
                                        {audioUrls[currentAudioIndex].name}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <FaBackward
                                            className="cursor-pointer"
                                            onClick={playPreviousAudio}
                                        />
                                        {isPlaying ? (
                                            <FaPause
                                                className="cursor-pointer"
                                                onClick={togglePlayPause}
                                            />
                                        ) : (
                                            <FaRegCirclePlay
                                                className="cursor-pointer"
                                                onClick={togglePlayPause}
                                            />
                                        )}
                                        <FaForward
                                            className="cursor-pointer"
                                            onClick={playNextAudio}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span>{formatTime(currentTime)}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 0}
                                        step="1"
                                        value={currentTime}
                                        onChange={handleProgressChange}
                                        className="w-60"
                                    />
                                    <span>
                                        {!isNaN(duration)
                                            ? formatTime(duration)
                                            : "0:00"}
                                    </span>
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
