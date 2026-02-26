'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ClientOnly } from '@/components/ClientOnly';
import { AuthModal } from '@/components/AuthModal';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleClose = () => {
    router.push('/');
  };

  return (
    <ClientOnly>
      {!isAuthenticated && <AuthModal onClose={handleClose} />}
    </ClientOnly>
  );
}
