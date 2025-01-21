'use client';

import Loading from '@/components/ui/loading';
import { useGameStore } from '@/store/useGameStore';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';

export default function PlanetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { loadDBPlanets, dbPlanets, isInitialized } =
    useGameStore();

    useEffect(() => {
      const init = async () => {
        if (!isInitialized && !dbPlanets.length) {
          await loadDBPlanets();
        }
        setIsLoading(false);
      };
  
      init();
    }, [isInitialized, loadDBPlanets, dbPlanets]);
  
    if (isLoading) {
      return <Loading loadingData=' Planet 👽'/>; 
    }
  
    return (
      <Suspense fallback={<Loading loadingData=' Planet 👽'/>}>
        {children}
      </Suspense>
    );
  }