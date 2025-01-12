import { planets } from './planets';
import { IPlanet } from '@/types/models/planet';

export interface SeedData {
  planets: IPlanet[];
}

export const seedData: SeedData = {
  planets,
};

export {
  planets,
};
