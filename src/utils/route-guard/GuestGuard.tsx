'use client';

// @next
import { useRouter } from 'next/navigation';

import { ReactNode, useEffect, useState } from 'react';

// @project
import PageLoader from '@/components/PageLoader';
import { APP_DEFAULT_PATH, AUTH_USER_KEY } from '@/config';
import { getTokenFromAuthData, isTokenExpired } from '@/utils/jwt';

type Props = {
  children: ReactNode;
};

/***************************  GUEST GUARD  ***************************/

export default function GuestGuard({ children }: Props) {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const manageUserData = (localStorageData: string | null) => {
    const parsedAuthData = localStorageData ? JSON.parse(localStorageData) : null;
    const token = getTokenFromAuthData(parsedAuthData);

    // Só considera autenticado se houver token E ele não estiver expirado.
    if (token && !isTokenExpired(token)) {
      router.replace(APP_DEFAULT_PATH);
    } else {
      // Token ausente ou expirado: limpa a sessão e mostra o login.
      if (parsedAuthData && typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_USER_KEY);
      }
      setIsChecked(true);
    }
  };

  useEffect(() => {
    const localStorageData = typeof window !== 'undefined' ? localStorage.getItem(AUTH_USER_KEY) : null;
    manageUserData(localStorageData);

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === AUTH_USER_KEY) {
        manageUserData(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isChecked) {
    return <PageLoader />;
  }

  return children;
}
