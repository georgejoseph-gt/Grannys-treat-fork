import { useEffect, useRef, useState } from 'react';
import { stories } from '../lib/testimonialData';
import { PlayIcon, X } from 'lucide-react';

const TestimonialCard = ({ story, onClick, isDragging, priority = false, isNearViewport = false }) => {
  const videoRef = useRef(null);
  const hasLoadedRef = useRef(priority); // Track if video has ever been loaded (persists across re-renders)
  const [shouldLoad, setShouldLoad] = useState(priority); 
  const [isInView, setIsInView] = useState(priority); // Assume priority videos are initially in view

  useEffect(() => {
    if (priority || isNearViewport) {
      // Mark as should load if near viewport
      if (isNearViewport && !hasLoadedRef.current) {
        hasLoadedRef.current = true;
        setShouldLoad(true);
      }
      
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'video';
      link.href = story.preview;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, isNearViewport, story.preview]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldLoad || priority || hasLoadedRef.current) {
      // Mark as loaded if we're loading it
      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
      }
      video.load();
      // For priority videos, try to play immediately once they have enough data
      if (priority) {
        const tryPlay = () => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA - enough data to start playing
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          }
        };
        
        // Try immediately if already loaded
        tryPlay();
        
        // Also listen for loadeddata (fires earlier than canplay)
        video.addEventListener('loadeddata', tryPlay, { once: true });
        return () => video.removeEventListener('loadeddata', tryPlay);
      }
    }
  }, [shouldLoad, priority]);

  // Auto-play video when it's loaded and in view (using loadeddata for faster response)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const tryPlay = () => {
      if (isInView && video.readyState >= 2) { // HAVE_CURRENT_DATA
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    };

    // Use loadeddata (fires earlier) and canplay (more reliable)
    video.addEventListener('loadeddata', tryPlay, { once: true });
    video.addEventListener('canplay', tryPlay, { once: true });
    
    // If video is already loaded, try immediately
    if (video.readyState >= 2 && isInView) {
      tryPlay();
    }

    return () => {
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
    };
  }, [shouldLoad, isInView]);

  // Use intersection observer with larger margin to load videos earlier
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsInView(intersecting);
        
        if (intersecting) {
          // Start loading immediately when near viewport - mark as loaded permanently
          if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            setShouldLoad(true);
          }
          // Auto-play video when it enters viewport (if it has enough data)
          if (video.readyState >= 2) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          }
        } else {
          // Pause video when it leaves viewport (but keep it loaded)
          video.pause();
        }
      },
      { 
        threshold: 0.01,
        rootMargin: '400px' // Start loading 400px before video enters viewport
      }
    );

    observer.observe(video);
    
    // For priority videos, check immediately if they're in view
    if (priority) {
      const rect = video.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 400 && rect.bottom > -400;
      if (isVisible && !isInView) {
        setIsInView(true);
      }
    }
    
    return () => observer.disconnect();
  }, [shouldLoad, priority, isInView]);

  const handleClick = () => {
    if (!isDragging.current) onClick(story);
  };

  return (
    <div
      onClick={handleClick}
      className="snap-center shrink-0 w-[240px] sm:w-[260px] md:w-[320px]
                 aspect-[9/16] rounded-xl overflow-hidden bg-black relative
                 cursor-pointer select-none transition-transform duration-300
                 transform hover:scale-105 mt-20"
    >
      <video
        ref={videoRef}
        src={hasLoadedRef.current || shouldLoad || priority ? story.preview : undefined}
        muted
        loop
        playsInline
        autoPlay
        preload={priority ? "auto" : hasLoadedRef.current || isInView ? "metadata" : "none"}
        poster={story.poster || undefined}
        className="h-full w-full object-cover"
      />

      {/* Username */}
      {/* <div className="absolute bottom-3 left-3 z-10 rounded-full
                      bg-white/90 px-3 py-1 text-xs font-semibold
                      text-gray-800 shadow backdrop-blur-sm">
        {story.user}
      </div> */}

      {/* Play Button */}
      {/* <div className="absolute inset-0 z-10 flex items-center
                      justify-center pointer-events-none">
        <div className="flex h-12 w-12 items-center justify-center
                        rounded-full bg-white/90 shadow-lg
                        backdrop-blur-sm transition-all duration-300
                        transform hover:scale-110 hover:bg-white/100
                        pointer-events-auto">
          <PlayIcon className="h-5 w-5 text-gray-900 translate-x-[1px]" />
        </div>
      </div> */}
    </div>
  );
};

/* -------------------- Main -------------------- */
const Testimonial = () => {
  const [activeStory, setActiveStory] = useState(null);
  const [visibleIndices, setVisibleIndices] = useState(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));

  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);

  // Preload first 10 videos immediately on mount
  useEffect(() => {
    stories.slice(0, 10).forEach((story) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'video';
      link.href = story.preview;
      document.head.appendChild(link);
    });
  }, []);

  // Track visible videos and preload adjacent ones
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updateVisibleVideos = () => {
      const rect = slider.getBoundingClientRect();
      const newVisible = new Set();
      
      stories.forEach((story, index) => {
        const card = slider.querySelector(`[data-story-id="${story.id}"]`);
        if (card) {
          const cardRect = card.getBoundingClientRect();
          // Consider visible if within 500px of viewport
          if (cardRect.right >= rect.left - 500 && cardRect.left <= rect.right + 500) {
            newVisible.add(index);
            // Also preload adjacent videos
            if (index > 0) newVisible.add(index - 1);
            if (index < stories.length - 1) newVisible.add(index + 1);
          }
        }
      });
      
      setVisibleIndices(newVisible);
    };

    updateVisibleVideos();
    slider.addEventListener('scroll', updateVisibleVideos, { passive: true });
    window.addEventListener('resize', updateVisibleVideos);
    
    return () => {
      slider.removeEventListener('scroll', updateVisibleVideos);
      window.removeEventListener('resize', updateVisibleVideos);
    };
  }, []);

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
        loading="lazy"
        decoding="async"
      />

      <img
        src="/assets/p3/leaf-3.png"
        alt="Decorative strawberry illustration"
        className="absolute w-[clamp(60px,25vw,350px)] h-auto aspect-square
      top-[8%] sm:top-[12%] md:top-[27%]  
      right-[2%] sm:right-[6%] md:right-[10%] lg:right-[0]
       opacity-30 pointer-events-none select-none z-0"
        loading="lazy"
        decoding="async"
      />

      <img
        src="/assets/p3/leaf-3.png"
        alt="Decorative strawberry illustration"
        className="absolute w-[clamp(80px,25vw,250px)] h-auto aspect-square
      top-[15%] sm:top-[12%] md:top-[20%]  
      left-[2%] sm:left-[6%] md:left-[10%] lg:left-[4%]
       opacity-30 pointer-events-none select-none z-0 rotate-30"
        loading="lazy"
        decoding="async"
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
            <div key={story.id} data-story-id={story.id}>
              <TestimonialCard
                story={story}
                onClick={openModal}
                isDragging={isDragging}
                priority={index < 10} // Prioritize first 10 videos for immediate loading
                isNearViewport={visibleIndices.has(index)}
              />
            </div>
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
              playsInline
              preload="auto"
              autoPlay
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonial;
