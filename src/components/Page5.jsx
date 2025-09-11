// src/app/Page5.jsx (or wherever Page5 lives)
import { useRef, useEffect, useState } from "react";
import { productCategories } from "../lib/carouselData";
import OptimizedImage from "./OptimizedImage";

/**
 * Orbiting lassi gallery
 *
 * - Picks up to `maxOrbitItems` images from productCategories.Lassi
 * - Animates them on an elliptical orbit using requestAnimationFrame
 * - Computes per-image transform: translate(x,y) scale(s) rotate(r)
 * - Sets zIndex based on depth so front images overlay back images
 */
const Page5 = () => {
  const lassiImages =
    productCategories.find((cat) => cat.category === "Lassi")?.items.map((i) => i.image) ||
    [];

  // number of orbiting items (choose up to 4)
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

  // measure container for radii
  const sizeRef = useRef({ w: 800, h: 400 });

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

    const orbitRadiusXFactor = 0.18; // fraction of container width (60% more gap)
    const orbitRadiusYFactor = 0.10; // fraction of container height (60% more gap)

    // timing: hold center image, then transition to the next center
    const holdMs = 2500; // center stays still
    const transitionMs = 1000; // smooth move to next center
    const stepMs = holdMs + transitionMs; // per image step

    const getStateForCenter = (centerIndex, w, h) => {
      const cx = w / 2;
      // push the orbit a bit downward relative to container height
      const cy = h / 2 + h * 0.1; // ~6% down
      const rx = w * orbitRadiusXFactor;
      const ry = h * orbitRadiusYFactor;

      return chosenImages.map((_, i) => {
        const rel = (i - centerIndex + orbitCount) % orbitCount; // 0 is center
        if (rel === 0) {
          return {
            left: `${cx}px`,
            top: `${cy}px`,
            translateX: "-50%",
            translateY: "-50%",
            scale: 1.8,
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
            scale: 1.15,
            rotate: 0,
            zIndex: 600,
            opacity: 0.35,
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
            scale: 0.85,
            rotate: 0,
            zIndex: 200,
            opacity: 0.18,
            filter: "blur(1.2px) brightness(0.95)",
          };
        }
        // rel === 3 or any other -> left
        return {
          left: `${cx - rx}px`,
          top: `${cy}px`,
          translateX: "-50%",
          translateY: "-50%",
          scale: 1.15,
          rotate: 0,
          zIndex: 600,
          opacity: 0.35,
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
      if (phaseMs <= holdMs) {
        // hold
        newPos = stateA;
      } else {
        // transition
        const t = Math.min(1, (phaseMs - holdMs) / transitionMs);
        newPos = stateA.map((posA, i) => {
          const posB = stateB[i];
          const leftA = parseFloat(posA.left);
          const topA = parseFloat(posA.top);
          const leftB = parseFloat(posB.left);
          const topB = parseFloat(posB.top);
          return {
            left: `${lerp(leftA, leftB, t)}px`,
            top: `${lerp(topA, topB, t)}px`,
            translateX: "-50%",
            translateY: "-50%",
            scale: lerp(posA.scale, posB.scale, t),
            rotate: 0,
            zIndex: Math.round(lerp(posA.zIndex, posB.zIndex, t)),
            opacity: lerp(posA.opacity, posB.opacity, t),
            filter: t < 0.5 ? posA.filter : posB.filter,
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
    <div className="h-auto min-h-fit w-full bg-[#55acee] relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      {/* Top Image */}
      <img
        src="/assets/BG/page5_top.png"
        alt="img"
        className="absolute top-0 w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
      />

      {/* Content Container */}
      <div className="w-full max-w-[120x] mx-auto flex flex-col items-center justify-center   mt-12 sm:mt-32  ">
        {/* Text Image */}
        <img
          src="/assets/Icons/benefitlabel.svg"
          alt="img"
          className=" w-[80%] sm:w-[70%] md:w-[60%] max-w-[360px] sm:max-w-[520px] md:max-w-[680px] transition-all duration-300"
        />

        {/* Design Image with looping Lassi image overlay */}
        <div
          ref={containerRef}
          className=" relative w-[98%] md:w-[150%] max-w-[640px] md:max-w-[1000px] lg:max-w-[1000px] mx-auto h-[420px] md:h-[640px] lg:h-[720px]"
        >
          {/* background artwork */}
          <img
            src="/assets/Icons/p5-background-benefit.png"
            alt="img"
            className="w-full h-full object-contain transition-all duration-300 transform origin-center  md:scale-[1.2]"
          />

          {/* Orbiting images */}
          {chosenImages.map((src, i) => {
            const pos = positions[i] || {};
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
                  opacity: pos.opacity ?? 1,
                  filter: pos.filter || "none",
                  transition: "transform 120ms linear, filter 120ms linear, opacity 120ms linear",
                  pointerEvents: "none",
                }}
                aria-hidden
              >
                <OptimizedImage
                  src={src}
                  alt={`Lassi ${i}`}
                  width={undefined}
                  height={undefined}
                  className="block rounded-xl"
                  // limit rendered size; actual transform uses scale so base size controls max space
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    display: "block",
                    willChange: "transform, filter, opacity",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page5;
