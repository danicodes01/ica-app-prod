import { model, models } from 'mongoose';
import PlanetSchema from './schema';
import { IPlanet } from '@/types/models/planet';

const Planet = (models?.Planet || model<IPlanet>('Planet', PlanetSchema));

export { Planet };