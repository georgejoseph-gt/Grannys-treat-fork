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
    <div ref={sectionRef} id="contact-form" className="h-fit w-full bg-[#d2eef9] relative">
      <p className="font-[Fredoka] text-[#285192] font-extrabold text-center text-3xl md:text-5xl  tracking-wider">
        Drop us a message!
      </p>
      <ContactForm />

      <motion.img
        src="/assets/p3/strawberry-group.png"
        alt="Decorative strawberry illustration"
        className="absolute w-[clamp(80px,22vw,285px)] h-auto aspect-square
        top-[8%] sm:top-[12%] md:top-[18%] lg:top-[30%] 
        left-[2%] sm:left-[6%] md:left-[10%] lg:-left-[5%]
         opacity-50 pointer-events-none select-none z-0"
        style={{ scale: leftScale }}
      />
      <motion.img
        src="/assets/p3/melisa-1.png"
        alt="Decorative strawberry illustration"
        className="absolute w-[clamp(80px,22vw,285px)] h-auto aspect-square
        top-[8%] sm:top-[12%] md:top-[18%] lg:top-[30%] 
        right-[2%] sm:right-[6%] md:right-[10%] lg:-right-[8%]
         opacity-50 pointer-events-none select-none z-0"
        style={{ scale: rightScale }}
      />
    </div>
  );
};

export default Page9;
