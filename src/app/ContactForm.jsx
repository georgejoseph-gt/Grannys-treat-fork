import { motion } from 'framer-motion';

const ContactForm = () => {
  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-[#d2eef9] p-4 sm:p-6 md:p-8 relative z-10">
      <form className="space-y-4 sm:space-y-5">
        {/* Name */}
        <input
          type="text"
          placeholder="Your Name"
          className="
            w-full
            rounded-2xl sm:rounded-3xl
            border-[3px] sm:border-[5px] md:border-[7px]
            border-[#55acee]
            p-3 sm:p-4 md:p-5
            text-sm sm:text-base md:text-lg
            placeholder:text-sm sm:placeholder:text-lg md:placeholder:text-2xl
            placeholder:font-semibold sm:placeholder:font-bold
            placeholder:text-white
            focus:outline-none
            focus:ring-1
            focus:ring-[#55acee]
          "
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="
            w-full
            rounded-2xl sm:rounded-3xl
            border-[3px] sm:border-[5px] md:border-[7px]
            border-[#55acee]
            p-3 sm:p-4 md:p-5
            text-sm sm:text-base md:text-lg
            placeholder:text-sm sm:placeholder:text-lg md:placeholder:text-2xl
            placeholder:font-semibold sm:placeholder:font-bold
            placeholder:text-white
            focus:outline-none
            focus:ring-1
            focus:ring-[#55acee]
          "
        />

        {/* Topic */}
        <input
          type="text"
          placeholder="Topic"
          className="
            w-full
            rounded-2xl sm:rounded-3xl
            border-[3px] sm:border-[5px] md:border-[7px]
            border-[#55acee]
            p-3 sm:p-4 md:p-5
            text-sm sm:text-base md:text-lg
            placeholder:text-sm sm:placeholder:text-lg md:placeholder:text-2xl
            placeholder:font-semibold sm:placeholder:font-bold
            placeholder:text-white
            focus:outline-none
            focus:ring-1
            focus:ring-[#55acee]
          "
        />

        {/* Message */}
        <textarea
          rows={5}
          placeholder="Your Message..."
          className="
            w-full
            resize-none
            rounded-2xl sm:rounded-3xl
            border-[3px] sm:border-[5px] md:border-[7px]
            border-[#55acee]
            p-3 sm:p-4 md:p-5
            text-sm sm:text-base md:text-lg
            placeholder:text-sm sm:placeholder:text-lg md:placeholder:text-2xl
            placeholder:font-semibold sm:placeholder:font-bold
            placeholder:text-white
            focus:outline-none
            focus:ring-1
            focus:ring-[#55acee]
          "
        />

        {/* Button */}
        <motion.button
          type="submit"
          className="flex w-full justify-center pt-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src="/assets/BG/button.svg"
            alt="send"
            className="w-32 sm:w-40 md:w-48"
          />
        </motion.button>
      </form>
    </div>
  );
};

export default ContactForm;
