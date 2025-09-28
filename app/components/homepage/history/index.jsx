"use client";
import Image from "next/image";
import CommonTitle from "@/app/components/common/CommonTitle";
import { Fade } from "react-awesome-reveal";
import { useState, useEffect } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

const HistorySection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Get all history images from the public/history folder
    const historyImages = [
         "photo_2025-09-28_20-09-54.jpg",
        "sg_group1.jpg",
        "sg_group2.jpg",
        "sg_group3.jpg",
        "boss_bathday_party.jpg",
        "boss_bathday_party2.jpg",
        "photo_2025-09-28_20-08-05.jpg",
        "photo_2025-09-28_20-09-31.jpg",
        "photo_2025-09-28_20-09-35.jpg",
        "photo_2025-09-28_20-09-37.jpg",
        "photo_2025-09-28_20-09-38.jpg",
        "photo_2025-09-28_20-09-40.jpg",
        "photo_2025-09-28_20-09-41.jpg",
        "photo_2025-09-28_20-09-42.jpg",
        "photo_2025-09-28_20-09-43.jpg",
        "photo_2025-09-28_20-09-45.jpg",
        "photo_2025-09-28_20-09-46.jpg",
        "photo_2025-09-28_20-09-48.jpg",
        "photo_2025-09-28_20-09-49.jpg",
        "photo_2025-09-28_20-09-52.jpg",
       
    ];

    const openModal = (image, index) => {
        setSelectedImage(image);
        setCurrentIndex(index);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const nextIndex = (currentIndex + 1) % historyImages.length;
        setCurrentIndex(nextIndex);
        setSelectedImage(historyImages[nextIndex]);
    };

    const prevImage = () => {
        const prevIndex = (currentIndex - 1 + historyImages.length) % historyImages.length;
        setCurrentIndex(prevIndex);
        setSelectedImage(historyImages[prevIndex]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    };

    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    return (
        <>
        <CommonTitle id="history" title="Developer History">
            <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>
            <div className="overflow-hidden">
                <Fade
                    direction="up"
                    delay={400}
                    cascade
                    damping={1e-1}
                    triggerOnce={true}
                >
                    <div className="text-center mb-12">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                            My Journey Through Code
                        </h3>
                        <p className="text-gray-300 text-sm lg:text-base max-w-2xl mx-auto">
                            A visual timeline of my development journey, capturing moments of growth, 
                            learning, and achievement in the world of technology.
                        </p>
                    </div>
                </Fade>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                    {historyImages.map((image, index) => (
                        <Fade
                            key={image}
                            direction="up"
                            delay={600 + (index * 100)}
                            cascade
                            damping={1e-1}
                            triggerOnce={true}
                        >
                            <div 
                                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 p-1 hover:scale-105 transition-all duration-300 cursor-pointer"
                                onClick={() => openModal(image, index)}
                            >
                                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                                    <Image
                                        src={`/history/${image}`}
                                        alt={`Development history ${index + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-xs font-medium truncate">
                                            Memory #{index + 1} - Click to view
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    ))}
                </div>
                
                <Fade
                    direction="up"
                    delay={800}
                    cascade
                    damping={1e-1}
                    triggerOnce={true}
                >
                    <div className="text-center mt-12">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-full border border-violet-500/30">
                            <div className="w-2 h-2 bg-[#16f2b3] rounded-full animate-pulse"></div>
                            <span className="text-gray-300 text-sm">
                                {historyImages.length} Moments Captured
                            </span>
                        </div>
                    </div>
                </Fade>
            </div>
        </CommonTitle>

        {/* Image Modal - Outside CommonTitle to avoid container constraints */}
        {selectedImage && (
            <div 
                className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                onClick={closeModal}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                style={{ userSelect: 'none' }}
            >
                    <div className="relative max-w-4xl max-h-[90vh] mx-4">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute -top-12 right-0 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
                        >
                            <IoClose className="w-6 h-6 text-white" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
                        >
                            <IoChevronBack className="w-6 h-6 text-white" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
                        >
                            <IoChevronForward className="w-6 h-6 text-white" />
                        </button>

                        {/* Image */}
                        <div 
                            className="relative rounded-lg overflow-hidden shadow-2xl bg-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={`/history/${selectedImage}`}
                                alt={`Development history ${currentIndex + 1}`}
                                width={1200}
                                height={800}
                                className="max-w-full max-h-[80vh] object-contain"
                                priority
                                unoptimized
                            />
                        </div>

                        {/* Image Counter */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white/20 px-4 py-2 rounded-full">
                            <span className="text-white text-sm font-medium">
                                {currentIndex + 1} / {historyImages.length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HistorySection;
