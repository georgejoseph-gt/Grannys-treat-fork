/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const AnimatedWordGroup = ({ text, index, total, scrollYProgress }) => {
  const start = 0.1 + (index / total) * 0.5;
  const end = start + 0.12;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [24, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-2 "
    >
      {text}
    </motion.span>
  );
};

const Page2 = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 30%"],
  });

  const strawberryScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.15]);
  const blueberryScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.2]);

  const text =
    "At Granny's Treat, we craft probiotic-rich dairy that's as nourishing as it is delicious — your daily go-to for health, taste, and a dash of love in every bite. Welcome to a community that celebrates good food and even better living.";

  const words = text.split(" ");

  const [groupSize, setGroupSize] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setGroupSize(mobile ? 2 : 3);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const wordGroups = [];
  for (let i = 0; i < words.length; i += groupSize) {
    wordGroups.push(words.slice(i, i + groupSize).join(" "));
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#d2eef9] overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-32 sm:pt-32 sm:pb-40">
        <h1 className="font-[Fredoka] text-[#285192] font-semibold leading-relaxed text-center
          text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] max-w-7xl mx-auto"
        >
          {isMobile
            ? wordGroups.map((g, i) => (
                <span key={i} className="mr-2 inline-block">
                  {g}
                </span>
              ))
            : wordGroups.map((g, i) => (
                <AnimatedWordGroup
                  key={i}
                  text={g}
                  index={i}
                  total={wordGroups.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
        </h1>
      </div>

      {/* Strawberry */}
      <motion.img
        src="/assets/BG/strawberry_page2.svg"
        alt=""
        style={{ scale: strawberryScale }}
        className="
          absolute
          w-[140px] sm:w-[180px] md:w-[220px]
          top-10 sm:top-16
          left-2 sm:left-8
          opacity-40
          pointer-events-none
          select-none
        "
        loading="lazy"
        decoding="async"
      />

      {/* Blueberry */}
      <motion.img
        src="/assets/BG/blueberry_page2.svg"
        alt=""
        style={{ scale: blueberryScale }}
        className="
          absolute
          w-[160px] sm:w-[220px] md:w-[280px]
          bottom-10 sm:bottom-20
          right-2 sm:right-8
          -rotate-12
          opacity-40
          pointer-events-none
          select-none
          hidden sm:block
        "
        loading="lazy"
        decoding="async"
      />
    </section>
  );
};

export default Page2;
