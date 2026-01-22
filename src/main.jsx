import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./app/Header.jsx";

// Lazy load Footer since it's at the bottom of the page
const Footer = lazy(() => import("./app/Footer.jsx"));

// Function to set zoom level
const setZoom = (zoomLevel) => {
  document.body.style.zoom = `${zoomLevel}%`;
};

// Wrapper component to handle zoom
const ZoomWrapper = () => {
  useEffect(() => {
    setZoom(100);
  }, []);

  return (
    <>
      <Header />
      <App />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ZoomWrapper />
  </StrictMode>
);
