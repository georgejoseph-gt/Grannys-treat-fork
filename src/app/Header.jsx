"use client";
import { smoothScrollTo } from "../lib/scrollUtils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const navbarData = ["Products", "Our Story", "Benefits", "Testimonials"];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom per-section offsets (edit these values as needed)
  const customOffsets = {
    'products': 65,
    'our-story': 0,
    'benefits': -120,
    'testimonials': 0  // Changed from -100 to 80 to position at top of section
  };

  const handleNavigation = (item) => {
    const sectionId = item.toLowerCase().replace(/\s+/g, '-');
    const offset = customOffsets[sectionId] !== undefined
      ? customOffsets[sectionId]
      : ((item === "Testimonials" || item === "Benefits")
        ? Math.round(window.innerHeight * -0.10)
        : 80);
    smoothScrollTo(sectionId, offset);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Spacer to prevent overlap from fixed header */}

      <header className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-6 md:px-10  font-[Fredoka] text-[#d2eef9]">
        <div className="max-w-full mx-auto w-full flex items-center justify-between   ">
          {/* Logo */}
          <div className="flex-shrink-0">
            {/* <img
              alt="logo"
              className="w-[clamp(3rem,8vw,7.5rem)] h-auto"
            /> */}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center mt-6">
            <div className="flex gap-[clamp(4rem,2vw,5rem)] px-20 py-3 bg-[#285192] rounded-full ">
              {navbarData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item)}
                  className="text-white text-[clamp(0.9rem,1.5vw,1.4rem)] px-5 py-1 hover:underline transition cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>

          {/* Right Section: Desktop Contact & Mobile Hamburger */}
          <div className="flex items-center ">
            {/* Desktop "Contact Us" text */}
            <div className="hidden md:block">{/* Optional content */}</div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden relative z-[101]">
              <motion.button 
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className="relative p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300"
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6 relative flex items-center justify-center">
                  <motion.span
                    className="absolute w-5 h-0.5 bg-[#285192] rounded-full"
                    variants={{
                      closed: { rotate: 0, y: -6 },
                      open: { rotate: 45, y: 0 }
                    }}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="absolute w-5 h-0.5 bg-[#285192] rounded-full"
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 }
                    }}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="absolute w-5 h-0.5 bg-[#285192] rounded-full"
                    variants={{
                      closed: { rotate: 0, y: 6 },
                      open: { rotate: -45, y: 0 }
                    }}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
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
              className="fixed top-20 left-4 right-4 z-[100] md:hidden"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Decorative elements */}
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
    </>
  );
};

export default Header;
