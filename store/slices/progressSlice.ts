import { StateCreator } from 'zustand';
import { ProgressSlice, GameStore } from '@/types/store/slices';
import { PlanetType } from '@/types/shared/planetTypes';
import { IDBStation } from '@/types/models/planet';
import {
  getStationProgress,
  updateStationAttempt,
} from '@/actions/userProgress';

export const createProgressSlice: StateCreator<
  GameStore,
  [],
  [],
  ProgressSlice
> = (set, get) => ({
  stationProgress: {
    missionControl: [],
    chromanova: [],
    syntaxia: [],
    quantumCore: [],
  },
  userStats: {
    totalXP: 0,
    totalCurrency: 0,
  },
  currentStation: null,
  isNavigating: false,

  handleNavigation: (path: string) => {
    // using window.location to redirect for now
    // This could be improved later with a more sophisticated navigation system
    window.location.href = path;
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
            [planetType]: progress,
          },
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
    planetId: string,
  ) => {
    try {
      // Update attempt
      const result = await updateStationAttempt(
        planetType,
        stationOrder,
        succeeded,
      );

      // Get Progress
      const progress = await getStationProgress(planetType);
      console.log('[Store] Fresh progress after update:', progress);

      const updates: Partial<GameStore> = {
        stationProgress: {
          ...get().stationProgress,
          [planetType]: progress,
        },
        userStats: {
          totalXP: get().userStats.totalXP + (result.xpAwarded || 0),
          totalCurrency:
            get().userStats.totalCurrency + (result.currencyAwarded || 0),
        },
      };

      if (result.stationsLocked && result.resetToStation !== undefined) {
        const planet = get().getCurrentPlanet(get().currentPlanet || '');
        if (planet) {
          const resetStation = planet.stations.find(
            s => s.order === result.resetToStation,
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
          window.innerHeight,
        );
      }

      console.log('[Store] State updates completed');

      // Handle navigation after all updates are complete
      if (result.stationsLocked) {
        get().handleNavigation(`/game/planets/${planetId}`);
      }

      return result;
    } catch (error) {
      console.error('[Store] Failed to update station progress:', error);
      throw error;
    }
  },
  getStationStatus: (planetType: PlanetType, stationOrder: number) => {
    console.log('[Store] Getting station status:', {
      planetType,
      stationOrder,
    });
    const planetProgress = get().stationProgress[planetType];
    const status = planetProgress.find(p => p.stationOrder === stationOrder);
    console.log('[Store] Station status:', status);
    return status || null;
  },

  updateUserStats: (xp: number, currency: number) => {
    const state = get();
    if (!state.userStats) return;

    set(state => ({
      userStats: {
        totalXP: state.userStats.totalXP + xp,
        totalCurrency: state.userStats.totalCurrency + currency,
      },
    }));
  },
});
