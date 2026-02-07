import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { stories } from '../lib/testimonialData';
import { X } from 'lucide-react';

// Global video loading queue to prevent bandwidth saturation
const loadingQueue = {
  queue: [],
  activeLoads: 0,
  maxConcurrent: 3, // Only load 3 videos at a time

  add(callback, priority = false) {
    if (priority) {
      this.queue.unshift(callback);
    } else {
      this.queue.push(callback);
    }
    this.process();
  },

  process() {
    while (this.activeLoads < this.maxConcurrent && this.queue.length > 0) {
      const callback = this.queue.shift();
      this.activeLoads++;
      callback(() => {
        this.activeLoads--;
        this.process();
      });
    }
  }
};

// Detect slow connection
const getConnectionSpeed = () => {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') return 'slow';
    if (conn.effectiveType === '3g') return 'medium';
  }
  return 'fast';
};

const TestimonialCard = ({ story, onClick, isDragging, priority = false, queuePosition = 999 }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [videoState, setVideoState] = useState('idle'); // idle, loading, loaded, playing
  const [isInView, setIsInView] = useState(false);
  const loadStartedRef = useRef(false);
  const connectionSpeed = useMemo(() => getConnectionSpeed(), []);

  // Determine if this video should auto-load
  const shouldAutoLoad = priority || queuePosition < 4;

  // Load video through queue system
  const loadVideo = useCallback((immediate = false) => {
    if (loadStartedRef.current || !videoRef.current) return;

    const video = videoRef.current;

    const doLoad = (done) => {
      loadStartedRef.current = true;
      setVideoState('loading');

      video.src = story.preview;
      video.load();

      const onLoaded = () => {
        setVideoState('loaded');
        done?.();
        video.removeEventListener('loadeddata', onLoaded);
      };

      video.addEventListener('loadeddata', onLoaded);

      // Timeout fallback
      setTimeout(() => {
        if (videoState === 'loading') {
          done?.();
        }
      }, 5000);
    };

    if (immediate) {
      doLoad(() => { });
    } else {
      loadingQueue.add(doLoad, priority);
    }
  }, [story.preview, priority, videoState]);

  // Handle intersection observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsInView(intersecting);

        if (intersecting && !loadStartedRef.current) {
          loadVideo(priority);
        }
      },
      {
        threshold: 0.01,
        rootMargin: connectionSpeed === 'slow' ? '100px' : '300px'
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [loadVideo, priority, connectionSpeed]);

  // Auto-load priority videos immediately
  useEffect(() => {
    if (shouldAutoLoad && !loadStartedRef.current) {
      // Stagger loading based on queue position
      const delay = queuePosition * 100;
      const timer = setTimeout(() => loadVideo(true), delay);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoLoad, queuePosition, loadVideo]);

  // Play/pause based on visibility and load state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoState !== 'loaded') return;

    if (isInView) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoState('playing'))
          .catch(() => { });
      }
    } else {
      video.pause();
      if (videoState === 'playing') {
        setVideoState('loaded');
      }
    }
  }, [isInView, videoState]);

  const handleClick = () => {
    if (!isDragging.current) onClick(story);
  };

  // Generate a placeholder gradient based on story id for visual variety
  const placeholderGradient = useMemo(() => {
    const hue = (story.id * 47) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 85%) 0%, hsl(${(hue + 40) % 360}, 60%, 75%) 100%)`;
  }, [story.id]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="snap-center shrink-0 w-[240px] sm:w-[260px] md:w-[320px]
                 aspect-[9/16] rounded-xl overflow-hidden relative
                 cursor-pointer select-none transition-transform duration-300
                 transform hover:scale-105 mt-16"
      style={{ background: placeholderGradient }}
    >
      {/* Skeleton loader with shimmer effect */}
      {videoState === 'idle' || videoState === 'loading' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }}
          />
          <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      ) : null}

      {/* Video element */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={story.poster}
        className={`h-full w-full object-cover transition-opacity duration-300 ${videoState === 'loaded' || videoState === 'playing' ? 'opacity-100' : 'opacity-0'
          }`}
      />
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
      {/* Add shimmer animation styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

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
                     p-4 scrollbar-hide cursor-grab"
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
                priority={index < 3}
                queuePosition={index}
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
