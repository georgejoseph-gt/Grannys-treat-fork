import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Page4 = () => {
  const images = [
    "/assets/page4/img5.jpg",
    "/assets/page4/img6.jpg",
    "/assets/page4/img7.jpg",
    "/assets/page4/img8.jpg",
    // "/assets/page4/photo.png",
    "/assets/page4/img1.png",
    "/assets/page4/img2.png",
    "/assets/page4/img3.png",
    "/assets/page4/img4.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 -> next/right, -1 -> prev/left
  const intervalRef = useRef(null);
  const pointerStartX = useRef(0);
  const isPointerDown = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    startAutoAdvance();
    return () => stopAutoAdvance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  function startAutoAdvance() {
    stopAutoAdvance();
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
  }

  function stopAutoAdvance() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function resetAutoAdvance() {
    stopAutoAdvance();
    // restart after short pause so user can interact
    intervalRef.current = setTimeout(() => startAutoAdvance(), 3500);
  }

  return (
    <div className="w-full bg-[#d1ebfd] py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-20 relative">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Heading */}
        <h3
          className="font-[Fredoka] text-[#285192] font-extrabold text-center tracking-wider
          text-[clamp(1.5rem,4vw,3rem)] mt-4 sm:mt-6 md:mt-10 px-4"
        >
          Our Journey to Healthier Dairy
        </h3>

        {/* Content Container */}
        <div className="w-full flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-20 mt-6 sm:mt-8 md:mt-10 items-center">
          {/* Left Image */}
          <div className="w-full lg:w-1/2 px-4 sm:px-6 md:px-10 lg:px-0 pt-4 sm:pt-6 md:pt-10 lg:pt-20 flex flex-col justify-center">
            <div
              className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[630px] overflow-hidden rounded-2xl touch-none"
              onTouchStart={(e) => {
                isPointerDown.current = true;
                pointerStartX.current = e.touches[0].clientX;
                setDragOffset(0);
                setIsDragging(true);
                stopAutoAdvance();
                e.preventDefault();
              }}
              onTouchMove={(e) => {
                if (!isPointerDown.current) return;
                const currentX = e.touches[0].clientX;
                setDragOffset(currentX - pointerStartX.current);
                e.preventDefault();
              }}
              onTouchEnd={(e) => {
                if (!isPointerDown.current) return;
                isPointerDown.current = false;
                const deltaX = dragOffset;
                setIsDragging(false);
                const threshold = 30; // Lower threshold for easier swiping on mobile
                
                if (deltaX < -threshold) {
                  // swipe left -> next
                  setDirection(1);
                  setCurrentIndex((prev) => (prev + 1) % images.length);
                } else if (deltaX > threshold) {
                  // swipe right -> prev
                  setDirection(-1);
                  setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                }
                setDragOffset(0);
                resetAutoAdvance();
              }}
              onPointerDown={(e) => {
                // For mouse/desktop
                if (e.pointerType === 'mouse') {
                  isPointerDown.current = true;
                  pointerStartX.current = e.clientX;
                  setDragOffset(0);
                  setIsDragging(true);
                  stopAutoAdvance();
                }
              }}
              onPointerMove={(e) => {
                // For mouse/desktop drag
                if (isPointerDown.current && e.pointerType === 'mouse') {
                  const currentX = e.clientX;
                  setDragOffset(currentX - pointerStartX.current);
                }
              }}
              onPointerUp={(e) => {
                if (!isPointerDown.current || e.pointerType !== 'mouse') return;
                isPointerDown.current = false;
                const deltaX = dragOffset;
                setIsDragging(false);
                const threshold = 50;
                
                if (deltaX < -threshold) {
                  setDirection(1);
                  setCurrentIndex((prev) => (prev + 1) % images.length);
                } else if (deltaX > threshold) {
                  setDirection(-1);
                  setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                }
                setDragOffset(0);
                resetAutoAdvance();
              }}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`Slide ${currentIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                  decoding="async"
                  custom={direction}
                  initial={{ x: direction === 1 ? 80 : -80, opacity: 0.0 }}
                  animate={{ 
                    x: isDragging ? dragOffset : 0, 
                    opacity: isDragging ? Math.max(0.7, 1 - Math.abs(dragOffset) / 200) : 1 
                  }}
                  exit={{ x: direction === 1 ? -80 : 80, opacity: 0.0 }}
                  transition={{ 
                    duration: isDragging ? 0 : 0.6, 
                    ease: "easeInOut" 
                  }}
                />
              </AnimatePresence>

              {/* Prev/Next Buttons */}
              <button
                aria-label="Previous slide"
                onClick={() => {
                  setDirection(-1);
                  setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                  resetAutoAdvance();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#285192] flex items-center justify-center shadow-md"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                aria-label="Next slide"
                onClick={() => {
                  setDirection(1);
                  setCurrentIndex((prev) => (prev + 1) % images.length);
                  resetAutoAdvance();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-60 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#285192] flex items-center justify-center shadow-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="flex space-x-2 mt-4 w-full justify-center">
              {images.map((_, idx) => ( 
                <button
                  key={idx}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 focus:outline-none ${
                    idx === currentIndex ? "bg-[#285192]" : "bg-[#cbdef3]"
                  }`}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 px-4 sm:px-6 md:px-10 lg:px-20 flex flex-col items-start gap-4 sm:gap-6">
            <img
              src="/assets/photo2.png"
              alt="Healthy Dairy"
              className="w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px] object-cover rounded-lg"
              loading="lazy"
              decoding="async"
            />

            <p className="font-[Fredoka] text-[#285192] font-normal text-[clamp(1rem,2vw,1.2rem)] leading-relaxed">
              At Granny&apos;s Treat, our story began with a simple truth —
              traditional dahi isn't just delicious, it's naturally rich in
              probiotics that support gut health and immunity.
              <br />
              <br />
              Inspired by this, we set out to create dairy that's fresh, pure,
              and free from antibiotics — because real nourishment should never
              come with compromises.
              <br />
              <br />
              We keep things simple: high-quality milk, no shortcuts, and
              probiotic-rich products that support your health, your lifestyle,
              and your taste buds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page4;
