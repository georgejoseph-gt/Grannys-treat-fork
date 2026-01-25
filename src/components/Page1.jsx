import OptimizedImage from './OptimizedImage';
import { smoothScrollTo } from '../lib/scrollUtils';
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const Page1 = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToContact = () => {
    smoothScrollTo('contact-form', 50); // 80px offset for header height
  };

  const navbarData = ["Products", "Our Story", "Benefits", "Testimonials", "Contact Us"];

  const handleNavigation = (item) => {
    if (item === "Contact Us") {
      scrollToContact();
    } else {
      const sectionId = item.toLowerCase().replace(/\s+/g, '-');
      const offset = item === "Benefits"
        ? Math.round(window.innerHeight * -0.10)
        : item === "Testimonials"
          ? 80  // Position at top of testimonials section
          : 80;
      smoothScrollTo(sectionId, offset);
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.div
      ref={ref}
      className="relative h-screen md:h-[140vh] w-full bg-[url('/assets/bg1_mob.svg')] md:bg-[url('/assets/bg1.webp')] bg-cover bg-center bg-no-repeat bg-[#d2eef9]"
    >

      <div className="relative h-screen w-full overflow-hidden">
        <header className="absolute top-0 left-0 w-full z-[100] px-4 sm:px-6 md:px-10 font-[Fredoka] text-[#d2eef9]">
          <div className="max-w-full mx-auto w-full flex items-center justify-between">
            <div className="flex-shrink-0">
              <OptimizedImage
                src="/assets/Logo.svg"
                alt="logo"
                width={100}
                height={100}
                className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] md:w-[145px] md:h-[145px]"
                priority={true}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center ">
              <div></div>
            </nav>

            {/* Right Section: Desktop Contact & Mobile Hamburger */}
            <div className="flex items-center ">
              <div className="hidden md:block -mt-6">
                <a
                  href="#contact-form"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToContact();
                  }}
                  className="inline-block font-[Fredoka] text-[#285192] font-semibold text-[clamp(1rem,2vw,1.8rem)] cursor-pointer hover:scale-105 transition-transform duration-300 select-none "
                >
                  Contact Us
                </a>
              </div>

            </div>
          </div>
        </header>
        <div className='flex flex-col items-center justify-center h-full w-full gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24'>

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
          <motion.img
            src="/assets/BG/button.svg"
            alt="Let's Talk button"
            onClick={scrollToContact}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer hover:scale-105 transition-transform duration-300 mt-2 sm:mt-4 w-[140px] h-auto sm:w-[180px] md:w-[clamp(10rem,20vw,15rem)]"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[65] md:hidden"
              onClick={toggleMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="fixed top-20 left-4 right-4 z-[70] md:hidden"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Decorative top bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#285192] via-[#55acee] to-[#285192]"></div>

                {/* Menu items */}
                <div className="px-6 py-4">
                  {navbarData.map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleNavigation(item)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="w-full text-left py-4 px-4 rounded-2xl hover:bg-[#285192]/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-[Fredoka] text-[#285192] font-semibold text-lg group-hover:text-[#55acee] transition-colors duration-300">
                          {item}
                        </span>
                        <motion.div
                          className="w-2 h-2 rounded-full bg-[#285192] group-hover:bg-[#55acee] transition-colors duration-300"
                          whileHover={{ scale: 1.5 }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Bottom decorative element */}
                <div className="px-6 pb-4">
                  <div className="h-1 bg-gradient-to-r from-transparent via-[#285192]/30 to-transparent rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Background image with responsive handling */}
    </motion.div>
  );
};

export default Page1;
