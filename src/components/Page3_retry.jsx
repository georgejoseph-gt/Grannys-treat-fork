"use client";
import React, { useState } from 'react'
import { productCategories } from '../lib/carouselData'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Carousel from '../helperComponents/Carousel';
import OptimizedImage from './OptimizedImage';

const Page3_retry = () => {

    const [categoryIndex, setCategoryIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const category = productCategories[categoryIndex];
    const thumbnails = category.items.map((item) => item.image);
    const selectedScales = category.items.map((item) => item.selectedScale || 1.7);
    const thumbnailGap = category.thumbnailGap || 8;


    const prevCategory = () => {
        setIsTransitioning(true);
        setCategoryIndex((i) => (i === 0 ? productCategories.length - 1 : i - 1));
        setCurrentImageIndex(0);
        // Reset transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const nextCategory = () => {
        setIsTransitioning(true);
        setCategoryIndex((i) => (i === productCategories.length - 1 ? 0 : i + 1));
        setCurrentImageIndex(0);
        // Reset transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };

    const preloadedImages = new Set();
    productCategories.forEach(cat => {
        cat.items.forEach(item => {
            const img = new Image();
            img.src = item.image;
            preloadedImages.add(item.image);
        });
    });
    return (
        <div className='w-full h-screen flex flex-col bg-gray-100 relative '>
            <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 md:px-8 pointer-events-none z-20">
                <button
                    onClick={prevCategory}
                    className="pointer-events-auto cursor-pointer flex items-center gap-2 text-black/70 hover:text-black transition-colors group"
                >
                    <div className="bg-white/75 backdrop-blur-sm hover:bg-white rounded-full p-1.5 sm:p-2 transition-all duration-300">
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                </button>
                <button
                    onClick={nextCategory}
                    className="pointer-events-auto cursor-pointer flex items-center gap-2 text-black/70 hover:text-black transition-colors group"
                >
                    <div className="bg-white/75 backdrop-blur-sm hover:bg-white rounded-full p-1.5 sm:p-2 transition-all duration-300">
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                </button>
            </div>
            <Carousel
                className="w-full h-[95vh]"
                thumbnails={thumbnails}
                onSlideChange={handleImageChange}
                initialSlide={currentImageIndex}
                selectedScales={selectedScales}
                thumbnailGap={thumbnailGap}
                items={category.items}
            >
                {category.items.map((item, idx) => {
                    return (
                        <div key={idx}>
                            <div className="flex flex-col gap-y-5">
                                <div className="w-full flex items-center justify-center mt-4 mb-4">
                                    <h1 className="text-3xl sm:text-4xl font-[Fredoka] font-bold text-white drop-shadow-md text-center">
                                        {item.title}
                                    </h1>
                                </div>
                                <div className="w-full flex items-center justify-center mb-8">
                                   
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Carousel>
        </div>
    )
}

export default Page3_retry
