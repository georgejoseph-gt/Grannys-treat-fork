"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  thumbnails?: string[];
  onSlideChange?: (index: number) => void;
  initialSlide?: number;
  selectedScales?: number[];
  thumbnailGap?: number;
  items?: any[];
}

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

const Carousel = ({
  children,
  className,
  thumbnails,
  onSlideChange,
  initialSlide = 0,
  selectedScales,
  thumbnailGap,
  items = [],
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const totalSlides = React.Children.count(children);
  const breakpoint = useBreakpoint();

  // Update currentIndex when initialSlide changes
  useEffect(() => {
    setCurrentIndex(initialSlide);
  }, [initialSlide]);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  return (
    <div
      className={`relative w-full mx-auto overflow-hidden ${className || ""}`}
    >
      {/* Carousel Content */}
      <div className="relative w-full h-full">
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Thumbnail Navigation */}
      {thumbnails && (
        <div className="absolute left-0 right-0 flex justify-center z-10">
          <div
            className={
              `flex items-end justify-center px-2 sm:px-6 md:px-0 ` +
              (breakpoint === 'xs' || breakpoint === 'sm' ? 'h-[60px]' : 'h-[110px]')
            }
            style={{ 
              gap: (() => {
                if (breakpoint === 'xs' || breakpoint === 'sm') {
                  return '6px';
                } else if (breakpoint === 'md') {
                  // Scale down large gaps for medium screens
                  const baseGap = thumbnailGap ?? 8;
                  return `${Math.min(Math.max(baseGap * 0.6, 6), 30)}px`;
                } else {
                  // For lg and xl, use full gap but cap at reasonable max
                  const baseGap = thumbnailGap ?? 8;
                  return `${Math.min(baseGap, 50)}px`;
                }
              })()
            }}
          >
            {thumbnails.map((src, index) => {
              const scale = selectedScales?.[index] ?? 1.7;
              const position = items[index]?.responsiveThumbnailNavPosition?.[breakpoint] || items[index]?.thumbnailNavPosition || { bottom: 0 };
              let thumbStyle = (items[index]?.thumbnailStyle?.responsive?.[breakpoint]) || items[index]?.thumbnailStyle || { width: 205, height: 105 };
              // Reduce thumbnail size for mobile
              if (breakpoint === 'xs' || breakpoint === 'sm') {
                thumbStyle = { width: Math.round(thumbStyle.width * 0.6), height: Math.round(thumbStyle.height * 0.6) };
              }
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="border-transparent transition-all duration-300 ease-in-out focus:outline-none"
                  style={{
                    transform: index === currentIndex ? `scale(${scale})` : 'scale(1)',
                    position: 'relative',
                    ...position,
                    minWidth: 36, minHeight: 24, // ensure tap target
                  }}
                >
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    width={thumbStyle.width}
                    height={thumbStyle.height}
                    className="rounded h-full object-contain transition-opacity duration-300"
                    loading={index <= 2 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
