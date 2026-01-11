// src/components/VideoSlider/VideoSlider.jsx
import { useState, useRef, useEffect } from "react";
import VideoCard from "./VideoCard";
import { videos } from "./videoData";
import "./VideoSlider.css";

const VideoSlider = () => {
  const [playingId, setPlayingId] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  // Preload all videos immediately instead of just the first 4
  const [loadedIds, setLoadedIds] = useState(() => new Set(videos.map(v => v.id)));
  const sliderRef = useRef(null);

  // Optional: center the first card on mount
  useEffect(() => {
    if (!sliderRef.current) return;
    const cardWidth = 280;
    const gap = 40;
    const initialIndex = 0;
    const scrollTo =
      initialIndex * (cardWidth + gap) - (window.innerWidth - cardWidth) / 2;
    sliderRef.current.scrollLeft = scrollTo;
  }, []);

  // Determine most centered card to run preview loop only for that one
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return undefined;

    const updatePreviewTarget = () => {
      const containerRect = el.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      let best = { id: null, dist: Number.POSITIVE_INFINITY };
      // children correspond to wrapper divs around cards
      const wrappers = Array.from(el.querySelectorAll('[data-card-wrapper="true"]'));
      wrappers.forEach((w) => {
        const rect = w.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(center - containerCenter);
        const idStr = w.getAttribute('data-card-id');
        const id = idStr ? Number(idStr) : null;
        if (id != null && dist < best.dist) best = { id, dist };
      });
      setPreviewId((prev) => (prev === best.id ? prev : best.id));
    };

    updatePreviewTarget();
    const onScroll = () => {
      // throttle via requestAnimationFrame
      if (onScroll._raf) return;
      onScroll._raf = requestAnimationFrame(() => {
        onScroll._raf = null;
        updatePreviewTarget();
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updatePreviewTarget);
    const ro = new ResizeObserver(updatePreviewTarget);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updatePreviewTarget);
      ro.disconnect();
    };
  }, []);

   // All videos are preloaded immediately, so no need for intersection observer
  // Removed lazy loading logic to preload all videos on page load

  const handleTogglePlay = (id) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  const handleVideoEnd = () => {
    setPlayingId(null);
  };

  // Drag/scroll logic (unchanged)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 md:py-12">
      <div
        ref={sliderRef}
        className="
          relative
          flex
          overflow-x-auto
          snap-x snap-mandatory
          gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-20
          cursor-grab active:cursor-grabbing
          px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10
          scrollbar-hide
        "
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            className="snap-center flex-shrink-0"
            data-card-wrapper="true"
            data-card-id={video.id}
          >
            <VideoCard
              id={video.id}
              videoUrl={video.url}
              poster={video.poster}
              username={video.username}
              dimensions={video.dimensions}
              isPlaying={video.id === playingId}
              previewActive={video.id === previewId}
              canLoad={loadedIds.has(video.id)}
              onTogglePlay={handleTogglePlay}
              onVideoEnd={handleVideoEnd}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSlider;
