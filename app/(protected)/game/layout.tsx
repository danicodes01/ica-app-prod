'use client';

import { useGameStore } from '@/store/useGameStore';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserStats } from '@/types/store/slices'; 

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const initGame = useGameStore(state => state.initializeGameState);
  
  useEffect(() => {
    if (session?.user) {
      const stats: UserStats = {
        totalXP: session.user.totalXP,
        totalCurrency: session.user.totalCurrency
      };
      initGame(stats);
    }
  }, [session, initGame]);

  return <>{children}</>;
}