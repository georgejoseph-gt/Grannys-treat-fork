// src/components/VideoSlider/VideoSlider.jsx
import { useState, useRef, useEffect } from "react";
import VideoCard from "./VideoCard";
import { videos } from "./videoData";
import "./VideoSlider.css";

const VideoSlider = () => {
  const [playingId, setPlayingId] = useState(null);
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
    <div className="w-full mx-auto px-0 py-12">
      <div
        ref={sliderRef}
        className="
          relative
          flex
          overflow-x-auto
          snap-x snap-mandatory
          gap-20
          cursor-grab active:cursor-grabbing
          px-10
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
          <div key={video.id} className="snap-center flex-shrink-0">
            <VideoCard
              id={video.id}
              videoUrl={video.url}
              poster={video.poster}
              username={video.username}
              dimensions={video.dimensions}
              isPlaying={video.id === playingId}
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
