'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { IDBStation } from '@/types/models/planet';
import { PlanetType } from '@/types/shared/planetTypes';
import styles from './planet.module.css';
import { useRouter } from 'next/navigation';

interface PlanetProps {
  id: string;
}

export function Planet({ id }: PlanetProps) {
  const router = useRouter();
  const {
    loadDBPlanets,
    getCurrentPlanet,
    dbPlanets,
    loadStationProgress,
    getStationStatus,
    userStats,
  } = useGameStore();

  useEffect(() => {
    const loadData = async () => {
      await loadDBPlanets();
      const planet = getCurrentPlanet(id);
      if (planet) {
        await loadStationProgress(planet.type as PlanetType);
      }
    };

    if (dbPlanets.length === 0) {
      loadData();
    }
  }, [
    dbPlanets.length,
    loadDBPlanets,
    getCurrentPlanet,
    id,
    loadStationProgress,
  ]);

  const planet = getCurrentPlanet(id);

  if (!planet) {
    return <div>Loading...</div>;
  }

  const isPlanetLocked = userStats.totalXP < planet.requiredXP;

  console.log("PRogress@!: ", userStats.totalXP)
  

  const isStationAvailable = (stationOrder: number) => {
    if (stationOrder === 1) return true;
    
    const progress = getStationStatus(
      planet.type as PlanetType,
      stationOrder
    );
    
    const previousProgress = getStationStatus(
      planet.type as PlanetType,
      stationOrder - 1
    );
  
    // Check if station is locked
    if (progress?.status === 'LOCKED') return false;
    
    // Station is available if previous station is completed
    return previousProgress?.status === 'COMPLETED';
  };
  
  const handleStationClick = async (station: IDBStation) => {
    if (isPlanetLocked) {
      return; 
    }
  
    const progress = getStationStatus(
      planet.type as PlanetType,
      station.order
    );
  
    // user cant click locked stations
    if (progress?.status === 'LOCKED' || !isStationAvailable(station.order)) {
      return;
    }
  
    router.push(`/game/planets/${id}/stations/${station.stationId}`);
  };

  const getStationClassName = (station: IDBStation) => {
    const progress = getStationStatus(planet.type as PlanetType, station.order);
    const available = isStationAvailable(station.order);
  
    let className = styles.stationCard;
    
    if (progress?.status === 'LOCKED' || !available) {
      className += ` ${styles.locked} cursor-not-allowed`;
    } else if (progress?.status === 'COMPLETED') {
      className += ` ${styles.completed}`;
    } else if (progress?.status === 'IN_PROGRESS') {
      className += ` ${styles.inProgress}`;
    }
    
    return className;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{planet.name}</h1>
        <p className={styles.description}>{planet.description}</p>
        {isPlanetLocked && (
          <div className={styles.lockMessage}>
            Locked - Need {planet.requiredXP - userStats.totalXP} more XP to
            unlock
          </div>
        )}
      </div>

      <div className={styles.stationsGrid}>
        {planet.stations?.map((station: IDBStation) => {
          const progress = getStationStatus(
            planet.type as PlanetType,
            station.order,
          );
          const available = isStationAvailable(station.order);
          
          return (
            <div
            key={station.stationId}
            className={`${getStationClassName(station)} ${isPlanetLocked ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => !isPlanetLocked && handleStationClick(station)}
          >
              <h3 className={styles.stationTitle}>{station.name}</h3>
              <p className={styles.stationDescription}>{station.description}</p>

              <div className={styles.rewardsContainer}>
                <span className={styles.xpReward}>XP: {station.xpReward}</span>
                <span className={styles.currencyReward}>
                  Currency: {station.currencyReward}
                </span>
              </div>

              {!available && progress?.status !== 'COMPLETED' && (
                <div className={styles.lockMessage}>
                  Complete previous station to unlock
                </div>
              )}

              {progress && (
                <div className={styles.progressInfo}>
                  <p>Status: {progress.status}</p>
                  <p>Times Completed: {progress.timesCompleted}</p>
                  {progress.status === 'IN_PROGRESS' && (
                    <>
                      <p>Current Attempts: {progress.currentAttempts}</p>
                      {progress.currentAttempts >= 2 && station.order !== 1 && (
                        <p className='text-yellow-400'>
                          Warning: Next failed attempt will lock this station!
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className='flex justify-between items-center gap-4 mt-4 px-4'>
        <button
          onClick={() => router.push(`/game/`)}
          className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-mono'
        >
          Return to Space
        </button>
      </div>
    </div>
  );
}
