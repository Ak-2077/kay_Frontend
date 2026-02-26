'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ClientOnly } from '@/components/ClientOnly';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (!token && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, token, router]);

  if (!token && !isAuthenticated) {
    return null;
  }

  return (
    <ClientOnly>
      {children}
    </ClientOnly>
  );
}
