const Footer = () => {
  return (
    <div className="bg-[#d2eef9] p-8 pt-28" >
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between md:items-center">
        <div className="flex flex-col items-start md:items-center">
          <h3 className="text-3xl font-[Fredoka] font-bold text-[#285192] mb-4">
            Connect with us
          </h3>
          <div className="flex gap-4 mb-4">
            <a href="#">
              <img
                src="/assets/BG/insta.svg"
                alt="Instagram"
                className="h-14 w-14 sm:h-20 sm:w-20 "
              />
            </a>
            <a href="#">
              <img
                src="/assets/BG/whatsapp.svg"
                alt="Instagram"
                className="h-14 w-14 sm:h-20 sm:w-20"
              />
            </a>
            <a href="#">
              <img
                src="/assets/BG/facebook.svg"
                alt="Instagram"
                className="h-14 w-14 sm:h-20 sm:w-20"
              />
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/3 sm:text-center md:text-start space-y-4">
          <p className="text-base font-medium sm:text-xl font-[Fredoka] text-[#285192]">
            Plot No: 403, Phase - 2, Industrial Area, Scheme No:78, Part - 1, MR
            11, Dewas Naka, Niranjanpur, Indore, Madhya Pradesh 452010
          </p>

          <div className="flex sm:justify-center md:justify-start items-center gap-2">
            <img
              src="/assets/BG/phone.svg"
              alt="Phone"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <h1 className=" text-[#285192]  px-3 py-1 text-lg sm:text-base font-semibold">
              +91 7024221305
            </h1>
          </div>

          <div className="flex sm:justify-center md:justify-start items-center gap-2">
            <img
              src="/assets/BG/gmail.svg"
              alt="Email"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <h1 className=" text-[#285192]  px-3 py-1 text-lg sm:text-base font-semibold">
              info@grannystreat.in
            </h1>
          </div>
        </div>

      </div>

      <div className="text-center mt-12 font-[Fredoka] font-semibold  text-[#285192]">
        <p className="text-lg text-[#285192]">
          Copyright © 2025 Granny&apos;s Treat
        </p>
      </div>
    </div >
  );
};

export default Footer;
