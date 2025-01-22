import React, { useEffect, useRef } from 'react';
import { StationBackgroundRenderer } from '@/lib/game/station/backgroundRenderer';

const CLERK_SIZE = 64; // Size of the clerk in pixels
const CLERK_COLORS = {
  SKIN: '#FFE0BD',
  HAIR: '#4A4A4A',
  SHIRT: '#36454F',
  COLLAR: '#FF0000',
  NAMETAG: '#FFFFFF'
};

export const StationBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<StationBackgroundRenderer | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const bobPosition = useRef({ y: 0, yVelocity: 0.5 }); // For bob animation

  const drawClerk = (ctx: CanvasRenderingContext2D, canvasWidth: number) => {
    const x = (canvasWidth - CLERK_SIZE) / 2;
    const y = 100 + Math.sin(bobPosition.current.y) * 5; // Bobbing motion

    // Draw base head
    ctx.fillStyle = CLERK_COLORS.SKIN;
    ctx.fillRect(x + 24, y + 8, 16, 16);

    // Draw hair
    ctx.fillStyle = CLERK_COLORS.HAIR;
    ctx.fillRect(x + 22, y + 6, 20, 6);
    ctx.fillRect(x + 20, y + 8, 4, 8);

    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 28, y + 14, 4, 2);
    ctx.fillRect(x + 34, y + 14, 4, 2);

    // Draw mouth
    ctx.fillRect(x + 30, y + 18, 6, 2);

    // Draw body/uniform
    ctx.fillStyle = CLERK_COLORS.SHIRT;
    ctx.fillRect(x + 22, y + 24, 20, 24);

    // Draw collar
    ctx.fillStyle = CLERK_COLORS.COLLAR;
    ctx.fillRect(x + 22, y + 24, 20, 4);

    // Draw name tag
    ctx.fillStyle = CLERK_COLORS.NAMETAG;
    ctx.fillRect(x + 26, y + 26, 12, 2);

    // Draw arms
    ctx.fillStyle = CLERK_COLORS.SKIN;
    ctx.fillRect(x + 18, y + 24, 4, 16);
    ctx.fillRect(x + 42, y + 24, 4, 16);

    // Update bob animation
    bobPosition.current.y += bobPosition.current.yVelocity;
  };

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

    rendererRef.current = StationBackgroundRenderer.getInstance();

    const animate = () => {
      if (!ctx || !canvas) return;

      rendererRef.current?.render({
        ctx,
        canvas
      });

      // Draw the clerk on top of the star background
      drawClerk(ctx, canvas.width);

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
      aria-hidden="true"
    />
  );
};

export default StationBackground;