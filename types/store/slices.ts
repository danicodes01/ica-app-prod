import { StateCreator } from 'zustand';
import { GameState, Planet, Position } from '@/types/game/canvas';
import { IDBPlanet, IDBStation } from '@/types/models/planet';
import { ISerializedUserProgress } from '@/types/models/userProgress';
import { PlanetType } from '@/types/shared/planetTypes';

export type CanvasPlanet = Planet; 

export interface UserStats {
  totalXP: number;
  totalCurrency: number;
}

export type StoreSlice<T> = StateCreator<GameStore, [], [], T>;


export interface StationAttemptResult {
  progress: ISerializedUserProgress;
  xpAwarded: number;
  currencyAwarded: number;
  stationsLocked: boolean;
  resetToStation?: number;
}

export interface PlanetSlice {
  dbPlanets: IDBPlanet[];
  currentPlanet: string | null;
  getCurrentPlanet: (id: string) => IDBPlanet | null;
  loadDBPlanets: () => Promise<void>;
  setCurrentPlanet: (planetId: string | null) => void;
}

export interface CanvasSlice {
  planets: CanvasPlanet[];
  playerPosition: Position;
  hoveredPlanet: CanvasPlanet | null;
  canvasOpacity: number;
  isIntroComplete: boolean;
  loadPlanets: (userXP: number, width: number, height: number) => Promise<void>;
  setPlayerPosition: (x: number, y: number) => void;
  setIntroComplete: (complete: boolean) => void;
  setHoveredPlanet: (planet: CanvasPlanet | null) => void;
  setCanvasOpacity: (opacity: number) => void;
  checkPlanetProximity: (x: number, y: number) => void;
  handlePlanetInteraction: (planet: CanvasPlanet) => void;
}

export interface ProgressSlice {
  stationProgress: Record<PlanetType, ISerializedUserProgress[]>;
  userStats: UserStats;
  currentStation: IDBStation | null;
  isNavigating: boolean;
  handleNavigation: (path: string) => void;
  loadStationProgress: (planetType: PlanetType) => Promise<void>;
  setCurrentStation: (station: IDBStation | null) => void;
  updateStationProgress: (
    planetType: PlanetType,
    stationOrder: number,
    succeeded: boolean,
    planetId: string
  ) => Promise<StationAttemptResult>;
  getStationStatus: (planetType: PlanetType, stationOrder: number) => ISerializedUserProgress | null;
  updateUserStats: (xp: number, currency: number) => void;
}

export interface GameStore extends GameState, PlanetSlice, CanvasSlice, ProgressSlice {
  isInitialized: boolean;
  initializeGameState: (stats: UserStats) => Promise<void>;
}