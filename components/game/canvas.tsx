'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { GameRenderer } from '@/lib/game/renderer';
import { useGameStore } from '@/store/useGameStore';
import IntroCrawl from './intro-crawl';

const SHIP_SPEED = 5;
const INTERACTION_RADIUS = 30;

export const GAME_COLORS = {
  background: '#1C1C1EFF',
  foreground: '#EBEBF599',
  accent: '#64D2FFFF',
  glow: 'rgba(100, 210, 255, 0.6)',
};

export default function GameCanvas() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const mouseMovingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showIntro, setShowIntro] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [keys, setKeys] = React.useState<Set<string>>(new Set());
  const [isMouseMoving, setIsMouseMoving] = React.useState(false);

  const {
    planets,
    playerPosition,
    isIntroComplete,
    hoveredPlanet,
    canvasOpacity,
    userStats,
    loadPlanets,
    setPlayerPosition,
    setIntroComplete,
    setCanvasOpacity,
    checkPlanetProximity,
    handlePlanetInteraction,
  } = useGameStore();

  // Handle intro visibility
  useEffect(() => {
    if (session?.user?.email) {
      const hasSeenIntro = sessionStorage.getItem(
        `hasSeenIntro-${session.user.email}`,
      );
      setShowIntro(!hasSeenIntro);
      setCanvasOpacity(hasSeenIntro ? 1 : 0.6);
    }
  }, [session, setCanvasOpacity]);

  // canvas size and initial setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvasRef.current!.width = width;
      canvasRef.current!.height = height;
      setDimensions({ width, height });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Load planets when the dimensions change
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    loadPlanets(userStats.totalXP, dimensions.width, dimensions.height);
  }, [dimensions, userStats.totalXP, loadPlanets]);

  // Handle renderer setup and animation stuff
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!rendererRef.current) {
      rendererRef.current = GameRenderer.getInstance();
    }

    console.log("Animation values:", {
      username: session?.user?.name,
      userStats,
      canvasOpacity
    });

    ctx.globalAlpha = canvasOpacity;
    rendererRef.current.startAnimation({
      ctx,
      canvas,
      colors: GAME_COLORS,
      state: {
        planets,
        currentPlanet: null,
        playerPosition,
        isIntroComplete,
        username: session?.user?.name || 'Commander',
        userStats,
      },
    });

    return () => {
      rendererRef.current?.stopAnimation();
    };
  }, [planets, playerPosition, canvasOpacity, isIntroComplete, session?.user?.name, userStats]);

  const handleIntroComplete = useCallback(() => {
    if (session?.user?.email) {
      sessionStorage.setItem(`hasSeenIntro-${session.user.email}`, 'true');

      setTimeout(() => {
        let opacity = 0;
        const fadeInterval = setInterval(() => {
          opacity += 0.05;
          setCanvasOpacity(opacity);

          if (opacity >= 1) {
            clearInterval(fadeInterval);
            setShowIntro(false);
            setIntroComplete(true);
          }
        }, 50);
      }, 500);
    }
  }, [session, setCanvasOpacity, setIntroComplete]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      const newX = Math.max(
        20,
        Math.min(dimensions.width - 20, event.clientX - rect.left),
      );
      const newY = Math.max(
        20,
        Math.min(dimensions.height - 20, event.clientY - rect.top),
      );

      checkPlanetProximity(newX, newY);
      setPlayerPosition(newX, newY);

      setIsMouseMoving(true);
      if (mouseMovingTimeout.current) {
        clearTimeout(mouseMovingTimeout.current);
      }

      mouseMovingTimeout.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 100) as unknown as NodeJS.Timeout;
    },
    [dimensions, checkPlanetProximity, setPlayerPosition],
  );

  const handleSkipIntro = useCallback(() => {
    if (session?.user?.email) {
      sessionStorage.setItem(`hasSeenIntro-${session.user.email}`, 'true');
      // Fade in the canvas, Hide the intro, mark intro as complete in game state
      setCanvasOpacity(1);
      setShowIntro(false);
      setIntroComplete(true);
    }
  }, [session, setCanvasOpacity, setIntroComplete]);

  const handleCanvasClick = useCallback(
    (event: MouseEvent) => {
      if (!hoveredPlanet || !hoveredPlanet.isUnlocked) return;

      const rect = canvasRef.current!.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const distanceToPlayer = Math.sqrt(
        Math.pow(clickX - playerPosition.x, 2) +
          Math.pow(clickY - playerPosition.y, 2),
      );

      if (distanceToPlayer <= INTERACTION_RADIUS) {
        handlePlanetInteraction(hoveredPlanet);
        router.push(`/game/planets/${hoveredPlanet.id}`);
      }
    },
    [playerPosition, hoveredPlanet, handlePlanetInteraction, router],
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          'a',
          'w',
          's',
          'd',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
        ].includes(e.key)
      ) {
        setKeys(prev => new Set([...prev, e.key]));
      }

      // Space interaction
      if (e.code === 'Space' && hoveredPlanet) {
        const distanceToPlayer = Math.sqrt(
          Math.pow(playerPosition.x - hoveredPlanet.position.x, 2) +
            Math.pow(playerPosition.y - hoveredPlanet.position.y, 2),
        );

        if (
          distanceToPlayer <=
            hoveredPlanet.position.radius + INTERACTION_RADIUS &&
          hoveredPlanet.isUnlocked
        ) {
          handlePlanetInteraction(hoveredPlanet);
          router.push(`/game/planets/${hoveredPlanet.id}`);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set([...prev]);
        newKeys.delete(e.key);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hoveredPlanet, handlePlanetInteraction, playerPosition, router]);

  // loop for keyboard movement
  useEffect(() => {
    if (!dimensions.width) return;

    const updateGame = () => {
      if (!isMouseMoving && keys.size > 0) {
        let newX = playerPosition.x;
        let newY = playerPosition.y;

        if (keys.has('a') || keys.has('ArrowLeft')) newX -= SHIP_SPEED;
        if (keys.has('d') || keys.has('ArrowRight')) newX += SHIP_SPEED;
        if (keys.has('w') || keys.has('ArrowUp')) newY -= SHIP_SPEED;
        if (keys.has('s') || keys.has('ArrowDown')) newY += SHIP_SPEED;

        newX = Math.max(20, Math.min(dimensions.width - 20, newX));
        newY = Math.max(20, Math.min(dimensions.height - 20, newY));

        checkPlanetProximity(newX, newY);
        setPlayerPosition(newX, newY);
      }
    };

    const gameLoop = setInterval(updateGame, 1000 / 60);
    return () => clearInterval(gameLoop);
  }, [
    dimensions,
    keys,
    isMouseMoving,
    playerPosition,
    checkPlanetProximity,
    setPlayerPosition,
  ]);

  // Mouse event listeners
  useEffect(() => {
    if (!canvasRef.current || showIntro) return;

    const canvas = canvasRef.current;
    canvas.addEventListener('click', handleCanvasClick);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleCanvasClick, handleMouseMove, showIntro]);
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  return (
    <div className='fixed inset-0 bg-black'>
      {showIntro && (
        <div className='fixed inset-0 z-50'>
          <IntroCrawl onComplete={handleIntroComplete} />
        </div>
      )}

      <div className='fixed top-4 left-0 right-0 z-10 text-center'>
        <h1 className='font-mono text-yellow-400 text-2xl tracking-wider'>
          INTERGALACTIC CODE ACADEMY
        </h1>
      </div>

      <canvas
        ref={canvasRef}
        className='w-full h-full transition-opacity duration-500'
        style={{
          touchAction: 'none',
          opacity: canvasOpacity,
        }}
      />
      {showIntro && (
        <button
          className='fixed bottom-3 left-6 text-xs border border-solid border-black rounded text-blue-400 z-50'
          onClick={handleSkipIntro}
        >
          Abort Intro
        </button>
      )}
    </div>
  );
}
