"use client";
import { smoothScrollTo } from "../lib/scrollUtils";

const Header = () => {
  const navbarData = ["Products", "Our Story", "Benefits", "Testimonials"];

  const handleNavigation = (item) => {
    const sectionId = item.toLowerCase().replace(/\s+/g, '-');
    const offset = (item === "Testimonials" || item === "Benefits")
      ? Math.round(window.innerHeight * -0.10)
      : 80;
    smoothScrollTo(sectionId, offset);
  };

  return (
    <>
      {/* Spacer to prevent overlap from fixed header */}

      <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-10  font-[Fredoka] text-[#d2eef9]">
        <div className="max-w-full mx-auto w-full flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {/* <img
              alt="logo"
              className="w-[clamp(3rem,8vw,7.5rem)] h-auto"
            /> */}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center mt-5">
            <div className="flex gap-[clamp(4rem,2vw,5rem)] px-20 py-2 bg-[#285192] rounded-full ">
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
          <div className="flex items-center">
            {/* Desktop "Contact Us" text */}
            <div className="hidden md:block">{/* Optional content */}</div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <button aria-label="Open menu">
                <svg
                  className="w-6 h-6 text-[#285192]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
