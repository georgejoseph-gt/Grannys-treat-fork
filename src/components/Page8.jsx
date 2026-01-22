import { useEffect, useState } from "react";


const FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='#e6eef6'/><text x='50%' y='50%' font-size='20' dominant-baseline='middle' text-anchor='middle' fill='#6b7f96'>Image unavailable</text></svg>`
  );

// Read once at module scope to avoid recomputing on every render
const accessToken = import.meta.env.VITE_INSTA_ACCESS_TOKEN;

const Page8 = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {

      if (!accessToken) {
        throw new Error(
          "Instagram access token not provided. Set VITE_INSTA_ACCESS_TOKEN."
        );
      }

      const url =
        `https://graph.instagram.com/me/media` +
        `?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` +
        `&access_token=${accessToken}`;

      const response = await fetch(url);

      // <-- important: check response.ok to catch 4xx/5xx and avoid trying to parse a non-JSON error body
      if (!response.ok) {
        // read body text for debug (if any)
        const text = await response.text().catch(() => "");
        throw new Error(
          `Instagram API error: ${response.status} ${response.statusText} ${text}`
        );
      }

      const data = await response.json();

      // If API returns an object with data array
      const mediaArray = Array.isArray(data?.data) ? data.data : [];
      setThumbnails(mediaArray.slice(0, 6));
    } catch (err) {
      console.error("Error fetching Instagram data:", err);
      setError(err.message || "Unknown error");
      setThumbnails([]); // ensure safe UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();
  }, []);

  // Helper to pick image src safely
  const getImageSrc = (item) => {
    if (!item) return FALLBACK_SVG;
    // Videos often have thumbnail_url; images use media_url
    if (item.media_type === "VIDEO")
      return item.thumbnail_url || item.media_url || FALLBACK_SVG;
    return item.media_url || item.thumbnail_url || FALLBACK_SVG;
  };

  return (
    <div className="min-h-fit w-full bg-[#d2eef9] relative  pb-12 md:py-16">
      <div className="w-[95%] sm:w-[85%] mx-auto px-2 sm:px-6 md:px-8">
        <h3 className="font-[Fredoka] text-[#285192] font-extrabold text-center text-[clamp(1.5rem,4vw,3rem)] mb-8 sm:mb-10 md:mb-12 tracking-wider px-4">
          Be a part of our Instagram community
        </h3>

        {loading && (
          <div className="text-center mb-6 sm:mb-8 text-sm text-gray-600">
            Loading...
          </div>
        )}
        {error && (
          <div className="text-center mb-6 sm:mb-8 text-sm text-red-600">
            Could not load Instagram images: {error}
          </div>
        )}

        {/* Mobile-only layout (< sm) */}
        <div className="sm:hidden">
          <div className="flex gap-1">
            {/* Left column: two stacked */}
            <div className="flex-1 flex flex-col gap-1">
              {[0, 1].map((i) => (
                <a
                  key={thumbnails[i]?.id || `m-${i}`}
                  href={thumbnails[i]?.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-[50vw]"
                >
                  <img
                    src={getImageSrc(thumbnails[i])}
                    alt={thumbnails[i]?.caption || "Instagram image"}
                    className="w-full h-full object-cover border-4 border-white rounded-2xl shadow-md"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                  />
                </a>
              ))}
            </div>

            {/* Middle column: one tall */}
            <div className="flex-1 flex flex-col gap-1">
              <a
                key={thumbnails[2]?.id || `m-2`}
                href={thumbnails[2]?.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-[40vw]"
              >
                <img
                  src={getImageSrc(thumbnails[2])}
                  alt={thumbnails[2]?.caption || "Instagram image"}
                  className="w-full h-full object-cover border-4 border-white rounded-2xl shadow-md"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                />
              </a>
              <a
                key={thumbnails[3]?.id || `m-3`}
                href={thumbnails[3]?.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-[60vw]"
              >
                <img
                  src={getImageSrc(thumbnails[3])}
                  alt={thumbnails[3]?.caption || "Instagram image"}
                  className="w-full h-full object-cover border-4 border-white rounded-2xl shadow-md"
                  onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                />
              </a>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              {[4, 5].map((i) => (
                <a
                  key={thumbnails[i]?.id || `m-${i}`}
                  href={thumbnails[i]?.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-[50vw]"
                >
                  <img
                    src={getImageSrc(thumbnails[i])}
                    alt={thumbnails[i]?.caption || "Instagram image"}
                    className="w-full h-full object-cover border-4 border-white rounded-2xl shadow-md"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                  />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Desktop/tablet layout (>= sm) */}
        <div className="hidden sm:flex flex-col xl:flex-row gap-4 sm:gap-6 justify-center">
          {/* Column 1: Single large image */}
          <div className="w-full xl:w-[450px]">
            {thumbnails[0] ? (
              <a href={thumbnails[0]?.permalink} target="_blank" rel="noopener noreferrer">
                <img
                  src={getImageSrc(thumbnails[0])}
                  alt={thumbnails[0]?.caption || "Instagram image"}
                  className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[516px] border-4 sm:border-6 md:border-8 border-white object-cover rounded-2xl sm:rounded-3xl shadow-lg"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                />
              </a>
            ) : (
              <img
                src={FALLBACK_SVG}
                alt="placeholder"
                className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[516px] border-4 sm:border-6 md:border-8 border-white object-cover rounded-2xl sm:rounded-3xl shadow-lg"
              />
            )}
          </div>

          {/* Column 2: Grid layout */}
          <div className="w-full xl:w-[80%]">
            {/* Row 1: Two larger images */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 h-auto sm:h-[200px] md:h-[250px]">

              {thumbnails[1] ? (
                <a href={thumbnails[1]?.permalink} target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-1/2 h-[150px] sm:h-full object-cover border-4 sm:border-6 md:border-8 border-white rounded-2xl sm:rounded-3xl shadow-lg"
                >
                  <img
                    src={getImageSrc(thumbnails[1])}
                    alt={thumbnails[1]?.caption || "Instagram image"}
                    className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                  />
                </a>
              ) : (
                <img
                  src={FALLBACK_SVG}
                  alt="placeholder"
                  className="w-full sm:w-1/2 h-[150px] sm:h-full object-cover border-4 sm:border-6 md:border-8 border-white rounded-2xl sm:rounded-3xl shadow-lg"
                />
              )}

              {thumbnails[2] ? (
                <a href={thumbnails[2]?.permalink} target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-2/3 h-[150px] sm:h-full object-cover border-4 sm:border-6 md:border-8 border-white rounded-2xl sm:rounded-3xl shadow-lg"
                >
                  <img
                    src={getImageSrc(thumbnails[2])}
                    alt={thumbnails[2]?.caption || "Instagram image"}
                    className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                  />
                </a>
              ) : (
                <img
                  src={FALLBACK_SVG}
                  alt="placeholder"
                  className="w-full sm:w-2/3 h-[150px] sm:h-full object-cover border-4 sm:border-6 md:border-8 border-white rounded-2xl sm:rounded-3xl shadow-lg"
                />
              )}
            </div>

            {/* Row 2: Three smaller images */}
            <div className="flex flex-col sm:flex-row gap-4 h-auto sm:h-[200px] md:h-[250px]">
              {[3, 4, 5].map((i, idx) => (
                <div
                  key={thumbnails[i]?.id || `placeholder-${idx}`}
                  className={idx === 1 ? "w-full sm:w-[40%]" : "w-full sm:w-[30%]"}
                >
                  <a href={thumbnails[i]?.permalink} target="_blank" rel="noopener noreferrer"
                    className="w-full h-[120px] sm:h-full block"
                  >
                    <img
                      src={getImageSrc(thumbnails[i])}
                      alt={thumbnails[i]?.caption || "Instagram image"}
                      className="w-full h-full object-cover border-4 sm:border-6 md:border-8 border-white rounded-2xl sm:rounded-3xl shadow-lg"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page8;
