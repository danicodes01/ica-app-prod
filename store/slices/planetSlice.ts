import { StateCreator } from 'zustand';
import { PlanetSlice, GameStore } from '@/types/store/slices';
import { IDBPlanet } from '@/types/models/planet';
import { getDBPlanets } from '@/actions/planet';
import { getUserStats } from '@/actions/user';

export const createPlanetSlice: StateCreator<GameStore, [], [], PlanetSlice> = 
  (set, get) => ({
    dbPlanets: [],
    currentPlanet: null,
    
    getCurrentPlanet: (id: string) => {
      return get().dbPlanets.find((planet: IDBPlanet) => planet._id === id) || null;
    },
  
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
  
  setCurrentPlanet: (planetId: string | null) => set({ currentPlanet: planetId })
});