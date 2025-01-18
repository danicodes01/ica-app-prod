import { create } from 'zustand';
import { GameState, Planet as CanvasPlanet, PlanetPosition } from '@/types/game/canvas';
import { transformPlanetToCanvas } from '@/utils/transformers';
import { calculatePlanetPositions } from '@/utils/planetPositions';
import { IDBPlanet, IDBStation } from '@/types/models/planet';
import { getPlanetsForCanvas, getDBPlanets } from '@/actions/planet';
import { getStationProgress, updateStationAttempt } from '@/actions/userProgress';
import { GameRenderer } from '@/lib/game/renderer';
import { ISerializedUserProgress } from '@/types/models/userProgress';
import { PlanetType } from '@/types/shared/planetTypes';
import { getUserStats } from '@/actions/user';

interface UserStats {
  totalXP: number;
  totalCurrency: number;
}

interface StationAttemptResult {
  progress: ISerializedUserProgress;
  xpAwarded: number;
  currencyAwarded: number;
  stationsLocked: boolean;
  resetToStation?: number;
}

interface GameStore extends GameState {
  planets: CanvasPlanet[];
  dbPlanets: IDBPlanet[];
  currentPlanet: string | null;
  playerPosition: { x: number; y: number };
  isIntroComplete: boolean;
  hoveredPlanet: CanvasPlanet | null;
  canvasOpacity: number;
  isNavigating: boolean;

  stationProgress: Record<PlanetType, ISerializedUserProgress[]>;
  userStats: UserStats;
  currentStation: IDBStation | null;
  

