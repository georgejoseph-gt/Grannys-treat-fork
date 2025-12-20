// src/app/Page5.jsx (or wherever Page5 lives)
import { useRef, useEffect, useState } from "react";
import { productCategories } from "../lib/carouselData";
import OptimizedImage from "./OptimizedImage";

const Page5 = () => {
  const lassiImages =
    productCategories.find((cat) => cat.category === "Lassi")?.items.map((i) => i.image) ||
    [];
    
  const maxOrbitItems = 4;
  const orbitCount = Math.min(maxOrbitItems, lassiImages.length);

  // choose evenly-spaced images (so if you have more than 4, pick spread)
  const chosenImages = Array.from({ length: orbitCount }).map((_, i) => {
    const idx = Math.floor((i * lassiImages.length) / orbitCount);
    return lassiImages[idx];
  });

  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const [positions, setPositions] = useState(
    // initial placeholder positions for orbitCount items
    Array.from({ length: orbitCount }).map(() => ({
      left: "50%",
      top: "50%",
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotate: 0,
      zIndex: 1,
      opacity: 1,
      filter: "none",
    }))
  );
  const [imageSize, setImageSize] = useState(200);

  // measure container for radii
  const sizeRef = useRef({ w: 800, h: 400 });

  // Update image size based on window width
  useEffect(() => {
    const updateImageSize = () => {
      if (window.innerWidth < 640) {
        setImageSize(120); // Reduced from 120 for mobile
      } else if (window.innerWidth < 768) {
        setImageSize(150);
      } else if (window.innerWidth < 1024) {
        setImageSize(180);
      } else {
        setImageSize(200);
      }
    };

    updateImageSize();
    window.addEventListener('resize', updateImageSize);
    return () => window.removeEventListener('resize', updateImageSize);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      sizeRef.current = { w: rect.width || 800, h: rect.height || 400 };
    };

    measure();

    // resize observer for responsive sizes
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // animation loop (center image holds for a second, then next image transitions to center)
  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    // timing: hold center image, then transition to the next center
    const holdMs = 2500; // center stays still
    const transitionMs = 1000; // smooth move to next center
    const stepMs = holdMs + transitionMs; // per image step

    const getStateForCenter = (centerIndex, w, h) => {
      const cx = w / 2;
      // push the orbit a bit downward relative to container height
      const cy = h / 2 + h * 0.1; // ~10% down
      
      // Responsive orbit radius factors - smaller on mobile
      const isMobile = w < 640;
      const isTablet = w >= 640 && w < 1024;
      const orbitRadiusXFactor = isMobile ? 0.22 : isTablet ? 0.20 : 0.18;
      const orbitRadiusYFactor = isMobile ? 0.12 : isTablet ? 0.11 : 0.10;
      const rx = w * orbitRadiusXFactor;
      const ry = h * orbitRadiusYFactor;

      // Responsive scale values - adjusted for better mobile visibility
      const centerScale = isMobile ? 1.4 : isTablet ? 1.50 : 1.8; // Reduced from 1.5 for mobile
      const sideScale = isMobile ? 0.85 : isTablet ? 1.05 : 1.15; // Reduced from 0.95 for mobile
      const behindScale = isMobile ? 0.65 : isTablet ? 0.8 : 0.85; // Reduced from 0.75 for mobile

      return chosenImages.map((_, i) => {
        const rel = (i - centerIndex + orbitCount) % orbitCount; // 0 is center
        if (rel === 0) {
          return {
            left: `${cx}px`,
            top: `${cy}px`,
            translateX: "-50%",
            translateY: "-50%",
            scale: centerScale,
            rotate: 0,
            zIndex: 1000,
            opacity: 1,
            filter: "none",
          };
        }

        // Slot mapping for 4 items: 0=center, 1=right, 2=behind, 3=left
        // If there are fewer than 4 items, we approximate positions.
        if (rel === 1) {
          // right
          return {
            left: `${cx + rx}px`,
            top: `${cy}px`,
            translateX: "-50%",
            translateY: "-50%",
            scale: sideScale,
            rotate: 0,
            zIndex: 600,
            opacity: 0.0,
            filter: "blur(0.6px) saturate(0.9)",
          };
        }
        if (rel === 2) {
          // behind center (centered, up a bit)
          return {
            left: `${cx}px`,
            top: `${cy - ry}px`,
            translateX: "-50%",
            translateY: "-50%",
            scale: behindScale,
            rotate: 0,
            zIndex: 200,
            opacity: 0.0,
            filter: "blur(1.2px) brightness(0.95)",
          };
        }
        // rel === 3 or any other -> left
        return {
          left: `${cx - rx}px`,
          top: `${cy}px`,
          translateX: "-50%",
          translateY: "-50%",
          scale: sideScale,
          rotate: 0,
          zIndex: 600,
          opacity: 0.0,
          filter: "blur(0.6px) saturate(0.9)",
        };
      });
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;

      const { w, h } = sizeRef.current;

      const stepIndex = Math.floor(elapsed / stepMs);
      const phaseMs = elapsed % stepMs;
      const centerNow = ((stepIndex % orbitCount) + orbitCount) % orbitCount;
      const centerNext = (centerNow + 1) % orbitCount;

      const stateA = getStateForCenter(centerNow, w, h);
      const stateB = getStateForCenter(centerNext, w, h);

      let newPos;
      const isMobile = w < 640;
      if (phaseMs <= holdMs) {
        // hold: show centered image fully; tease next only on tablet/desktop
        const teaseProgress = phaseMs / holdMs;
        const baseOpacity = 0.45;
        const pulseAmplitude = 0.12;
        const nextOpacity = baseOpacity + Math.sin(teaseProgress * Math.PI * 3) * pulseAmplitude;
        
        newPos = stateA.map((pos, i) => {
          if (i === centerNow) {
            return { ...pos, opacity: 1, filter: "none" };
          } else if (i === centerNext) {
            if (isMobile) {
              return { ...pos, opacity: 0 };
            }
            return {
              ...pos,
              opacity: nextOpacity,
              filter: "blur(0.3px) saturate(0.9) brightness(1.15) drop-shadow(0 0 8px rgba(40, 81, 146, 0.4))",
            };
          } else {
            return { ...pos, opacity: 0 };
          }
        });
      } else {
        // transition: smooth crossfade between current and next
        const t = Math.min(1, (phaseMs - holdMs) / transitionMs);
        // Smooth opacity transition: current fades out, next fades in
        const currentOpacity = 1 - t;
        const nextOpacity = t;
        
        newPos = stateA.map((posA, i) => {
          const posB = stateB[i];
          const leftA = parseFloat(posA.left);
          const topA = parseFloat(posA.top);
          const leftB = parseFloat(posB.left);
          const topB = parseFloat(posB.top);
          
          let opacity = 0;
          let filter = posA.filter;
          
          if (i === centerNow) {
            // Current product fading out with smooth transition
            opacity = currentOpacity;
            const blurAmount = t * 0.4;
            const saturateAmount = 1 - t * 0.2;
            const brightnessAmount = 1 - t * 0.15;
            filter = `blur(${blurAmount}px) saturate(${saturateAmount}) brightness(${brightnessAmount})`;
          } else if (i === centerNext) {
            // Next product fading in, removing the teasing blur/glow
            opacity = nextOpacity;
            const blurAmount = (1 - t) * 0.3;
            const saturateAmount = 0.9 + t * 0.1;
            const brightnessAmount = 1.15 - t * 0.15;
            const glowOpacity = (1 - t) * 0.4;
            filter = `blur(${blurAmount}px) saturate(${saturateAmount}) brightness(${brightnessAmount}) drop-shadow(0 0 ${8 + t * 5}px rgba(40, 81, 146, ${glowOpacity}))`;
          }
          
          return {
            left: `${lerp(leftA, leftB, t)}px`,
            top: `${lerp(topA, topB, t)}px`,
            translateX: "-50%",
            translateY: "-50%",
            scale: lerp(posA.scale, posB.scale, t),
            rotate: 0,
            zIndex: Math.round(lerp(posA.zIndex, posB.zIndex, t)),
            opacity: opacity,
            filter: filter,
          };
        });
      }

      setPositions(newPos);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenImages.join?.(",") /* include chosenImages length so it re-runs when selection changes */]);

  // initial fallback for reduced motion or no images
  if (chosenImages.length === 0) {
    return (
      <div className="h-auto min-h-screen w-full bg-[#55acee] relative z-10 flex items-center justify-center">
        <p className="text-white">No Lassi images found</p>
      </div>
    );
  }

  return (
    <div className="h-auto min-h-fit w-full bg-[#55acee] relative z-10 flex flex-col items-center justify-center px-2 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Top Image */}
      <img
        src="/assets/BG/page5_top.png"
        alt="img"
        className="absolute top-0 w-full h-28 sm:h-36 md:h-44 lg:h-52 object-cover"
      />

      {/* Content Container */}
      <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center mt-16 sm:mt-24 md:mt-32 lg:mt-40">
        {/* Text Image */}
        <img
          src="/assets/Icons/benefitlabel.svg"
          alt="img"
          className="w-[85%] sm:w-[75%] md:w-[65%] lg:w-[60%] max-w-[380px] sm:max-w-[540px] md:max-w-[700px] lg:max-w-[680px] transition-all duration-300 mb-8 sm:mb-10 md:mb-12"
        />

        {/* Design Image with looping Lassi image overlay */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[98vw] sm:max-w-[88vw] md:max-w-[800px] lg:max-w-[1000px] mx-auto h-[420px] sm:h-[480px] md:h-[550px] lg:h-[640px] overflow-hidden"
        >
          {/* background artwork - Desktop version */}
          <img
            src="/assets/Icons/p5-background-benefit.png"
            alt="Background decoration"
            className="hidden md:block absolute inset-0 w-full h-full object-contain transition-all duration-300 transform origin-center"
          />
          <img
            src="/assets/Icons/p5-benefit-mobile.png"
            alt="Background decoration"
            className="block md:hidden absolute inset-0 w-full h-full object-contain object-center transition-all duration-300 transform origin-center scale-105"
          />

          {/* Orbiting images */}
          {chosenImages.map((src, i) => {
            const pos = positions[i] || {};
            const opacity = pos.opacity ?? 0;
            // Add glow effect for teasing (when opacity is between 0.2 and 0.8)
            const isTeasing = opacity > 0.2 && opacity < 0.9;
            const isCentered = opacity >= 0.9;
            
            return (
              <div
                key={String(i)}
                // pointer-events-none so they don't block clicks
                className="absolute"
                style={{
                  left: pos.left || "50%",
                  top: pos.top || "50%",
                  transform: `translate(${pos.translateX || "-50%"}, ${pos.translateY || "-50%"}) scale(${pos.scale || 1}) rotate(${pos.rotate || 0}deg)`,
                  zIndex: pos.zIndex || 1,
                  opacity: opacity,
                  filter: pos.filter || "none",
                  transition: "transform 120ms linear, filter 120ms linear, opacity 120ms linear, box-shadow 120ms linear",
                  pointerEvents: "none",
                }}
                aria-hidden
              >
                <OptimizedImage
                  src={src}
                  alt={`Lassi ${i}`}
                  width={undefined}
                  height={undefined}
                  className="block rounded-xl transition-all duration-300"
                  // limit rendered size; actual transform uses scale so base size controls max space
                  style={{
                    width: imageSize,
                    height: imageSize,
                    objectFit: "contain",
                    display: "block",
                    willChange: "transform, filter, opacity",
                  }}
                />
              </div>
            );
          })}
        </div>
        
        {/* Bottom spacing for better visual balance */}
        <div className="h-8 sm:h-12 md:h-16 lg:h-20"></div>
      </div>
    </div>
  );
};

export default Page5;
