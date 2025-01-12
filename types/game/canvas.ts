import { PlanetType } from '@/types/shared/planetTypes';

export interface Position {
  x: number;
  y: number;
}

export interface PlanetPosition extends Position {
  radius: number;
}

export interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  description: string;
  position: PlanetPosition;
  isUnlocked: boolean;
  requiredXP: number;
}

export interface GameState {
  planets: Planet[];
  currentPlanet: string | null;
  playerPosition: Position;
  isIntroComplete: boolean;
}

export interface GameColors {
  background: string;
  foreground: string;
  accent: string;
  glow: string;
}

export interface RenderOptions {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  colors: GameColors;
  state: GameState;
}

export interface StarOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  alpha: number;
}

export interface PlayerOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  colors: GameColors;
  isMoving: boolean;
}