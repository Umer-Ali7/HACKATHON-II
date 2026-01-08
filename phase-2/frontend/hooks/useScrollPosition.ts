'use client';

import { useState, useEffect } from 'react';

interface ScrollPosition {
  scrollY: number;
  isScrolled: boolean;
}

function useScrollPosition(threshold: number = 10): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    isScrolled: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition({
        scrollY: currentScrollY,
        isScrolled: currentScrollY > threshold,
      });
    };

    // Set initial value
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrollPosition;
}

export { useScrollPosition };
