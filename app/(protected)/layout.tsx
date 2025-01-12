'use client';

import Loading from '@/components/ui/loading';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return <>{children}</>;
}