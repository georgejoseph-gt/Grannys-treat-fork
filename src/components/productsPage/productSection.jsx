'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productCategories } from './productData';
import OptimizedImage from '../OptimizedImage';
import { smoothScrollTo } from '../../lib/scrollUtils';

// Responsive breakpoint hook
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

export default function ProductsSection() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const breakpoint = useBreakpoint();

  const category = productCategories[categoryIndex];
  const product = category.products[productIndex];

  const nextCategory = useCallback(() => {
    setIsTransitioning(true);
    setCategoryIndex((i) => (i + 1) % productCategories.length);
    setProductIndex(0);
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  const prevCategory = useCallback(() => {
    setIsTransitioning(true);
    setCategoryIndex((i) => (i === 0 ? productCategories.length - 1 : i - 1));
    setProductIndex(0);
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  const handleProductChange = (index) => {
    setProductIndex(index);
  };

  const handleLocateUs = () => {
    smoothScrollTo('contact-form', 50);
  };

  // Get consistent dimensions for the current breakpoint
  const getProductDimensions = () => {
    const isMobile = ['xs', 'sm', 'md'].includes(breakpoint);
    return {
      width: isMobile ? 220 : 350,
      height: isMobile ? 180 : 300,
      maxWidth: isMobile ? '80vw' : '32vw',
      maxHeight: isMobile ? '32vh' : '60vh',
    };
  };

  const dimensions = getProductDimensions();
  const isMobile = ['xs', 'sm', 'md'].includes(breakpoint);

  return (
    <section
      className="relative w-full min-h-[95vh] flex flex-col transition-colors duration-500"
      style={{ backgroundColor: product.background }}
    >
      {/* Category Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 md:px-8 pointer-events-none z-20">
        <button
          onClick={prevCategory}
          className="pointer-events-auto cursor-pointer flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <div className="bg-white/75 backdrop-blur-sm hover:bg-white rounded-full p-1.5 sm:p-2 transition-all duration-300">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
          </div>
        </button>
        <button
          onClick={nextCategory}
          className="pointer-events-auto cursor-pointer flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <div className="bg-white/75 backdrop-blur-sm hover:bg-white rounded-full p-1.5 sm:p-2 transition-all duration-300">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col">
        {/* Category Title */}
        <div className="w-full flex items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[Fredoka] font-bold text-white drop-shadow-md text-center">
            {category.name}
          </h2>
        </div>

        {/* Product Content - Responsive Layout */}
        {isMobile ? (
          // Mobile Layout
          <div className="flex-1 flex flex-col items-center justify-start gap-y-5 px-4 pb-20">
            {/* Product Image */}
            <div className="w-full flex items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative transition-all duration-500"
                  style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    maxWidth: dimensions.maxWidth,
                    maxHeight: dimensions.maxHeight,
                  }}
                >
                  <OptimizedImage
                    src={product.images.main}
                    alt={category.name}
                    width={dimensions.width}
                    height={dimensions.height}
                    style={{
                      objectFit: 'contain',
                      display: 'inline-block',
                      opacity: isTransitioning ? 0 : 1,
                      transition: 'opacity 0.3s ease-in-out',
                    }}
                    className="drop-shadow-lg rounded-xl"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Description */}
            <div className="w-full flex flex-col items-center justify-center px-4 py-2">
              <p className="text-base sm:text-lg leading-relaxed text-white mb-6 font-[Fredoka] font-normal text-center max-w-md mx-auto">
                {product.text.left}
              </p>
              {/* Locate Us Button */}
              <div 
                onClick={handleLocateUs}
                className="relative w-[140px] sm:w-[180px] cursor-pointer hover:scale-105 transition-transform mx-auto mt-2 mb-6"
              >
                <img
                  src="/assets/page3/page3_locate.png"
                  alt="locate us"
                  className="w-full h-auto drop-shadow-md"
                />
              </div>
            </div>

            {/* Right Side Text (Small Cloud) */}
            <div className="w-full flex justify-center px-4">
              <div className="max-w-xs rounded-[30px] bg-white/90 backdrop-blur-sm px-4 py-3 text-xs sm:text-sm text-gray-800 text-center">
                {product.text.rightSmall}
              </div>
            </div>

            {/* Counter */}
            <div className="w-full flex flex-col items-center justify-center gap-2 mt-4 mb-4">
              <div className="text-lg sm:text-xl font-[Fredoka] font-normal text-white">
                {String(productIndex + 1).padStart(2, '0')}/{String(category.products.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        ) : (
          // Desktop Layout
          <>
            {/* Main Content Area */}
            <div className="flex-1 w-full flex flex-col md:flex-row items-center md:items-stretch px-4 sm:px-6 md:px-8 pb-24">
              {/* Left - Description */}
              <div className="w-full md:w-3/8 h-auto md:h-full flex flex-col items-start justify-center relative px-4 py-4 md:py-0">
                <div className="max-w-full md:max-w-[500px] mx-auto md:ml-8 md:mr-6">
                  <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-white mb-4 md:mb-6 font-[Fredoka] font-normal">
                    {product.text.left}
                  </p>
                  {/* Locate Us Button */}
                  <div 
                    onClick={handleLocateUs}
                    className="relative w-[140px] sm:w-[180px] md:w-[200px] cursor-pointer hover:scale-105 transition-transform mx-auto md:mx-0"
                  >
                    <img
                      src="/assets/page3/page3_locate.png"
                      alt="locate us"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Center - Product Image */}
              <div className="w-full flex-col md:w-3/8 h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative transition-all duration-500"
                    style={{
                      width: dimensions.width,
                      height: dimensions.height,
                      maxWidth: dimensions.maxWidth,
                      maxHeight: dimensions.maxHeight,
                    }}
                  >
                    <OptimizedImage
                      src={product.images.main}
                      alt={category.name}
                      width={dimensions.width}
                      height={dimensions.height}
                      style={{
                        objectFit: 'contain',
                        display: 'inline-block',
                        opacity: isTransitioning ? 0 : 1,
                        transition: 'opacity 0.3s ease-in-out',
                      }}
                      className="drop-shadow-lg rounded-xl"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right - Decorations and Text */}
              <div className="w-full md:w-2/8 h-full relative flex flex-col items-center justify-center px-4">
                {/* Big Cloud */}
                <div className="relative z-10 max-w-xs rounded-[40px] bg-white/90 backdrop-blur-sm p-6 text-sm text-gray-800 mb-4">
                  {product.text.right}
                </div>

                {/* Small Cloud */}
                <div className="absolute bottom-[-40px] right-10 rounded-[30px] bg-white/90 backdrop-blur-sm px-4 py-2 text-xs text-gray-700">
                  {product.text.rightSmall}
                </div>

                {/* Decoration Images */}
                {product.decorations.stars && (
                  <img
                    src={product.decorations.stars}
                    alt=""
                    className="absolute right-6 top-6 w-20 opacity-80"
                  />
                )}
                {product.decorations.flower && (
                  <img
                    src={product.decorations.flower}
                    alt=""
                    className="absolute right-20 top-[-80px] w-24 opacity-80"
                  />
                )}
                {product.decorations.mint && (
                  <img
                    src={product.decorations.mint}
                    alt=""
                    className="absolute right-0 top-20 w-20 opacity-80"
                  />
                )}
                {product.decorations.ice && (
                  <img
                    src={product.decorations.ice}
                    alt=""
                    className="absolute bottom-10 left-[-40px] w-24 opacity-80"
                  />
                )}
                {product.decorations.leaf && (
                  <img
                    src={product.decorations.leaf}
                    alt=""
                    className="absolute right-10 top-10 w-20 opacity-80"
                  />
                )}
                {product.decorations.tofu && (
                  <img
                    src={product.decorations.tofu}
                    alt=""
                    className="absolute bottom-20 right-5 w-20 opacity-80"
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Product Thumbnails - Bottom Navigation */}
        <div className="w-full flex justify-center items-end pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6">
          <div className="flex items-end gap-3 sm:gap-4 md:gap-6 overflow-x-auto max-w-full">
            {category.products.map((item, i) => {
              const isSelected = i === productIndex;
              const scale = isSelected ? 1.3 : 1;
              return (
                <button
                  key={item.id}
                  onClick={() => handleProductChange(i)}
                  className="transition-all duration-300 focus:outline-none"
                  style={{
                    transform: `scale(${scale})`,
                  }}
                >
                  <img
                    src={item.images.thumb}
                    alt={item.id}
                    className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-lg"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
