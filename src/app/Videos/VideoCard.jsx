// src/components/VideoCard/VideoCard.jsx
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { FaPauseCircle } from "react-icons/fa";
import { FaVolumeXmark } from "react-icons/fa6";
import { IoVolumeHigh } from "react-icons/io5";

/**
 * VideoCard - plays mp4 or HLS (.m3u8). Uses a poster image when not playing.
 * If poster is missing, it attempts to generate a thumbnail client-side (optional).
 */
const VideoCard = ({
  id,
  videoUrl,
  poster,
  username,
  isPlaying,
  onTogglePlay,
  onVideoEnd,
}) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clientPoster, setClientPoster] = useState(poster || null);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);

  // Attach HLS if needed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const isHls = typeof videoUrl === "string" && videoUrl.endsWith(".m3u8");
    const canPlayNative = video.canPlayType("application/vnd.apple.mpegurl");

    if (isHls && !canPlayNative && Hls.isSupported()) {
      // use hls.js
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      const hls = new Hls({ allowFileProtocol: true });
      hlsRef.current = hls;
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(videoUrl);
      });
    } else {
      // native: just set the src (works in Safari or for mp4)
      // When switching between video sources, reset src
      if (video.src !== videoUrl) {
        video.src = videoUrl;
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl]);

  // Start/stop playback depending on isPlaying prop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (isPlaying) {
      // ensure muted state matches UI setting
      video.muted = isMuted;
      const playPromise = video.play();
      // handle promise for browsers requiring user gesture
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          // failed to autoplay — leave poster visible
        });
      }
    } else {
      video.pause();
      // when paused, reset to poster visibility handled by parent markup
    }
    return undefined;
  }, [isPlaying, isMuted]);

  // Optional: client-side thumbnail generation (slow); only use if poster not provided
  useEffect(() => {
    if (poster || clientPoster || isGeneratingPoster) return undefined;
    // run thumbnail generation once
    let cancelled = false;
    const generate = async () => {
      if (!videoUrl) return;
      setIsGeneratingPoster(true);
      try {
        // create a temp video element for snapshotting (do not add to DOM)
        const tmpVideo = document.createElement("video");
        tmpVideo.crossOrigin = "anonymous";
        tmpVideo.muted = true;
        tmpVideo.playsInline = true;
        // attach hls if needed in tmp element for non-native browsers
        const isHls = videoUrl.endsWith(".m3u8");
        const canPlayNative = tmpVideo.canPlayType("application/vnd.apple.mpegurl");

        if (isHls && !canPlayNative && Hls.isSupported()) {
          const hls = new Hls();
          hls.attachMedia(tmpVideo);
          await new Promise((resolve, reject) => {
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
              hls.loadSource(videoUrl);
              resolve();
            });
            // small timeout fallback
            setTimeout(resolve, 3000);
          });
        } else {
          tmpVideo.src = videoUrl;
        }

        // wait for metadata
        await new Promise((resolve, reject) => {
          const onLoadedMeta = () => {
            resolve();
            tmpVideo.removeEventListener("loadedmetadata", onLoadedMeta);
          };
          tmpVideo.addEventListener("loadedmetadata", onLoadedMeta);
          setTimeout(() => resolve(), 5000); // fallback
        });

        // seek to 1s (or 0 if duration < 1)
        const target = Math.min(1, tmpVideo.duration / 2 || 0);
        await new Promise((resolve) => {
          const onSeeked = () => {
            // draw to canvas
            const canvas = document.createElement("canvas");
            canvas.width = tmpVideo.videoWidth || 640;
            canvas.height = tmpVideo.videoHeight || 360;
            const ctx = canvas.getContext("2d");
            try {
              ctx.drawImage(tmpVideo, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
              if (!cancelled) setClientPoster(dataUrl);
            } catch (err) {
              // cross-origin or other errors can happen; ignore
            }
            tmpVideo.removeEventListener("seeked", onSeeked);
            resolve();
          };
          tmpVideo.addEventListener("seeked", onSeeked);
          tmpVideo.currentTime = target;
          // fallback if seek doesn't fire
          setTimeout(resolve, 3000);
        });
      } catch (err) {
        // ignore
      } finally {
        setIsGeneratingPoster(false);
      }
    };

    generate();

    return () => {
      cancelled = true;
    };
  }, [poster, clientPoster, videoUrl, isGeneratingPoster]);

  const handleEnd = () => {
    onVideoEnd();
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    onTogglePlay(id);
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    setIsMuted((p) => !p);
    // apply to video element
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // which poster to show: prefer server poster, else clientPoster
  const effectivePoster = poster || clientPoster || null;

  return (
         <div
       className="relative w-[320px] h-[560px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 flex flex-col"
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
     >
      {/* Video Container with proper aspect ratio */}
      <div className="relative w-full h-[480px] bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Poster image shown when not playing */}
        {!isPlaying && effectivePoster && (
          <img
            src={effectivePoster}
            alt={username || "Video thumbnail"}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        )}

        {/* HTML5 video element - no padding, full container */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${isPlaying ? "z-15" : "z-5"}`}
          playsInline
          onEnded={handleEnd}
          preload="metadata"
          controls={false}
        />

                 {/* Subtle Play / Pause button */}
         {(isHovered || !isPlaying) && (
           <div className="absolute inset-0 flex items-center justify-center z-20">
             <button
               onClick={handlePlayPause}
               className="flex bg-white/90 backdrop-blur-sm rounded-full items-center justify-center hover:bg-white transition-all duration-200 focus:outline-none p-4 shadow-lg"
               aria-label={isPlaying ? "Pause video" : "Play video"}
             >
               {isPlaying ? (
                 <FaPauseCircle className="w-12 h-12 text-gray-800" />
               ) : (
                 <BsFillPlayCircleFill className="w-12 h-12 text-gray-800" />
               )}
             </button>
           </div>
         )}

                 {/* Subtle MUTE / UNMUTE button */}
         <div className="absolute top-3 right-3 z-20">
           <button
             onClick={handleMuteToggle}
             className="text-gray-700 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 focus:outline-none"
             aria-label={isMuted ? "Unmute" : "Mute"}
           >
             {isMuted ? (
               <FaVolumeXmark className="w-4 h-4" />
             ) : (
               <IoVolumeHigh className="w-4 h-4" />
             )}
           </button>
         </div>

        {/* Video progress indicator */}
        {isPlaying && (
          <div className="absolute bottom-3 left-3 right-3 z-20">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced footer with gradient and better typography */}
      <div className="flex-1 bg-gradient-to-br from-white to-gray-50 p-4 flex flex-col justify-center">
        <div className="text-center">
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-3"></div>
          <p className="text-xl font-[Fredoka] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#285192] to-[#4a90e2]">
            {username}
          </p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Tap to play</p>
        </div>
      </div>

      {/* Subtle border accent */}
      <div className="absolute inset-0 rounded-2xl border border-gray-100 pointer-events-none"></div>
    </div>
  );
};

VideoCard.propTypes = {
  id: PropTypes.number.isRequired,
  videoUrl: PropTypes.string.isRequired,
  poster: PropTypes.string,
  username: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  onVideoEnd: PropTypes.func.isRequired,
};

export default VideoCard;
