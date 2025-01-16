'use client';

import * as React from 'react'
import { Station } from '@/components/station/station';
import { useGameStore } from '@/store/useGameStore';
import { notFound } from 'next/navigation';
import { PlanetType } from '@/types/shared/planetTypes';

interface Props {
  params: Promise<{
    id: string;
    stationId: string;
  }>;
}

export default function StationPage({ params }: Props) {
  const { id: planetId, stationId } = React.use(params);
  const { getCurrentPlanet, userStats, getStationStatus } = useGameStore();

  const planet = getCurrentPlanet(planetId);
  if (!planet) return notFound();

  const station = planet.stations.find(s => s.stationId === stationId);
  if (!station) return notFound();

  // Check if station is accessible
  const isPlanetLocked = userStats.totalXP < planet.requiredXP;
  const isFirstStation = station.order === 1;
  const previousStation = planet.stations.find(s => s.order === station.order - 1);
  const isPreviousCompleted = previousStation 
    ? getStationStatus(planet.type as PlanetType, previousStation.order)?.status === 'COMPLETED' 
    : true;
  
  if (isPlanetLocked || (!isFirstStation && !isPreviousCompleted)) {
    return notFound();
  }

  return (
    <Station 
      planetId={planetId} 
      station={station} 
      planetType={planet.type as PlanetType}
    />
  );
}