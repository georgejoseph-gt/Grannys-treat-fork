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
    <div ref={sectionRef} id="contact-form" className="min-h-screen w-full bg-[#d2eef9] relative py-8 sm:py-12 md:pt-16">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <p className="font-[Fredoka] text-[#285192] font-extrabold text-center text-[clamp(1.5rem,4vw,3rem)] tracking-wider mb-8 sm:mb-12 md:mb-16">
          Drop us a message!
        </p>
        <ContactForm />
      </div>

      <motion.img
        src="/assets/p3/strawberry-group.png"
        alt="Decorative strawberry illustration"
        className="hidden sm:block sm:absolute w-[clamp(80px,22vw,285px)] h-auto aspect-square
        top-[10%] sm:top-[12%] md:top-[18%] lg:top-[30%] 
        left-[2%] sm:left-[6%] md:left-[10%] lg:-left-[5%]
         opacity-50 pointer-events-none select-none z-0"
        style={{ scale: leftScale }}
      />
      <motion.img
        src="/assets/p3/melisa-1.png"
        alt="Decorative strawberry illustration"
        className="hidden sm:block sm:absolute w-[clamp(80px,22vw,285px)] h-auto aspect-square
        top-[50%] sm:top-[12%] md:top-[18%] lg:top-[30%] 
        right-[2%] sm:right-[6%] md:right-[10%] lg:-right-[8%]
         opacity-50 pointer-events-none select-none z-0"
        style={{ scale: rightScale }}
      />
    </div>
  );
};

export default Page9;
