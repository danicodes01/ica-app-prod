'use client';

import Loading from '@/components/ui/loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated') {
      router.replace('/game');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  return null;
}