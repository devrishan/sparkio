"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

/**
 * LazySection component that loads content only when it enters the viewport
 * This improves initial page load performance by deferring non-critical content
 */
export function LazySection({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "50px",
  className,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            // Unobserve after loading to prevent re-triggering
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? children : fallback || <div className="py-16" />}
    </div>
  );
}

/**
 * Higher-order component for creating lazy-loaded sections
 */
export function withLazyLoad<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    fallback?: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
  }
) {
  return function LazyLoadedComponent(props: T) {
    return (
      <LazySection
        fallback={options?.fallback}
        threshold={options?.threshold}
        rootMargin={options?.rootMargin}
      >
        <Component {...props} />
      </LazySection>
    );
  };
}

