// Page3.jsx
"use client";

import { useState, useEffect } from "react";
import Carousel from "../helperComponents/Carousel";
import { productCategories } from "../lib/carouselData";
import OptimizedImage from "./OptimizedImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// Preload all images when the module is imported
const preloadedImages = new Set();
productCategories.forEach(cat => {
  cat.items.forEach(item => {
    const img = new Image();
    img.src = item.image;
    preloadedImages.add(item.image);
  });
});

const breakpoints = { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 };

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("md");
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < breakpoints.sm) setBreakpoint("xs");
      else if (width < breakpoints.md) setBreakpoint("sm");
      else if (width < breakpoints.lg) setBreakpoint("md");
      else if (width < breakpoints.xl) setBreakpoint("lg");
      else setBreakpoint("xl");
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return breakpoint;
}

const Page3 = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const category = productCategories[categoryIndex];
  const thumbnails = category.items.map((item) => item.image);
  const currentItem = category.items[currentImageIndex];
  const selectedScales = category.items.map((item) => item.selectedScale || 1.7);
  const thumbnailGap = category.thumbnailGap || 8;
  const breakpoint = useBreakpoint();

  const prevCategory = () => {
    setCategoryIndex((i) => (i === 0 ? productCategories.length - 1 : i - 1));
    setCurrentImageIndex(0);
  };

  const nextCategory = () => {
    setCategoryIndex((i) => (i === productCategories.length - 1 ? 0 : i + 1));
    setCurrentImageIndex(0);
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  // Get consistent dimensions for the current breakpoint
  const getConsistentDimensions = (item) => {
    const imgStyle = item.imgStyle?.responsive?.[breakpoint] || item.imgStyle;
    const isMobile = ['xs', 'sm', 'md'].includes(breakpoint);

    return {
      width: isMobile ? (imgStyle?.width || 220) : (imgStyle?.width || 350),
      height: isMobile ? (imgStyle?.height || 180) : (imgStyle?.height || 300),
      maxWidth: isMobile ? '80vw' : '32vw',
      maxHeight: isMobile ? '32vh' : '60vh',
    };
  };

  return (
    <div className="w-full h-[95vh] flex flex-col bg-gray-100 relative z-10 -mt-[50px]">
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
          const dimensions = getConsistentDimensions(item);
          return (
            <div
              key={idx}
              className="w-full h-full flex flex-col items-center justify-start text-white text-lg sm:text-xl md:text-2xl font-bold transition-all duration-500"
              style={{ backgroundColor: item.colorbg }}
            >
              {/* Responsive order for mobile/tablet vs desktop */}
              {['xs', 'sm', 'md'].includes(breakpoint) ? (
                <div className="flex flex-col gap-y-5 pt-20">
                  {/* Div 1 - Product Title */}
                  <div className="w-full flex items-center justify-center mt-4 mb-4">
                    <motion.h1
                      key={`title-${categoryIndex}-${idx}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={idx === currentImageIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="text-3xl sm:text-4xl font-[Fredoka] font-bold text-white drop-shadow-md text-center"
                    >
                      {item.title}
                    </motion.h1>
                  </div>
                  {/* Div 3 - Main Product Image */}
                  <div className="w-full flex items-center justify-center mb-8">
                    <motion.div
                      key={`${categoryIndex}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={idx === currentImageIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="relative"
                      style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        maxWidth: dimensions.maxWidth,
                        maxHeight: dimensions.maxHeight,
                      }}
                    >
                      <OptimizedImage
                        src={item.image}
                        alt={item.title}
                        width={dimensions.width}
                        height={dimensions.height}
                        style={{
                          objectFit: 'contain',
                          display: 'inline-block',
                        }}
                        className="drop-shadow-lg rounded-xl"
                      />
                    </motion.div>
                  </div>
                  {/* Div 2 - Description */}
                  <div className="w-full flex flex-col items-center justify-center px-4 py-2">
                    <motion.p
                      key={`desc-${categoryIndex}-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={idx === currentImageIndex ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
                      className="text-base sm:text-lg leading-relaxed text-white mb-6 font-[Fredoka] font-normal text-center max-w-md mx-auto"
                    >
                      {item.subtext1}
                    </motion.p>

                    {/*
                     <div className="relative w-[140px] sm:w-[180px] cursor-pointer hover:scale-105 transition-transform mx-auto mt-2 mb-6">
                      <img
                        src="/assets/page3/page3_locate.png"
                        alt="locate us"
                        className="w-full h-auto drop-shadow-md"
                      />
                    </div>
                    */}
                  </div>
                  {/* Div 5 - Counter */}
                  <div className="w-full flex flex-col items-center justify-center gap-2 mt-2 mb-4">
                    <div className="text-lg sm:text-xl font-[Fredoka] font-normal text-black">
                      {String(currentImageIndex + 1).padStart(2, '0')}/{String(category.items.length).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Div 1 - Product Title - 20vh */}
                  <div className="w-full h-[35vh] flex items-center justify-center">
                    <motion.h1
                      key={`title-desktop-${categoryIndex}-${idx}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={idx === currentImageIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="text-2xl sm:text-3xl lg:text-6xl font-[Fredoka]"
                    >
                      {item.title}
                    </motion.h1>
                  </div>
                  {/* Main Content Area - 50vh */}
                  <div className="w-full h-[65vh] flex flex-col md:flex-row items-center md:items-stretch">
                    {/* Div 2 - Left Space with Description */}
                    <div className="w-full md:w-3/8 h-auto md:h-full flex flex-col items-start justify-center relative px-4 py-4 md:py-0">
                      <div className="max-w-full md:max-w-[500px] mx-auto md:ml-32 md:mr-6">
                        <motion.p
                          key={`desc-desktop-${categoryIndex}-${idx}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={idx === currentImageIndex ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                          className="text-lg sm:text-xl md:text-2xl leading-relaxed text-white mb-4 md:mb-6 font-[Fredoka] font-normal"
                        >
                          {item.subtext1}
                        </motion.p>
                        <div className="relative w-[140px] sm:w-[180px] md:w-[200px] cursor-pointer hover:scale-105 transition-transform mx-auto md:mx-0">
                          <img
                            src="/assets/page3/page3_locate.png"
                            alt="locate us"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Div 3 - Main Product Image */}
                    <div className="w-full flex-col md:w-3/8 h-full flex items-center justify-around ">
                      <span className=" w-fit h-[70%]">
                        <motion.div
                          key={`${categoryIndex}-${idx}`}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={idx === currentImageIndex ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="relative"
                          style={{
                            width: dimensions.width,
                            height: dimensions.height,
                            maxWidth: dimensions.maxWidth,
                            maxHeight: dimensions.maxHeight,
                          }}
                        >
                          <OptimizedImage
                            src={item.image}
                            alt={item.title}
                            width={dimensions.width}
                            height={dimensions.height}
                            style={{
                              objectFit: 'contain',
                              display: 'inline-block',
                            }}
                            className="drop-shadow-lg rounded-xl"
                          />
                        </motion.div>
                      </span>
                      <span className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-[Fredoka] font-normal text-black">
                        {/* {String(currentImageIndex + 1).padStart(2, '0')}/{String(category.items.length).padStart(2, '0')} */}
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-[Fredoka] font-normal text-black">
                          {/* {String(currentImageIndex + 1).padStart(2, '0')}/{String(category.items.length).padStart(2, '0')} */}
                        </div>
                      </span>
                    </div>
                    {/* Div 4 - Right Space with Features */}
                    {['md', 'lg', 'xl'].includes(breakpoint) && (
                      <div className="w-3/8 h-full relative flex items-center justify-start ">
                        {item.div4_image && (
                          <motion.img
                            key={`div4-${categoryIndex}-${idx}`}
                            src={item.div4_image}
                            alt="Section visual"
                            initial={{ opacity: 0, x: 20 }}
                            animate={idx === currentImageIndex ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                            className="object-contain max-w-full max-h-full"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {/* Div 5 - Counter - 30vh */}
                  <div className="w-full h-[20vh] md:h-[50vh] flex flex-col items-center justify-center gap-2 md:gap-4 ">
                    {/*
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-[Fredoka] font-normal text-black">
                      {String(currentImageIndex + 1).padStart(2, '0')}/{String(category.items.length).padStart(2, '0')}
                    </div>
                     */}

                  </div>
                </>
              )}
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Page3;
