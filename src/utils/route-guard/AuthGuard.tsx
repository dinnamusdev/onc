'use client';

// @next
import { usePathname, useRouter } from 'next/navigation';

import { ReactNode, useEffect } from 'react';

// @project
import PageLoader from '@/components/PageLoader';
import useCurrentUser from '@/hooks/useCurrentUser';

type Props = {
  children: ReactNode;
};

/***************************  AUTH GUARD  ***************************/

export default function AuthGuard({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { isProcessing, userData } = useCurrentUser();

  useEffect(() => {
    if (!isProcessing && (!userData || Object.keys(userData).length === 0) && pathname !== '/login') {
      router.replace('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, pathname, isProcessing]);

  if (isProcessing) return <PageLoader />;

  return userData && Object.keys(userData).length > 0 ? children : null;
}
