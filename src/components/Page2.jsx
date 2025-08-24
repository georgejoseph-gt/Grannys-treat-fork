import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
const Page2 = () => {
  const [scrollDir, setScrollDir] = useState("down");
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      setScrollDir(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", updateScrollDir);
    return () => window.removeEventListener("scroll", updateScrollDir);
  }, []);
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
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25,
      }
    }
  };
  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, color: "#285192", transition: { duration: 0.6 } }
  };
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, margin: "-100px" });
  return (
    <div className="h-screen md:min-h-screen  w-full bg-[#d2eef9] relative overflow-hidden py-10 md:py-32">
      <div className="w-[95%] sm:w-[90%] md:w-[90%] h-full flex flex-col items-center justify-center mx-auto px-4 sm:px-6 md:px-8">

        {/* Main text content */}
        <motion.h1
          ref={headingRef}
          className="font-[Fredoka] text-[#285192] font-semibold text-center tracking-normal leading-relaxed text-2xl sm:text-3xl md:text-4xl lg:text-5xl  max-w-[95vw] sm:max-w-[80vw] md:max-w-[90vw]"
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {wordGroups.map((group, i) => (
            <motion.span
              key={i}
              variants={child}
              style={{ display: "inline-block", marginRight: "0.5em" }}
            >
              {group.join(" ")}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      <motion.img
        src="/assets/BG/strawberry_page2.svg"
        alt="Decorative strawberry illustration"
        animate={{ scale: scrollDir === "down" ? 1.1 : 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute w-[clamp(180px,22vw,285px)] h-auto aspect-square
        top-[20%] sm:top-[12%] md:top-[18%] lg:top-[22%] xl:top-[50px]
        left-[2%] sm:left-[6%] md:left-[10%] lg:left-[12%] xl:left-[186.63px]
         opacity-50 pointer-events-none select-none z-0"
      />

      <motion.img
        src="/assets/BG/blueberry_page2.svg"
        alt="Decorative blueberry illustration"
        animate={{ scale: scrollDir === "down" ? 1.05 : 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute w-[clamp(180px,28vw,375px)] h-auto aspect-square
        top-[5%] md:top-[42%] lg:top-[36%] xl:top-[220px]
        right-[2%] sm:right-[6%] md:right-[10%] lg:right-[12%] xl:right-[186.63px]
        -rotate-[26deg] pointer-events-none select-none hidden sm:block z-0"
      />
    </div>
  );
};

export default Page2;
