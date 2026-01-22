import { lazy, Suspense, useRef } from 'react';
import Page1 from "./components/Page1";
import LazySection from "./components/LazySection";

// Lazy load all sections except Page1 (Hero)
const Page2 = lazy(() => import("./components/Page2"));
const Page3 = lazy(() => import("./components/Page3"));
const Page4 = lazy(() => import("./components/Page4"));
const Page5 = lazy(() => import("./components/Page5"));
const Page6 = lazy(() => import("./components/Page6"));
const Page7 = lazy(() => import("./components/Page7"));
const Page8 = lazy(() => import("./components/Page8"));
const Page9 = lazy(() => import("./components/Page9"));
const Testimonial = lazy(() => import("./components/Testimonial"));
const ProductsSection = lazy(() => import("./components/productsPage/productSection"));

const App = () => {
  const homeRef = useRef(null);
  const productsRef = useRef(null);
  const storyRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="overflow-x-hidden w-full select-none">
      {/* Hero section - loads immediately */}
      <div ref={homeRef}>
        <Page1
          scrollToRef={scrollToRef}
          refs={{ homeRef, productsRef, storyRef, benefitsRef, testimonialsRef }}
        />
      </div>

      {/* All other sections lazy-loaded with IntersectionObserver */}
      <LazySection Component={Page2} />
      
      <div id="products">
        <div ref={productsRef}>
          <LazySection Component={Page3} />
        </div>
      </div>
      
      <div id="our-story">
        <div ref={storyRef}>
          <LazySection Component={Page4} />
        </div>
      </div>
      
      <div id="benefits">
        <div ref={benefitsRef}>
          <LazySection Component={Page5} />
        </div>
      </div>
      
      <div id="testimonials">
        <div ref={testimonialsRef}>
          <LazySection Component={Testimonial} />
        </div>
      </div>
      
      <LazySection Component={Page8} />
      <LazySection Component={Page9} />
    </div>
  );
};

export default App;
