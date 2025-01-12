'use server'

import connectDB from '@/lib/db/mongoose';
import { Planet } from '@/models';
import { IDBPlanet } from '@/types/models/planet';
import { Types } from 'mongoose';
import { PlanetType } from '@/types/shared/planetTypes';

interface LeanPlanet {
  _id: Types.ObjectId;
  name: string;
  type: PlanetType;
  description: string;
  requiredXP: number;
  order: number;
  stations?: {
    _id: Types.ObjectId;
    stationId: Types.ObjectId;
    name: string;
    description: string;
    order: number;
    xpReward: number;
    currencyReward: number;
    challenge: {
      instructions: string;
      initialCode: string;
      testCases: {
        input: unknown;
        expectedOutput: unknown;
      }[];
    };
  }[];
}

export async function getDBPlanets(): Promise<IDBPlanet[]> {
  try {
    await connectDB()
    const dbPlanets = await Planet.find({})
      .sort('order')
      .lean<LeanPlanet[]>();
    
    return dbPlanets.map(planet => ({
      _id: planet._id.toString(),
      name: planet.name,
      type: planet.type as PlanetType,
      description: planet.description,
      requiredXP: planet.requiredXP,
      order: planet.order,
      stations: planet.stations?.map(station => ({
        _id: station._id.toString(),
        stationId: station.stationId.toString(),
        name: station.name,
        description: station.description,
        order: station.order,
        xpReward: station.xpReward,
        currencyReward: station.currencyReward,
        challenge: station.challenge
      })) ?? []
    }));
  } catch (error) {
    console.error('Error fetching dbPlanets:', error);
    throw new Error('Failed to fetch dbPlanets');
  }
}
export async function getPlanetsForCanvas(): Promise<IDBPlanet[]> {
  try {
    await connectDB();
    const planets = await Planet.find({})
      .select('name type description requiredXP order')
      .sort('order')
      .lean<LeanPlanet[]>();
    return planets.map(planet => ({
      ...planet,
      _id: planet._id.toString(),
      type: planet.type as PlanetType,  
      stations: [] 
    }));
  } catch (error) {
    console.error('Error fetching planets:', error);
    throw new Error('Failed to fetch planets');
  }
}

export async function getPlanetWithStations(type: PlanetType): Promise<IDBPlanet | null> {
  try {
    await connectDB();
    const planet = await Planet.findOne({ type })
      .select('name type description requiredXP order stations')
      .lean<LeanPlanet>();
 
    if (!planet) {
      return null;
    }
 
    return {
      ...planet,
      _id: planet._id.toString(),
      type: planet.type as PlanetType,
      stations: planet.stations?.map(station => ({
        ...station,
        _id: station._id.toString(),
        stationId: station.stationId.toString()
      })) ?? []
    };
  } catch (error) {
    console.error('Error fetching planet with stations:', error);
    throw new Error('Failed to fetch planet');
  }
}

