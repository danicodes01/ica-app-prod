'use client';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { getUserStats } from '@/actions/user';
import Loading from '@/components/ui/loading';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { updateUserStats } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeGameState = async () => {
        const stats = await getUserStats();
      try {
        updateUserStats(stats.totalXP, stats.totalCurrency);
      } catch (error) {
        console.error('Failed to initialize game state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGameState();
  }, [updateUserStats]);

  if (isLoading) return <Loading />;
  
  return <>{children}</>;
}