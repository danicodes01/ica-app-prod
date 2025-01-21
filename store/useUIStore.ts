// import { create } from 'zustand';

// interface UIState {
//   isMouseMoving: boolean;
//   activeKeys: Set<string>;
  
//   // Actions
//   setMouseMoving: (isMoving: boolean) => void;
//   addKey: (key: string) => void;
//   removeKey: (key: string) => void;
//   clearKeys: () => void;
// }

// export const useUIStore = create<UIState>()((set) => ({
//   isMouseMoving: false,
//   activeKeys: new Set(),

//   setMouseMoving: (isMoving) => 
//     set({ isMouseMoving }),

//   addKey: (key) =>
//     set((state) => ({
//       activeKeys: new Set([...state.activeKeys, key]),
//     })),

//   removeKey: (key) =>
//     set((state) => {
//       const newKeys = new Set(state.activeKeys);
//       newKeys.delete(key);
//       return { activeKeys: newKeys };
//     }),

//   clearKeys: () =>
//     set({ activeKeys: new Set() }),
// }));







////////////


// await get().loadPlanets(
//     stats.totalXP,
//     window.innerWidth,
//     window.innerHeight
//   );