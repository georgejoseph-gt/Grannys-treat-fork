import ContactForm from "../app/ContactForm";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Page9 = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to subtle scaling
  const leftScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.65]);
  const rightScale = useTransform(scrollYProgress, [0, 1], [0.5, 1.65]);

  return (
    <div ref={sectionRef} id="contact-form" className="w-full bg-[#d2eef9] relative overflow-hidden py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-20">
        <p className="font-[Fredoka] text-[#285192] font-extrabold text-center text-[clamp(1.5rem,4vw,3rem)] tracking-wider mb-2 sm:mb-2 md:mb-0">
          Drop us a message!
        </p>
        <ContactForm />
      </div>

      {/* Left decorative image - positioned behind form */}
      <motion.img
        src="/assets/p3/strawberry-group.png"
        alt="Decorative strawberry illustration"
        className="hidden sm:block absolute w-[clamp(60px,15vw,285px)] sm:w-[clamp(80px,20vw,285px)] md:w-[clamp(100px,22vw,285px)] h-auto aspect-square
        top-[15%] sm:top-[12%] md:top-[18%] lg:top-[30%] 
        left-[-8%] sm:left-[-5%] md:left-[2%] lg:left-[6%] xl:-left-[5%]
        opacity-30 sm:opacity-40 md:opacity-50 pointer-events-none select-none z-0"
        style={{ scale: leftScale }}
        loading="lazy"
        decoding="async"
      />
      
      {/* Right decorative image - positioned behind form */}
      <motion.img
        src="/assets/p3/melisa-1.png"
        alt="Decorative melisa illustration"
        className="hidden sm:block absolute w-[clamp(60px,15vw,285px)] sm:w-[clamp(80px,20vw,285px)] md:w-[clamp(100px,22vw,285px)] h-auto aspect-square
        top-[15%] sm:top-[12%] md:top-[18%] lg:top-[30%] 
        right-[-8%] sm:right-[-5%] md:right-[2%] lg:right-[6%] xl:-right-[8%]
        opacity-30 sm:opacity-40 md:opacity-50 pointer-events-none select-none z-0"
        style={{ scale: rightScale }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default Page9;
