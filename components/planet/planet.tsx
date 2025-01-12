'use client'

import { useEffect } from "react"
import { useGameStore } from "@/store/useGameStore"
import { IDBStation } from "@/types/models/planet"

interface PlanetProps {
    id: string
}

export function Planet({id}: PlanetProps) {
    const {loadDBPlanets, getCurrentPlanet, dbPlanets } = useGameStore()

    useEffect(() => {
        const loadData = async () => {
            await loadDBPlanets();
        };
        
        if(dbPlanets.length === 0) {
            loadData();
        }
    }, [dbPlanets.length, loadDBPlanets])

    const planet = getCurrentPlanet(id);

    if(!planet) {
        return  <div>Loading...</div>
    }

    return (
        <div>
          <h1>{planet.name}</h1>
          <p>{planet.description}</p>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {planet.stations?.map((station: IDBStation) => (
              <div key={station.stationId} className="p-4 border rounded-lg">
                <h3>{station.name}</h3>
                <p>{station.description}</p>
                <div className="mt-2">
                  <span className="mr-4">XP: {station.xpReward}</span>
                  <span>Currency: {station.currencyReward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }