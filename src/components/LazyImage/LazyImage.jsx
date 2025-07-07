import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Skeleton } from "../index";

export const LazyImage = ({ src, alt, placeholderSrc, className }) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef();

  useEffect(() => {
    let observer;
    const { current } = imageRef;

    if (current) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setIsLoaded(true);
              setImageSrc(src);
            };
            img.onerror = () => {
              console.error("Failed to load image:", src);
            };
            observer.unobserve(current);
          }
        });
      });
      observer.observe(current);
    }

    return () => {
      if (observer && current) {
        observer.unobserve(current);
      }
    };
  }, [src, placeholderSrc]);

  return (
    <div className="relative w-full h-full">
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {!isLoaded && <Skeleton className="w-full h-full object-cover" />}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  placeholderSrc: PropTypes.string,
  className: PropTypes.string,
};
