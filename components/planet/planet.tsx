'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { IDBStation } from '@/types/models/planet';
import { PlanetType } from '@/types/shared/planetTypes';
import styles from '@/styles/modules/planet.module.css'

interface PlanetProps {
  id: string;
}

export function Planet({ id }: PlanetProps) {
  const {
    loadDBPlanets,
    getCurrentPlanet,
    dbPlanets,
    loadStationProgress,
    getStationStatus,
    updateStationProgress,
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

  const isStationAvailable = (stationOrder: number) => {
    if (stationOrder === 1) return true;
    const previousProgress = getStationStatus(
      planet.type as PlanetType,
      stationOrder - 1,
    );
    return previousProgress?.status === 'COMPLETED';
  };

  const handleStationClick = async (station: IDBStation) => {
    if (isPlanetLocked) {
      console.log(
        `Planet locked. Need ${planet.requiredXP - userStats.totalXP} more XP`,
      );
      return;
    }

    if (!isStationAvailable(station.order)) {
      console.log('Complete previous station first');
      return;
    }

    try {
      const result = await updateStationProgress(
        planet.type as PlanetType,
        station.order,
        true,
      );

      if (result.xpAwarded > 0) {
        console.log(`Congratulations! You earned ${result.xpAwarded} XP!`);
      } else {
        console.log('Station completed again! No new XP awarded.');
      }
    } catch (error) {
      console.error('Failed to update station progress:', error);
    }
  };

  const getStationClassName = (station: IDBStation) => {
    const progress = getStationStatus(planet.type as PlanetType, station.order);
    const available = isStationAvailable(station.order);

    let className = styles.stationCard;
    if (progress?.status === 'COMPLETED') {
        className += ` ${styles.completed}`;
    } else if (progress?.status === 'IN_PROGRESS') {
        className += ` ${styles.inProgress}`;
    }
    if (!available && progress?.status !== 'COMPLETED') {
        className += ` ${styles.locked}`;
    } else if (available) {
        className += ` ${styles.available}`;
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
              className={getStationClassName(station)}
              onClick={() => handleStationClick(station)}
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
                    <p>Current Attempts: {progress.currentAttempts}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
