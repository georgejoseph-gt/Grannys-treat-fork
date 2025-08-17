import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import PropTypes from 'prop-types';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  onClick,
  style = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height, ...style }}
      >
        <span className="text-gray-400">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Blurred placeholder - shown while loading */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
          style={{ 
            width, 
            height,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover'
          }}
        />
      )}
      
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="blur"
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
  style: PropTypes.object
};

export default OptimizedImage; 