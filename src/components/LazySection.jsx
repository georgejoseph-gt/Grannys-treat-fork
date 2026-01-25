import { Suspense, useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';

/**
 * LazySection - Wraps a component and only renders it when it's near the viewport
 * Uses IntersectionObserver to defer rendering until the section is about to be visible
 * Once loaded, keeps the component mounted to prevent re-rendering lag when scrolling back
 * 
 * @param {React.ComponentType} Component - The component to lazy load
 * @param {Object} props - Props to pass to the component
 * @param {React.ReactNode} fallback - Loading fallback (optional)
 * @param {string} rootMargin - IntersectionObserver rootMargin (default: '200px')
 */
const LazySection = ({ Component, props = {}, fallback = null, rootMargin = '200px' }) => {
  const [ref, isInView] = useInView({ rootMargin, threshold: 0.01 });
  const [hasLoaded, setHasLoaded] = useState(false);

  // Once component is in view, mark it as loaded and keep it mounted
  useEffect(() => {
    if (isInView && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isInView, hasLoaded]);

  return (
    <div ref={ref} style={{ minHeight: '100px' }}>
      {hasLoaded ? (
        <Suspense fallback={fallback}>
          <Component {...props} />
        </Suspense>
      ) : (
        fallback || <div style={{ minHeight: '100vh' }} />
      )}
    </div>
  );
};

export default LazySection;
