import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * CertificateLightbox — Modal image viewer for certificate images
 *
 * Props:
 *  - images: Array<string> — URLs of certificate images
 *  - isOpen: Boolean — whether lightbox is visible
 *  - onClose: Function — callback to close lightbox
 *  - initialIndex: Number (default: 0) — which image to show first
 */
export default function CertificateLightbox({ images, isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update currentIndex when initialIndex prop changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handlePrevious = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // useCallback to memoize handleKeyDown and avoid re-creating it every render
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  }, [isOpen, onClose, images.length]);

  // Keyboard listener with fixed dependency array (only isOpen, not images.length)
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleClickOutside}
      role="dialog"
      aria-modal="true"
      aria-label="Certificate image viewer"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors z-10 flex items-center justify-center"
        title="Close (Esc)"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {/* Image Container */}
      <div className="relative flex items-center justify-center max-w-4xl max-h-[80vh] w-full">
        <img
          src={currentImage}
          alt={`Certificate image ${currentIndex + 1} of ${images.length}`}
          className="max-w-full max-h-full rounded-lg object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            console.error('Failed to load image:', currentImage);
          }}
        />

        {/* Navigation Arrows (shown only if multiple images) */}
        {hasMultiple && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110 flex items-center justify-center"
              title="Previous image (Left arrow)"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110 flex items-center justify-center"
              title="Next image (Right arrow)"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      {/* Image Counter (shown only if multiple images) */}
      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium pointer-events-none">
          {currentIndex + 1} <span className="text-white/60">/ {images.length}</span>
        </div>
      )}
    </div>
  );
}
