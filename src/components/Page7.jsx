// Page7.jsx
import FullWidthMap from "../helperComponents/FullWidthMap";

const Page7 = () => {
  return (
    <div className="bg-[#d2eef9] py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col items-center gap-10">
        <div className="mt-28 text-center space-y-4">
          <h1 className="font-[Fredoka] text-[#285192] font-extrabold text-3xl md:text-5xl tracking-wider">
            Where to buy?
          </h1>
          <h3 className="font-[Fredoka] text-[#285192] text-2xl md:text-3xl tracking-wider">
            Find a store with our products near your home
          </h3>
        </div>
        {/* map goes here */}
        <FullWidthMap />
      </div>

      <img
        src="/assets/BG/page8_top.png"
        alt="decorative top"
        className="absolute top-0 w-full h-40 md:h-50 z-5"
      />
    </div>
  );
};

export default Page7;
