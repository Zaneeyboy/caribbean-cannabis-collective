'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Which scroll-reveal class to apply — matched by CSS in globals.css */
  animation?: 'reveal' | 'reveal-left' | 'reveal-right' | 'reveal-scale';
  /** Additional transition delay in ms (for staggered siblings) */
  delay?: number;
  /** How much of the element must be visible before triggering (0–1) */
  threshold?: number;
}

export default function AnimateOnScroll({ children, className = '', animation = 'reveal', delay = 0, threshold = 0.12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay > 0) {
      el.style.transitionDelay = `${delay}ms`;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          // Reset delay after reveal so hover transitions aren't slowed
          el.addEventListener(
            'transitionend',
            () => {
              el.style.transitionDelay = '';
            },
            { once: true },
          );
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`${animation} ${className}`}>
      {children}
    </div>
  );
}
