import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
const Page2 = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Smoothly map scroll progress (0 -> 1) to scale ranges
  const strawberryScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.8]);
  const blueberryScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.8]);
  const text = "At Granny's Treat, we craft probiotic-rich dairy that's as nourishing as it is delicious — your daily go-to for health, taste, and a dash of love in every bite. Welcome to a community that celebrates good food and even better living.";
  const words = text.split(" ");
  // Responsive group size
  const [groupSize, setGroupSize] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGroupSize(2);
      } else {
        setGroupSize(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const wordGroups = [];
  for (let i = 0; i < words.length; i += groupSize) {
    wordGroups.push(words.slice(i, i + groupSize));
  }
  return (
    <div ref={sectionRef} className="h-screen md:min-h-screen  w-full bg-[#d2eef9] relative overflow-hidden py-10 md:py-32">
      <div className="w-[95%] sm:w-[90%] md:w-[90%] h-full flex flex-col items-center justify-center mx-auto px-4 sm:px-6 md:px-8">

        {/* Main text content */}
        <h1 className="font-[Fredoka] text-[#285192] font-semibold text-center tracking-normal leading-relaxed text-2xl sm:text-3xl md:text-4xl lg:text-5xl  max-w-[95vw] sm:max-w-[80vw] md:max-w-[90vw]">
          {wordGroups.map((group, i) => {

            const startOffset = 0.2; // Start after 30% of scroll
            const animationDuration = 0.3; // Complete within 20% of scroll (30% to 50%)
            const startProgress = startOffset + (i / wordGroups.length) * animationDuration;
            const endProgress = startOffset + ((i + 1) / wordGroups.length) * animationDuration;

            // Create opacity and y transform based on scroll progress
            const opacity = useTransform(scrollYProgress,
              [startProgress, endProgress],
              [0, 1]
            );
            const y = useTransform(scrollYProgress,
              [startProgress, endProgress],
              [20, 0]
            );

            return (
              <motion.span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.5em",
                  opacity,
                  y
                }}
              >
                {group.join(" ")}
              </motion.span>
            );
          })}
        </h1>
      </div>

      <motion.img
        src="/assets/BG/strawberry_page2.svg"
        alt="Decorative strawberry illustration"
        style={{ scale: strawberryScale }}
        className="absolute w-[clamp(180px,22vw,285px)] h-auto aspect-square
        top-[20%] sm:top-[12%] md:top-[18%] lg:top-[22%] xl:top-[50px]
        left-[2%] sm:left-[6%] md:left-[10%] lg:left-[12%] xl:left-[186.63px]
         opacity-50 pointer-events-none select-none z-0"
      />

      <motion.img
        src="/assets/BG/blueberry_page2.svg"
        alt="Decorative blueberry illustration"
        style={{ scale: blueberryScale }}
        className="absolute w-[clamp(180px,28vw,375px)] h-auto aspect-square
        top-[5%] md:top-[42%] lg:top-[36%] xl:top-[220px]
        right-[2%] sm:right-[6%] md:right-[10%] lg:right-[12%] xl:right-[186.63px]
        -rotate-[26deg] pointer-events-none select-none hidden sm:block z-0"
      />
    </div>
  );
};

export default Page2;
