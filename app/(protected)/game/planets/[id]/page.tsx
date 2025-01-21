'use client';

import { Planet } from '@/components/planet/planet';
import { useParams } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/components/ui/loading';

export default function PlanetPage() {
  const { id } = useParams<{ id: string }>();
  const { 
    getCurrentPlanet, 
    dbPlanets, 
    loadDBPlanets,
    loadStationProgress 
  } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        if (!dbPlanets.length) {
          await loadDBPlanets();
        }
        
        const currentPlanet = getCurrentPlanet(id);
        if (currentPlanet) {
          // Load the station progress for this planet type
          await loadStationProgress(currentPlanet.type);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing planet data:', error);
        setIsLoading(false);
      }
    };

    initData();
  }, [dbPlanets.length, loadDBPlanets, getCurrentPlanet, id, loadStationProgress]);

  const planet = getCurrentPlanet(id);
  const loadingData = 'Planet Data 🪐';

  if (isLoading) {
    return <Loading loadingData={loadingData} />;
  }

  if (!planet) return notFound();

  return <Planet id={id} />;
}