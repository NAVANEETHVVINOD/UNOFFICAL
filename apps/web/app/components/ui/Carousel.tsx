"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  fullWidth?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}

/**
 * Carousel - A full-width sliding content component
 * 
 * Features:
 * - Full-width edge-to-edge display
 * - Auto-play with configurable interval
 * - Pause on hover
 * - Navigation dots and arrows
 * - Swipe navigation for touch devices
 * - Supports different content types (images, cards, text)
 * 
 * @example
 * <Carousel
 *   items={[<Slide1 />, <Slide2 />, <Slide3 />]}
 *   autoPlay
 *   autoPlayInterval={5000}
 *   showDots
 *   fullWidth
 * />
 */
export default function Carousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  fullWidth = false,
  className = "",
  pauseOnHover = true,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const itemCount = items.length;

  // Ensure index stays within bounds
  const safeSetIndex = useCallback((newIndex: number) => {
    if (itemCount === 0) return;
    // Wrap around for infinite loop effect
    const boundedIndex = ((newIndex % itemCount) + itemCount) % itemCount;
    setCurrentIndex(boundedIndex);
  }, [itemCount]);

  const goToNext = useCallback(() => {
    setDirection(1);
    safeSetIndex(currentIndex + 1);
  }, [currentIndex, safeSetIndex]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    safeSetIndex(currentIndex - 1);
  }, [currentIndex, safeSetIndex]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    safeSetIndex(index);
  }, [currentIndex, safeSetIndex]);

  // Auto-play logic with pause on hover
  useEffect(() => {
    if (!autoPlay || itemCount <= 1) return;

    const shouldPause = pauseOnHover && isHovered;

    if (shouldPause) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(goToNext, autoPlayInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoPlay, autoPlayInterval, isHovered, pauseOnHover, goToNext, itemCount]);

  // Handle swipe gestures
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      goToNext();
    } else if (info.offset.x > swipeThreshold) {
      goToPrev();
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  if (itemCount === 0) {
    return null;
  }

  const containerClasses = fullWidth
    ? "w-full overflow-hidden"
    : "max-w-3xl mx-auto overflow-hidden";

  return (
    <div
      className={`relative ${containerClasses} ${className} transform -rotate-1`}
      style={{ transformOrigin: 'center' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Content carousel"
    >
      {/* Slides Container */}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full touch-pan-y"
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${currentIndex + 1} of ${itemCount}`}
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && itemCount > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-[#2D2D2D]/90 border-2 border-ink shadow-neo-sm hover:bg-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-[#2D2D2D]/90 border-2 border-ink shadow-neo-sm hover:bg-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && itemCount > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2"
          role="tablist"
          aria-label="Slide navigation"
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full border-2 border-ink transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
                index === currentIndex
                  ? "bg-primary scale-110"
                  : "bg-white/80 dark:bg-[#2D2D2D]/80 hover:bg-primary/50"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-ink" : "bg-ink/30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Export utility for getting carousel state (useful for testing)
export function getCarouselBounds(itemCount: number, currentIndex: number): {
  isValid: boolean;
  isFirst: boolean;
  isLast: boolean;
} {
  if (itemCount === 0) {
    return { isValid: false, isFirst: false, isLast: false };
  }
  const boundedIndex = ((currentIndex % itemCount) + itemCount) % itemCount;
  return {
    isValid: boundedIndex >= 0 && boundedIndex < itemCount,
    isFirst: boundedIndex === 0,
    isLast: boundedIndex === itemCount - 1,
  };
}