  loadDBPlanets: () => Promise<void>;
  loadPlanets: (userXP: number, width: number, height: number) => Promise<void>;
  setCurrentPlanet: (planetId: string | null) => void;
  setPlayerPosition: (x: number, y: number) => void;
  setIntroComplete: (complete: boolean) => void;
  setHoveredPlanet: (planet: CanvasPlanet | null) => void;
  setCanvasOpacity: (opacity: number) => void;
  checkPlanetProximity: (x: number, y: number) => void;
  handlePlanetInteraction: (planet: CanvasPlanet) => void;
  getCurrentPlanet: (id: string) => IDBPlanet | null;
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

export const useGameStore = create<GameStore>((set, get) => ({
  planets: [],
  dbPlanets: [],
  currentPlanet: null,
  playerPosition: { x: 0, y: 0 },
  isIntroComplete: false,
  hoveredPlanet: null,
  canvasOpacity: 0,

  stationProgress: {
    missionControl: [],
    chromanova: [],
    syntaxia: [],
    quantumCore: []
  },
  userStats: {
    totalXP: 0,
    totalCurrency: 0
  },
  currentStation: null,
  isNavigating: false,

  loadDBPlanets: async () => {
    try {
      const [planets, stats] = await Promise.all([
        getDBPlanets(),
        getUserStats()
      ]);
      
      set({ 
        dbPlanets: planets,
        userStats: {
          totalXP: stats.totalXP,
          totalCurrency: stats.totalCurrency
        }
      });
  
      await get().loadPlanets(
        stats.totalXP,
        window.innerWidth,
        window.innerHeight
      );
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  },

  getCurrentPlanet: (id: string) => {
    console.log('[Store] Getting current planet:', id);
    const planet = get().dbPlanets.find(planet => planet._id === id);
    console.log('[Store] Found planet:', planet?.type);
    return planet || null;
  },

  loadPlanets: async (userXP: number, width: number, height: number) => {
    try {
      const dbPlanets = await getPlanetsForCanvas();
      const positions: PlanetPosition[] = calculatePlanetPositions(width, height);

      const canvasPlanets: CanvasPlanet[] = dbPlanets.map((dbPlanet: IDBPlanet, index: number) => 
        transformPlanetToCanvas(
          dbPlanet,
          positions[index],
          userXP
        )
      );

      set({ planets: canvasPlanets });
    } catch (error) {
      console.error('Failed to load planets:', error);
    }
  },

  setCurrentPlanet: (planetId: string | null) => set({ currentPlanet: planetId }),
  setPlayerPosition: (x: number, y: number) => set({ playerPosition: { x, y } }),
  setIntroComplete: (complete: boolean) => set({ isIntroComplete: complete }),
  setHoveredPlanet: (planet: CanvasPlanet | null) => set({ hoveredPlanet: planet }),
  setCanvasOpacity: (opacity: number) => set({ canvasOpacity: opacity }),

  checkPlanetProximity: (x: number, y: number) => {
    const { planets } = get();
    const nearbyPlanet = planets.find(planet => {
      const dx = x - planet.position.x;
      const dy = y - planet.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const proximityThreshold = planet.position.radius + 30;
      return distance < proximityThreshold;
    });

    const currentHovered = get().hoveredPlanet;
    if ((currentHovered?.id || null) !== (nearbyPlanet?.id || null)) {
      set({ hoveredPlanet: nearbyPlanet || null });
      const renderer = GameRenderer.getInstance();
      renderer.setHoveredPlanet(nearbyPlanet?.id || null);
    }
  },

  handlePlanetInteraction: (planet: CanvasPlanet) => {
    if (!planet.isUnlocked) {
      return;
    }
  },

  loadStationProgress: async (planetType: PlanetType) => {
    console.log(`[Store] Loading station progress for ${planetType}`);
    try {
      const progress = await getStationProgress(planetType);
      console.log(`[Store] Received progress for ${planetType}:`, progress);
      set(state => {
        console.log('[Store] Updating station progress state');
        return {
          stationProgress: {
            ...state.stationProgress,
            [planetType]: progress
          }
        };
      });
    } catch (error) {
      console.error('[Store] Failed to load station progress:', error);
    }
  },

  setCurrentStation: (station: IDBStation | null) => {
    console.log('[Store] Setting current station:', station);
    set({ currentStation: station });
  },

  updateStationProgress: async (
    planetType: PlanetType,
    stationOrder: number,
    succeeded: boolean,
    planetId: string
  ) => {
    console.log(`[Store] Starting updateStationProgress:`, {
      planetType,
      stationOrder,
      succeeded
    });
    try {
      const result = await updateStationAttempt(
        planetType,
        stationOrder,
        succeeded
      );
      const progress = await getStationProgress(planetType);
      
      const updates: Partial<GameStore> = {
        stationProgress: {
          ...get().stationProgress,
          [planetType]: progress
        },
        userStats: {
          totalXP: get().userStats.totalXP + (result.xpAwarded || 0),
          totalCurrency: get().userStats.totalCurrency + (result.currencyAwarded || 0)
        },
      };
  
      if (result.stationsLocked && result.resetToStation !== undefined) {
        const planet = get().getCurrentPlanet(get().currentPlanet || '');
        if (planet) {
          const resetStation = planet.stations.find(
            s => s.order === result.resetToStation
          );
          if (resetStation) {
            updates.currentStation = resetStation;
          }
        }
      }
  
      set(updates);
  
      const { planets } = get();
      if (planets.length > 0) {
        await get().loadPlanets(
          get().userStats.totalXP,
          window.innerWidth,
          window.innerHeight
        );
      }
  
      console.log('[Store] State updates completed');

      // Handle navigation after all updates are complete
      if (result.stationsLocked) {
        set({isNavigating: true});
        window.location.href = `/game/planets/${planetId}`;
      }

      return result;
    } catch (error) {
      console.error('[Store] Failed to update station progress:', error);
      throw error;
    }
  },
  getStationStatus: (planetType: PlanetType, stationOrder: number) => {
    console.log('[Store] Getting station status:', { planetType, stationOrder });
    const planetProgress = get().stationProgress[planetType];
    const status = planetProgress.find(p => p.stationOrder === stationOrder);
    console.log('[Store] Station status:', status);
    return status || null;
  },

  updateUserStats: (xp: number, currency: number) => {
    console.log('[Store] Updating user stats:', { xp, currency });
    set(state => ({
      userStats: {
        totalXP: state.userStats.totalXP + xp,
        totalCurrency: state.userStats.totalCurrency + currency
      }
    }));
  }
}));