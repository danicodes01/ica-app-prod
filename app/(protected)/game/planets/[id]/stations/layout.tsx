'use client';

import { useGameStore } from '@/store/useGameStore';
import { useParams } from 'next/navigation';
import type { PlanetType } from '@/types/shared/planetTypes';
import { useEffect } from 'react';

export default function StationLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { id: planetId } = useParams();
  const { getCurrentPlanet, loadStationProgress } = useGameStore();
  const planet = getCurrentPlanet(planetId as string);

  useEffect(() => {
    if (planet) {
      loadStationProgress(planet.type as PlanetType);
    }
  }, [planet, loadStationProgress]);

  return <>{children}</>;
}