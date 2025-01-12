import { create } from 'zustand';
import { GameState, Planet as CanvasPlanet, PlanetPosition } from '@/types/game/canvas';
import { transformPlanetToCanvas } from '@/utils/transformers';
import { calculatePlanetPositions } from '@/utils/planetPositions';
import { IDBPlanet } from '@/types/models/planet';
import { getPlanetsForCanvas, getDBPlanets } from '@/actions/planet';
import { GameRenderer } from '@/lib/game/renderer';

interface GameStore extends GameState {
  planets: CanvasPlanet[];
  dbPlanets: IDBPlanet[];
  loadDBPlanets: () => Promise<void>;
  loadPlanets: (userXP: number, width: number, height: number) => Promise<void>;
  setCurrentPlanet: (planetId: string | null) => void;
  setPlayerPosition: (x: number, y: number) => void;
  setIntroComplete: (complete: boolean) => void;
  hoveredPlanet: CanvasPlanet | null;
  setHoveredPlanet: (planet: CanvasPlanet | null) => void;
  canvasOpacity: number;
  setCanvasOpacity: (opacity: number) => void;
  checkPlanetProximity: (x: number, y: number) => void;
  handlePlanetInteraction: (planet: CanvasPlanet) => void;
  getCurrentPlanet: (id: string) => IDBPlanet | null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  planets: [],
  dbPlanets: [],
  currentPlanet: null,
  playerPosition: { x: 0, y: 0 },
  isIntroComplete: false,
  hoveredPlanet: null,
  canvasOpacity: 0,
  loadDBPlanets: async () => {
    try {
      const data = await getDBPlanets();
      set({ dbPlanets: data });
    } catch (error) {
      console.error('Failed to load DB planets:', error);
    }
  },

  getCurrentPlanet: (id: string) => {
    const planet = get().dbPlanets.find(planet => planet._id === id);
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

  // Game logic
  checkPlanetProximity: (x: number, y: number) => {
    const { planets } = get();
    const nearbyPlanet = planets.find(planet => {
      const dx = x - planet.position.x;
      const dy = y - planet.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const proximityThreshold = planet.position.radius + 30;
      return distance < proximityThreshold;
    });

    // Only update if the hovered planet has changed
    const currentHovered = get().hoveredPlanet;
    if ((currentHovered?.id || null) !== (nearbyPlanet?.id || null)) {
      set({ hoveredPlanet: nearbyPlanet || null });

      // Update the renderer's hovered state
      const renderer = GameRenderer.getInstance();
      renderer.setHoveredPlanet(nearbyPlanet?.id || null);
    }
  },

  handlePlanetInteraction: (planet: CanvasPlanet) => {
    if (!planet.isUnlocked) {
      console.log('Planet locked - Required XP:', planet.requiredXP);
      return;
    }
    // Router navigation will be handled in component
  }
}));