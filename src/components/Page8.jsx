import { useEffect, useState } from "react";

/**
 * Page8 — Instagram gallery (improved error handling)
 *
 * Important:
 *  - Do NOT embed a long-lived access token in client code for production.
 *  - Use import.meta.env.VITE_INSTA_ACCESS_TOKEN for local dev, and prefer a server-side proxy in production.
 */

const FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='#e6eef6'/><text x='50%' y='50%' font-size='20' dominant-baseline='middle' text-anchor='middle' fill='#6b7f96'>Image unavailable</text></svg>`
  );

const Page8 = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prefer using an env var instead of hardcoding:
      const accessToken = import.meta.env.VITE_INSTA_ACCESS_TOKEN;
      // const accessToken = "YOUR_TOKEN_HERE"; // temporary dev fallback (not recommended)

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
    <div className="min-h-screen w-full bg-[#d2eef9] relative">
      <div className=" w-[85%] mx-auto p-8">
        <h3 className="font-[Fredoka] text-[#285192] font-extrabold text-center text-3xl md:text-5xl mb-12 tracking-wider">
          Be a part of our Instagram community
        </h3>

        {loading && (
          <div className="text-center mb-8 text-sm text-gray-600">
            Loading...
          </div>
        )}
        {error && (
          <div className="text-center mb-8 text-sm text-red-600">
            Could not load Instagram images: {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 justify-center">
          {/* Column 1: Single large image */}
          <div className="lg:w-[450px]">
            {thumbnails[0] ? (
              <img
                src={getImageSrc(thumbnails[0])}
                alt={thumbnails[0]?.caption || "Instagram image"}
                className="w-full h-[516px] border-8 border-white object-cover rounded-3xl shadow-lg"
                onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
              />
            ) : (
              <img
                src={FALLBACK_SVG}
                alt="placeholder"
                className="w-full h-[516px] border-8 border-white object-cover rounded-3xl shadow-lg"
              />
            )}
          </div>

          {/* Column 2: Grid layout */}
          <div className="lg:w-[80%]">
            {/* Row 1: Two larger images */}
            <div className="flex gap-4 mb-4 h-[250px]">
              {thumbnails[1] ? (
                <img
                  src={getImageSrc(thumbnails[1])}
                  alt={thumbnails[1]?.caption || "Instagram image"}
                  className="w-1/2 object-cover border-8 border-white rounded-3xl shadow-lg"
                  onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                />
              ) : (
                <img
                  src={FALLBACK_SVG}
                  alt="placeholder"
                  className="w-1/2 object-cover border-8 border-white rounded-3xl shadow-lg"
                />
              )}

              {thumbnails[2] ? (
                <img
                  src={getImageSrc(thumbnails[2])}
                  alt={thumbnails[2]?.caption || "Instagram image"}
                  className="w-2/3 object-cover border-8 border-white rounded-3xl shadow-lg"
                  onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                />
              ) : (
                <img
                  src={FALLBACK_SVG}
                  alt="placeholder"
                  className="w-2/3 object-cover border-8 border-white rounded-3xl shadow-lg"
                />
              )}
            </div>

            {/* Row 2: Three smaller images */}
            <div className="flex gap-4 h-[250px]">
              {[3, 4, 5].map((i, idx) => (
                <div
                  key={thumbnails[i]?.id || `placeholder-${idx}`}
                  className={idx === 1 ? "w-[40%]" : "w-[30%]"}
                >
                  <img
                    src={getImageSrc(thumbnails[i])}
                    alt={thumbnails[i]?.caption || "Instagram image"}
                    className="w-full h-full object-cover border-8 border-white rounded-3xl shadow-lg"
                    onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
                  />
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
