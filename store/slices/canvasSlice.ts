
import { CanvasSlice, CanvasPlanet, GameStore } from '@/types/store/slices';
import { GameRenderer } from '@/lib/game/renderer';
import { getPlanetsForCanvas } from '@/actions/planet';
import { calculatePlanetPositions } from '@/utils/planetPositions';
import { transformPlanetToCanvas } from '@/utils/transformers';
import { StateCreator } from 'zustand';

export const createCanvasSlice: StateCreator<GameStore, [], [], CanvasSlice> = 
  (set, get) => ({
    planets: [],
    playerPosition: { x: 0, y: 0 },
    hoveredPlanet: null,
    canvasOpacity: 0,
    isIntroComplete: false,

  loadPlanets: async (userXP: number, width: number, height: number) => {
    try {
      const dbPlanets = await getPlanetsForCanvas();
      const positions = calculatePlanetPositions(width, height);
      const canvasPlanets = dbPlanets.map((dbPlanet, index) => 
        transformPlanetToCanvas(dbPlanet, positions[index], userXP)
      );
      set({ planets: canvasPlanets });
    } catch (error) {
      console.error('Failed to load planets:', error);
    }
  },

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
    if (!planet.isUnlocked) return;
  }
});