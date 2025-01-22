'use client';

import { useEffect, useRef } from 'react';
import { PlanetType } from '@/types/shared/planetTypes';
import styles from './planet.module.css';
import { BackgroundRenderer } from '@/lib/game/planet/backgroundRenderer';

interface PlanetBackgroundProps {
  planetType: PlanetType;
}

export const PlanetBackground = ({ planetType }: PlanetBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BackgroundRenderer | null>(null);
  const animationFrameId = useRef<number>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    rendererRef.current = BackgroundRenderer.getInstance();

    const animate = () => {
      rendererRef.current?.render({
        ctx,
        canvas,
        planetType
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [planetType]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.backgroundCanvas}
      aria-hidden="true"
    />
  );
};
