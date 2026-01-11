import { useEffect, useRef, useState } from 'react';
import { stories } from '../lib/testimonialData';
import { PlayIcon, X } from 'lucide-react';

const TestimonialCard = ({ story, onClick, isDragging, priority = false }) => {
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(priority); // Priority videos load immediately

  // Start loading video immediately on mount (especially for priority videos)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force immediate loading for faster buffering
    if (shouldLoad || priority) {
      video.load();
    }
  }, [shouldLoad, priority]);

  // Use intersection observer with rootMargin to start loading BEFORE video is visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start loading if not already loaded
          if (!shouldLoad) {
            setShouldLoad(true);
            video.load();
          }
          // Play when visible
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      },
      { 
        threshold: 0.01, // Very low threshold for faster detection
        rootMargin: '300px' // Start loading 300px before video enters viewport
      }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const handleClick = () => {
    if (!isDragging.current) onClick(story);
  };

  return (
    <div
      onClick={handleClick}
      className="snap-center shrink-0 w-[240px] sm:w-[260px] md:w-[320px]
                 aspect-[9/16] rounded-xl overflow-hidden bg-black relative
                 cursor-pointer select-none transition-transform duration-300
                 transform hover:scale-105"
    >
      <video
        ref={videoRef}
        src={story.preview}
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />

      {/* Username */}
      {/* <div className="absolute bottom-3 left-3 z-10 rounded-full
                      bg-white/90 px-3 py-1 text-xs font-semibold
                      text-gray-800 shadow backdrop-blur-sm">
        {story.user}
      </div> */}

      {/* Play Button */}
      <div className="absolute inset-0 z-10 flex items-center
                      justify-center pointer-events-none">
        <div className="flex h-12 w-12 items-center justify-center
                        rounded-full bg-white/90 shadow-lg
                        backdrop-blur-sm transition-all duration-300
                        transform hover:scale-110 hover:bg-white/100
                        pointer-events-auto">
          <PlayIcon className="h-5 w-5 text-gray-900 translate-x-[1px]" />
        </div>
      </div>
    </div>
  );
};

/* -------------------- Main -------------------- */
const Testimonial = () => {
  const [activeStory, setActiveStory] = useState(null);

  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);

  /* -------- Smooth drag with inertia -------- */
  const onMouseDown = (e) => {
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX;
    scrollLeft.current = sliderRef.current.scrollLeft;
    velocity.current = 0;
  };

  const onMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();

    const dx = e.pageX - startX.current;
    isDragging.current = Math.abs(dx) > 5;
    velocity.current = dx * 0.12;
    sliderRef.current.scrollLeft = scrollLeft.current - dx;
  };

  const onMouseUp = () => {
    isDown.current = false;

    const momentum = () => {
      if (Math.abs(velocity.current) < 0.5) return;
      sliderRef.current.scrollLeft -= velocity.current;
      velocity.current *= 0.95;
      requestAnimationFrame(momentum);
    };

    requestAnimationFrame(momentum);
  };

  const onMouseLeave = () => {
    if (isDown.current) onMouseUp();
  };

  /* -------- Modal controls -------- */
  const openModal = (story) => {
    document.body.style.overflow = 'hidden';
    setActiveStory(story);
  };

  const closeModal = () => {
    document.body.style.overflow = '';
    setActiveStory(null);
  };

  /* -------- Close modal on scroll / ESC -------- */
  useEffect(() => {
    if (!activeStory) return;

    const close = () => closeModal();

    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };

    window.addEventListener('wheel', close, { passive: true });
    window.addEventListener('touchmove', close, { passive: true });
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('wheel', close);
      window.removeEventListener('touchmove', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [activeStory]);

  return (
    <section className="relative w-full bg-[#d0ebff] py-36 md:py-20 lg:py-24 overflow-hidden">
      <img
        src="/assets/p3/strawberry.png"
        alt="Decorative strawberry illustration"
        className="absolute w-[clamp(80px,15vw,205px)] h-auto aspect-square
        top-[18%] sm:top-[12%] md:top-[15%]  
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
      top-[15%] sm:top-[12%] md:top-[20%]  
      left-[2%] sm:left-[6%] md:left-[10%] lg:left-[4%]
       opacity-30 pointer-events-none select-none z-0 rotate-30"

      />
      <div className="mx-auto w-[95%] sm:w-[85%] px-4">
        <h2 className="mb-16 text-center text-[clamp(1.5rem,4vw,4rem)]
                       font-semibold font-[Fredoka] text-[#285192]">
          The real stories
        </h2>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory
                     pb-4 scrollbar-hide cursor-grab"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          {stories.map((story, index) => (
            <TestimonialCard
              key={story.id}
              story={story}
              onClick={openModal}
              isDragging={isDragging}
              priority={index < 6} // Prioritize first 6 videos for immediate loading
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center
                     justify-center bg-black/70 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[420px]
                       aspect-[9/16] bg-black rounded-xl
                       overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 cursor-pointer
                         text-white hover:bg-white
                         hover:text-black rounded-md p-1
                         "
            >
              <X size={22} />
            </button>

            <video
              src={activeStory.full}
              controls
              autoPlay
              playsInline
              preload="none"
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonial;
