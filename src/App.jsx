import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Page4 from "./components/Page4";
import Page5 from "./components/Page5";
import Page6 from "./components/Page6";
import Page7 from "./components/Page7";
import Page8 from "./components/Page8";
import Page9 from "./components/Page9";
import { useRef } from 'react';

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
      <div ref={homeRef}>
        <Page1 
          scrollToRef={scrollToRef}
          refs={{ homeRef, productsRef, storyRef, benefitsRef, testimonialsRef }}
        />
      </div>

      <Page2 />
      <div id="products">
        <div ref={productsRef}>
          {/* <Page3 /> */}
        </div>
      </div>
      <div id="our-story">
        <div ref={storyRef}>
          <Page4 />
        </div>
      </div>
      <div id="benefits">
        <div ref={benefitsRef}>
          <Page5 />
        </div>
      </div>
      <div id="testimonials">
        <div ref={testimonialsRef}>
          {/* <Page6 /> */}
        </div>
      </div>
      {/* <Page7 /> */}
      {/* InstagramFeed */}
      <Page8 />
      <Page9 />
    </div>
  );
};

export default App;
