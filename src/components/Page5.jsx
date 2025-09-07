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

  // animation loop
  useEffect(() => {
    // respect user's reduce-motion preference
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    const duration = 10000; // ms per full orbit (slower)
    const orbitRadiusXFactor = 0.15; // fraction of container width (smaller orbit)
    const orbitRadiusYFactor = 0.08; // fraction of container height (smaller flattened ellipse)
    const imageRadius = 40; // approx radius used for rolling calc — not critical

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = (elapsed % duration) / duration; // 0..1
      const baseAngle = t * Math.PI * 2; // 0..2PI

      const { w, h } = sizeRef.current;
      const cx = w / 2;
      const cy = h / 2;

      const rx = w * orbitRadiusXFactor;
      const ry = h * orbitRadiusYFactor;

      const newPos = chosenImages.map((src, i) => {
        // evenly space items around the circle
        const angle = baseAngle + (i * (Math.PI * 2)) / orbitCount;

        // elliptical orbit coordinates
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);

        // depth metric - front when sin(angle) is near +1 (top of ellipse) => adjust to desired orientation
        // We want front when the item is near center (y approx cy) and moving left->right visually.
        // Using sin(angle) provides a smooth phase: -1 .. 1 => map to 0..1
        const depth = (Math.sin(angle) + 1) / 2;

        // scale between min and max based on depth - center cup much larger
        const scale = 0.70 + depth * 1.3; // range ~0.70 .. 1.30 (center cup 30% larger)

        // no rotation - keep cups upright while orbiting
        const rotationDeg = 0; // cups stay upright

        // opacity + blur for dramatic depth effect - very low when behind, full when in front
        const opacity = 0.04 + depth * 0.85; // 0.15 .. 1.0 (much more dramatic depth)
        const blurPx = Math.max(0, (0.8 - depth) * 2.5); // blur when depth small

        return {
          left: `${x}px`,
          top: `${y}px`,
          translateX: "-50%", // to center images at their position
          translateY: "-50%",
          scale,
          rotate: rotationDeg,
          zIndex: Math.round(depth * 100), // higher depth -> higher zIndex
          opacity,
          filter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
        };
      });

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
    <div className="h-auto min-h-screen w-full bg-[#55acee] relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      {/* Top Image */}
      <img
        src="/assets/BG/page5_top.png"
        alt="img"
        className="absolute top-0 w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
      />

      {/* Content Container */}
      <div className="w-full max-w-[120x] mx-auto flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-32 ">
        {/* Text Image */}
        <img
          src="/assets/Icons/benefitlabel.svg"
          alt="img"
          className="w-[90%] sm:w-[85%] md:w-[80%] max-w-[400px] sm:max-w-[600px] md:max-w-[800px] transition-all duration-300"
        />

        {/* Design Image with looping Lassi image overlay */}
        <div
          ref={containerRef}
          className="relative w-[98%] md:w-[150%] max-w-[640px] md:max-w-[1000px] lg:max-w-[1000px] mx-auto h-[420px] md:h-[640px] lg:h-[720px]"
        >
          {/* background artwork */}
          <img
            src="/assets/Icons/p5-b.png"
            alt="img"
            className="w-full h-full object-contain transition-all duration-300 "
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
                    width: 160,
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
