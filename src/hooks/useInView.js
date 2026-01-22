import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that uses IntersectionObserver to detect when an element enters the viewport
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.rootMargin - Margin around root (e.g., '200px' or '200px 0px')
 * @param {number} options.threshold - Threshold for intersection (0-1)
 * @returns {[React.RefObject, boolean]} - [ref, isInView]
 */
export const useInView = (options = {}) => {
  const { rootMargin = '200px', threshold = 0.01 } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return [ref, isInView];
};
