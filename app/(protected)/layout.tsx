// app/(protected)/layout.tsx
'use client';

import Loading from '@/components/ui/loading';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  if (status === 'loading') {
    return <Loading loadingData=', Checking Authentication 🤖'/>;
  }

  return <>{children}</>;
}