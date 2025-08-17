import { useEffect, useState } from "react";

const Page4 = () => {
  const images = [
    "/assets/page4/photo.png",
    "/assets/page4/img1.png",
    "/assets/page4/img2.png",
    "/assets/page4/img3.png",
    "/assets/page4/img4.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full bg-[#d1ebfd] py-16 px-4 sm:px-6 md:px-20 relative">
      <div className="w-full flex flex-col items-center">
        {/* Heading */}
        <h3
          className="font-[Fredoka] text-[#285192] font-extrabold text-center tracking-wider
          text-[clamp(1.75rem,5vw,3.5rem)] mt-10"
        >
          Our Journey to Healthier Dairy
        </h3>

        {/* Content Container */}
        <div className="w-full flex flex-col md:flex-row gap-10 md:gap-20 mt-10 items-center">
          {/* Left Image */}
          <div className="w-full sm:px-10 md:w-1/2 pt-10 md:pt-20 flex flex-col justify-center">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className=" md:h-[630px] h-auto object-cover transition-opacity duration-700 rounded-2xl"
            />
            <div className="flex space-x-2 mt-4 w-full justify-center ">
              {images.map((_, idx) => ( 
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 focus:outline-none ${
                    idx === currentIndex ? "bg-[#285192]" : "bg-[#cbdef3]"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 md:px-20 flex flex-col items-start gap-6">
            <img
              src="/assets/photo2.png"
              alt="Healthy Dairy"
              className="w-full  md:h-[300px] h-auto"
            />

            <p className="font-[Fredoka] text-[#285192] font-normal text-[clamp(1.5rem,2.5vw,1.8rem)]">
              At Granny&apos;s Treat, our story began with a simple truth —
              traditional dahi isn’t just delicious, it’s naturally rich in
              probiotics that support gut health and immunity.
              <br />
              Inspired by this, we set out to create dairy that’s fresh, pure,
              and free from antibiotics — because real nourishment should never
              come with compromises.
              <br />
              We keep things simple: high-quality milk, no shortcuts, and
              probiotic-rich products that support your health, your lifestyle,
              and your taste buds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page4;
