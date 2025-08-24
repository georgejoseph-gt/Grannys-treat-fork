// src/data/videos.js
// Updated to use your Cloudflare R2 HLS manifests.
// Make sure you have corresponding poster images (e.g. 1.jpg) uploaded next to the .mp4 files
// and that R2 serves them with appropriate CORS headers (Access-Control-Allow-Origin).
const R2_BASE = "https://pub-497cc1e800ce4db2a453abafecb66868.r2.dev";

export const videos = [
  {
    id: 1,
    url: `${R2_BASE}/1.mp4`,
    poster: `${R2_BASE}/thumbnails/1.jpg`, // replace/upload if missing
    username: "Maria.Garcia",
    dimensions: "1920×1080",
  },
  {
    id: 2,
    url: `${R2_BASE}/2.mp4`,
    poster: `${R2_BASE}/thumbnails/2.jpg`,
    username: "David.Kim",
    dimensions: "1440×1080",
  },
  {
    id: 3,
    url: `${R2_BASE}/3.mp4`,
    poster: `${R2_BASE}/thumbnails/3.jpg`,
    username: "Emma.Smith",
    dimensions: "1920×1080",
  },
  {
    id: 4,
    url: `${R2_BASE}/4.mp4`,
    poster: `${R2_BASE}/thumbnails/4.jpg`,
    username: "Alex.Chen",
    dimensions: "1280×720",
  },
  {
    id: 5,
    url: `${R2_BASE}/5.mp4`,
    poster: `${R2_BASE}/thumbnails/5.jpg`,
    username: "Sarah.Johnson",
    dimensions: "1280×720",
  },
  {
    id: 6,
    url: `${R2_BASE}/6.mp4`,
    poster: `${R2_BASE}/thumbnails/6.jpg`,
    username: "Michael.Brown",
    dimensions: "1920×1080",
  },
  {
    id: 7,
    url: `${R2_BASE}/7.mp4`,
    poster: `${R2_BASE}/thumbnails/7.jpg`,
    username: "Lisa.Taylor",
    dimensions: "1280×720",
  },
  {
    id: 8,
    url: `${R2_BASE}/8.mp4`,
    poster: `${R2_BASE}/thumbnails/8.jpg`,
    username: "James.Wilson",
    dimensions: "1920×1080",
  },
  {
    id: 9,
    url: `${R2_BASE}/9.mp4`,
    poster: `${R2_BASE}/thumbnails/9.jpg`,
    username: "Ana.Martinez",
    dimensions: "1440×1080",
  },
  {
    id: 10,
    url: `${R2_BASE}/10.mp4`,
    poster: `${R2_BASE}/thumbnails/10.jpg`,
    username: "Ryan.Thompson",
    dimensions: "1920×1080",
  },
  {
    id: 13,
    url: `${R2_BASE}/13.mp4`,
    poster: `${R2_BASE}/thumbnails/13.jpg`,
    username: "Ryan.Thompson",
    dimensions: "1920×1080",
  },
  
  // mother
  {
    id: 14,
    url: `${R2_BASE}/Reel1.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel1.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 15,
    url: `${R2_BASE}/Reel2.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel2.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 16,
    url: `${R2_BASE}/Reel3.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel3.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 17,
    url: `${R2_BASE}/Reel4.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel4.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 18,
    url: `${R2_BASE}/Reel5.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel5.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 19,
    url: `${R2_BASE}/Reel6.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel6.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 20,
    url: `${R2_BASE}/Reel7.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel7.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 21,
    url: `${R2_BASE}/Reel8.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel8.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 22,
    url: `${R2_BASE}/Reel9.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel9.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },
  {
    id: 23,
    url: `${R2_BASE}/Reel10.mp4`,
    poster: `${R2_BASE}/thumbnails/Reel10.jpg`,
    username: "GrannysTreat",
    dimensions: "1920×1080",
  },

];

export default videos;