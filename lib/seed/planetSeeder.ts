import mongoose, { Model } from 'mongoose';
import PlanetSchema from '@/models/planet/schema';
import { IPlanet } from '@/types/models/planet';

const getPlanetModel = (): Model<IPlanet> => {
  try {
    return mongoose.model<IPlanet>('Planet');
  } catch {
    return mongoose.model<IPlanet>('Planet', PlanetSchema);
  }
};

export async function seedPlanets(planetsData: IPlanet[]): Promise<{ 
  success: boolean; 
  planets?: IPlanet[]; 
  error?: string; 
}> {
  const Planet = getPlanetModel();

  try {
    console.log(`Processing ${planetsData.length} planets for seeding`);
    await Planet.deleteMany({});
    
    const insertedPlanets = await Planet.insertMany(planetsData, { 
      lean: true 
    });
    
    console.log(`Successfully seeded ${insertedPlanets.length} planets`);
    
    return {
      success: true,
      planets: insertedPlanets,
    };
  } catch (error) {
    console.error('Error seeding planets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}