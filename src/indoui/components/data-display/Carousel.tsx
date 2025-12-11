import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  interval = 3000,
  showArrows = true,
  showDots = true,
  loop = true,
  className,
}) => {
  const slideCount = children.length;
  // For infinite loop, we clone first and last slides
  const [currentIndex, setCurrentIndex] = useState(loop ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Create slides array with clones for infinite loop
  const slides = loop 
    ? [children[slideCount - 1], ...children, children[0]]
    : children;

  const goToNext = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(loop ? index + 1 : index);
  };

  // Handle infinite loop transitions
  useEffect(() => {
    if (!loop) return;

    const handleTransitionEnd = () => {
      if (currentIndex === 0) {
        setIsTransitioning(false);
        setCurrentIndex(slideCount);
      } else if (currentIndex === slideCount + 1) {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }
    };

    const track = trackRef.current;
    if (track) {
      track.addEventListener('transitionend', handleTransitionEnd);
      return () => track.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [currentIndex, slideCount, loop]);

  // Re-enable transition after instant jump
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Auto play
  useEffect(() => {
    if (autoPlay && !isHovered) {
      const timer = setInterval(goToNext, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, isHovered, goToNext]);

  // Calculate actual index for dots
  const actualIndex = loop 
    ? currentIndex === 0 
      ? slideCount - 1 
      : currentIndex === slideCount + 1 
        ? 0 
        : currentIndex - 1
    : currentIndex;

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < slideCount - 1;

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div
        ref={trackRef}
        className={cn(
          'flex',
          isTransitioning && 'transition-transform duration-300 ease-in-out'
        )}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slideCount > 1 && (
        <>
          <button
            onClick={goToPrev}
            disabled={!canGoPrev}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full',
              'bg-background/80 hover:bg-background shadow-md',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-opacity'
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full',
              'bg-background/80 hover:bg-background shadow-md',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-opacity'
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slideCount > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === actualIndex
                  ? 'bg-primary w-4'
                  : 'bg-primary/40 hover:bg-primary/60'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Carousel.displayName = 'Carousel';
