'use client';

import { Suspense } from 'react';
import GameCanvas from '@/components/game/canvas';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/loading';
import { signOut } from 'next-auth/react';

export default function GamePage() {
    const router = useRouter()
  return (
    <Suspense fallback={<Loading loadingData=' Galaxy'/>}>
      <GameCanvas />
      <button
        className="fixed bottom-3 right-6 text-xs border border-solid border-black rounded text-blue-400 z-50"
        onClick={async () => {
          sessionStorage.clear();
          await signOut({ redirect: true });
          router.replace('/login');
        }}
      >
        Sign Out
      </button>
    </Suspense>
  );
}