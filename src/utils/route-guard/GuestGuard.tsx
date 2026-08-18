'use client';

// @next
import { useRouter } from 'next/navigation';

import { ReactNode, useEffect, useState } from 'react';

// @project
import PageLoader from '@/components/PageLoader';
import { APP_DEFAULT_PATH, AUTH_USER_KEY } from '@/config';

type Props = {
  children: ReactNode;
};

/***************************  GUEST GUARD  ***************************/

export default function GuestGuard({ children }: Props) {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const manageUserData = (localStorageData: string | null) => {
    const parsedAuthData = localStorageData ? JSON.parse(localStorageData) : null;
    if (parsedAuthData?.access_token) {
      router.replace(APP_DEFAULT_PATH);
    } else {
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
