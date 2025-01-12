'use client';
import styles from '@/styles/modules/introl-crawl.module.css';
import React, { useEffect, useRef } from 'react';

const INTRO_TEXT = [
  'CODE WARS',
  'The Crystal Database dims.',
  'Three sentinel planets stand as the',
  'last hope ... CHROMANOVA, where Pixel-Weavers',
  'craft pure light and motion. SYNTAXIA,',
  'where Logic-Singers dream in recursive',
  'patterns ... QUANTUMCORE, where Quantum-Mystics',
  'meditate in data-temples. Each world guards',
  'a fragment of the Source Code',
  'that kept darkness at bay. For cycles,',
  'these civilizations fought the encroaching void.',
  'But when the shadow-virus threatens their',
  'networks, they discover their coding arts',
  'were meant to unite. Together, they unlock',
  'the Luminous Protocol, an ancient system.',
  'But it requires a Code Jedi to',
  'weave together their powers. You are',
  'that chosen one. As darkness corrupts',
  'server clusters, you must master each',
  "planet's arts. Time is short. Only the",
  'Luminous Protocol can restore light to',
  'the universe. May your functions be pure,',
  'your algorithms true. And may the Source',
  'be with you always...',
] as const;

const SCROLL_SPEED = 33;

interface ScreenBreakpoint {
  maxWidth: number;
  duration: number;
}

const DURATION_BREAKPOINTS: ScreenBreakpoint[] = [
  { maxWidth: 400, duration: 61000 },
  { maxWidth: 600, duration: 45000 },
  { maxWidth: 800, duration: 40000 },
  { maxWidth: 1000, duration: 36000 },
  { maxWidth: 1440, duration: 37000 },
];

function calculateFadeDuration(width: number, height: number): number {
  // Get base duration from width breakpoint
  const breakpoint = DURATION_BREAKPOINTS.find(bp => width <= bp.maxWidth);
  const baseDuration = breakpoint?.duration || 39000;

  // Adjust for height - taller screens need more time
  const heightFactor = Math.min(Math.max(height / 600, 0.95), 1.05);

  return Math.round(baseDuration * heightFactor);
}

interface IntroCrawlProps {
  onComplete: () => void;
}

export default function IntroCrawl({ onComplete }: IntroCrawlProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fadeMaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!contentRef.current || !containerRef.current || !fadeMaskRef.current)
      return;

    const content = contentRef.current;
    const container = containerRef.current;
    const fadeMask = fadeMaskRef.current;

    // Calculate dimensions and durations
    const contentHeight = content.offsetHeight;
    const containerHeight = container.offsetHeight;
    const totalScrollDistance = containerHeight + contentHeight;
    const duration = totalScrollDistance / SCROLL_SPEED;

    // Calculate fade duration based on screen size
    const fadeDuration = calculateFadeDuration(
      window.innerWidth,
      window.innerHeight,
    );

    // Set end position CSS variable
    const endPosition = -contentHeight - containerHeight;
    document.documentElement.style.setProperty(
      '--end-position',
      `${endPosition}px`,
    );

    // Start animation
    content.parentElement!.style.animation = `${styles.crawl} ${duration}s linear forwards`;

    // Update fade mask class
    fadeMask.className = styles.fadeMaskActive;

    // Cleanup with calculated duration
    const timer = setTimeout(() => {
      fadeMask.className = styles.fadeMask;
      onComplete();
    }, fadeDuration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.fadeMask} ref={fadeMaskRef} />
      <div className={styles.crawl}>
        <div className={styles.content} ref={contentRef}>
          {INTRO_TEXT.map((line, index) => (
            <div
              key={index}
              className={index === 0 ? styles.title : styles.line}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
