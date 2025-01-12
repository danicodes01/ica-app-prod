import { PlanetPosition } from '@/types/game/canvas';

export const calculatePlanetPositions = (
  width: number,
  height: number,
): PlanetPosition[] => {
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.05;

  return [
    {
      x: centerX,
      y: centerY + height * 0.25,
      radius: baseRadius * 1.2,
    },
    {
      x: centerX + width * 0.25,
      y: centerY,
      radius: baseRadius * 1.1,
    },
    {
      x: centerX - width * 0.25,
      y: centerY,
      radius: baseRadius * 1.1,
    },
    {
      x: centerX,
      y: centerY - height * 0.25,
      radius: baseRadius * 1.3,
    },
  ];
};
