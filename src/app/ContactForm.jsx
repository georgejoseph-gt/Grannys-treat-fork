import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_jd0vxds';
const EMAILJS_TEMPLATE_ID = 'template_xmmsqjl';
const EMAILJS_PUBLIC_KEY = 'l6us1Y0pvG1gMFd7O';

// Toast Component - Top Right Position
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`z-[500000] fixed top-6 right-6 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] max-w-[400px] ${isSuccess
          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
          : 'bg-gradient-to-r from-red-400 to-rose-500'
        }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
        {isSuccess ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
      </div>

      {/* Message */}
      <p className="text-white font-bold text-sm sm:text-base font-[Fredoka] flex-1">
        {message}
      </p>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: 'linear' }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left rounded-b-2xl"
      />
    </motion.div>
  );
};

const ContactForm = () => {
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    topic: '',
    message: '',
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const closeToast = () => {
    setToast({ show: false, type: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_name || !formData.user_email || !formData.topic || !formData.message) {
      showToast('error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        showToast('success', "Message sent successfully! We'll get back to you soon.");
        setFormData({ user_name: '', user_email: '', topic: '', message: '' });
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      showToast('error', 'Failed to send message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification - Top Right */}
      {createPortal(
        <AnimatePresence>
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={closeToast}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="mx-auto max-w-3xl rounded-lg bg-[#d2eef9] p-4 sm:p-6 md:p-8 relative z-10">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name */}
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            placeholder="Your Name"
            disabled={isLoading}
            className="
              w-full
              rounded-2xl sm:rounded-3xl
              border-[3px] sm:border-[5px] md:border-[7px]
              border-[#55acee]
              p-3 sm:p-4 md:p-5
              text-base sm:text-lg md:text-xl
              text-[#285192] font-bold font-[Fredoka]
              placeholder:text-sm sm:placeholder:text-lg md:placeholder:text-2xl
              placeholder:font-semibold sm:placeholder:font-bold
              placeholder:text-white
              focus:outline-none
              focus:ring-1
              focus:ring-[#55acee]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          {/* Email */}
          <input
            type="email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            placeholder="Email Address"
            disabled={isLoading}
            className="
              w-full
              rounded-2xl sm:rounded-3xl
              border-[3px] sm:border-[5px] md:border-[7px]
              border-[#55acee]
              p-3 sm:p-4 md:p-5
              text-base sm:text-lg md:text-xl
              text-[#285192] font-bold font-[Fredoka]
              placeholder:text-sm sm:placeholder:text-lg md:placeholder:text-2xl
              placeholder:font-semibold sm:placeholder:font-bold
              placeholder:text-white
              focus:outline-none
              focus:ring-1
              focus:ring-[#55acee]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          {/* Topic */}
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Topic"
            disabled={isLoading}
            className="
              w-full
              rounded-2xl sm:rounded-3xl
              border-[3px] sm:border-[5px] md:border-[7px]
              border-[#55acee]
              p-3 sm:p-4 md:p-5
              text-base sm:text-lg md:text-xl
              text-[#285192] font-bold font-[Fredoka]
              placeholder:text-sm sm:placeholder:text-lg md:placeholder:text-2xl
              placeholder:font-semibold sm:placeholder:font-bold
              placeholder:text-white
              focus:outline-none
              focus:ring-1
              focus:ring-[#55acee]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          {/* Message */}
          <textarea
            rows={5}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message..."
            disabled={isLoading}
            className="
              w-full
              resize-none
              rounded-2xl sm:rounded-3xl
              border-[3px] sm:border-[5px] md:border-[7px]
              border-[#55acee]
              p-3 sm:p-4 md:p-5
              text-base sm:text-lg md:text-xl
              text-[#285192] font-bold font-[Fredoka]
              placeholder:text-sm sm:placeholder:text-lg md:placeholder:text-2xl
              placeholder:font-semibold sm:placeholder:font-bold
              placeholder:text-white
              focus:outline-none
              focus:ring-1
              focus:ring-[#55acee]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          {/* Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center pt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            animate={isLoading ? {} : { scale: [1, 1.05, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-[#285192] font-bold text-lg cursor-pointer">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </div>
            ) : (
              <img
                src="/assets/BG/button.svg"
                alt="send"
                className="w-32 sm:w-40 md:w-48 cursor-pointer"
              />
            )}
          </motion.button>
        </form>
      </div>
    </>
  );
};

export default ContactForm;
