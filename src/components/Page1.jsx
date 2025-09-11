import OptimizedImage from './OptimizedImage';
import { smoothScrollTo } from '../lib/scrollUtils';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Page1 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  const scrollToContact = () => {
    smoothScrollTo('contact-form', 50); // 80px offset for header height
  };

  return (
    <motion.div
      ref={ref}
      className="relative h-screen md:h-[140vh] w-full bg-[url('/assets/bg1_mob.svg')] md:bg-[url('/assets/bg1.webp')] bg-cover bg-center bg-no-repeat bg-[#d2eef9]"
    >

      {/* Main content container with responsive padding */}
      <div className="relative h-screen  w-full ">
        <header className="relative w-screen z-[60] bg-transparent px-4 sm:px-6 md:px-10">
          <div className="max-w-full mx-auto w-full flex items-center justify-between ">
            {/* Logo */}
            <div className="flex-shrink-0 ">
              <OptimizedImage
                src="/assets/Logo.svg"
                alt="logo"
                width={125}
                height={125}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center">
              <div></div>
            </nav>

            {/* Right Section: Desktop Contact & Mobile Hamburger */}
            <div className="flex items-center">
              <div className="hidden md:block">
                <a
                  href="#contact-form"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToContact();
                  }}
                  className="inline-block font-[Fredoka] text-[#285192] font-semibold text-[clamp(1rem,2vw,1.8rem)] cursor-pointer hover:scale-105 transition-transform duration-300 select-none"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </header>
        <div className='flex flex-col items-center justify-center  h-full gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:px-8 '>

          {/* Heading with responsive text sizes */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-[Fredoka] text-[#285192] font-[700] text-center text-[clamp(2.3rem,5vw,5rem)] leading-tight max-w-[90%] sm:max-w-[80%] md:max-w-[70%] xl:max-w-[60%]"
          >
            TASTES LIKE HOME
          </motion.h1>

          {/* Subheading with responsive text sizes */}
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-[Fredoka] text-[#285192] font-semibold text-center  text-[clamp(1.2rem,2vw,2rem)] leading-snug max-w-[90%] sm:max-w-[80%] md:max-w-[70%] xl:max-w-[60%]"
          >
            Quality That Brings Homemade Goodness to Your Table
          </motion.h3>
          <motion.button 
            onClick={scrollToContact}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer hover:scale-105   transition-transform duration-300"
          >
            <OptimizedImage
              src="/assets/BG/button.svg"
              alt="Let's Talk button"
              width={240}
              height={80}
              className="w-[clamp(10rem,20vw,15rem)] h-auto mt-4"
            />
          </motion.button>
        </div>
      </div>
      {/* Background image with responsive handling */}
    </motion.div>
  );
};

export default Page1;
