import VideoSlider from "../app/Videos/VideoSlider";

const Page6 = () => {
  return (
    <div className="h-[140vh] w-full  bg-[#d0ebff] relative">
      <div className="w-full flex mb-32 gap-10 z-20 justify-center items-center flex-col ">
        <img
          src="/assets/BG/Vector.png"
          alt="img"
          className="absolute -top-20 h-40 w-full md:h-60 lg:h-80"
        />


        <h3 className="font-[Fredoka] z-10 text-[#285192] font-[800] text-center mt-56 text-3xl md:text-4xl lg:text-5xl tracking-wider">
          The real stories
        </h3>
        <VideoSlider />
      </div>

      <img
        src="/assets/p3/strawberry.png"
        alt="Decorative strawberry illustration"
        className="absolute w-[clamp(80px,15vw,205px)] h-auto aspect-square
        top-[8%] sm:top-[12%] md:top-[15%]  
        left-[2%] sm:left-[6%] md:left-[35%] lg:left-[52%]
         opacity-25 pointer-events-none select-none z-0 rotate-40"
      />

      <img
        src="/assets/p3/leaf-3.png"
        alt="Decorative strawberry illustration"
        className="absolute w-[clamp(60px,25vw,350px)] h-auto aspect-square
      top-[8%] sm:top-[12%] md:top-[27%]  
      right-[2%] sm:right-[6%] md:right-[10%] lg:right-[0]
       opacity-30 pointer-events-none select-none z-0"
      />

      <img
        src="/assets/p3/leaf-3.png"
        alt="Decorative strawberry illustration"
        className="absolute w-[clamp(80px,25vw,250px)] h-auto aspect-square
      top-[8%] sm:top-[12%] md:top-[20%]  
      left-[2%] sm:left-[6%] md:left-[10%] lg:left-[4%]
       opacity-30 pointer-events-none select-none z-0 rotate-30"

      />
    </div>
  );
};

export default Page6;
