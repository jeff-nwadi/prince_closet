'use client';

import { useState, useEffect, useCallback, type RefObject } from 'react';

interface UseInViewOptions {
  margin?: string;
  threshold?: number;
  once?: boolean;
}

interface UseInViewReturn {
  isInView: boolean;
  onAnimationComplete: () => void;
}

export function useInView(
  ref: RefObject<HTMLElement | null>,
  options: UseInViewOptions = {}
): UseInViewReturn {
  const { margin = '0px', threshold = 0, once = true } = options;
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const onAnimationComplete = useCallback(() => {
    if (once) {
      setHasAnimated(true);
    }
  }, [once]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already animated once and once=true, keep it visible
    if (hasAnimated && once) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        rootMargin: margin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, margin, threshold, once, hasAnimated]);

  return { isInView, onAnimationComplete };
}
