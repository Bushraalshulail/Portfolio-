// src/components/ImageWithFallback.jsx
import React, { useState } from "react";

export default function ImageWithFallback({ src, alt, fallback, className }) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  // Default placeholder if no src or fallback
  const defaultPlaceholder = "https://via.placeholder.com/400x300?text=No+Image";

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallback) {
        setImgSrc(fallback);
      } else {
        setImgSrc(defaultPlaceholder);
      }
    } else {
      // If fallback also fails, use default placeholder
      setImgSrc(defaultPlaceholder);
    }
  };

  // If no src provided, show placeholder immediately
  if (!src && !fallback) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc || defaultPlaceholder}
      alt={alt || "Gym image"}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}
