'use client';

// @next
import { usePathname } from 'next/navigation';

import { ReactNode, useMemo } from 'react';

// @project
import PageLoader from '@/components/PageLoader';
import PermissionDenied from '@/components/PermissionDenied';
import useCurrentUser from '@/hooks/useCurrentUser';
import menuItems from '@/menu';

// @types
import { NavItemType } from '@/types/menu';

type RoleGuardProp = {
  children: ReactNode;
};

/***************************  ROLE GUARD  ***************************/

export default function RoleGuard({ children }: RoleGuardProp) {
  const pathname = usePathname();

  const { isProcessing, userData } = useCurrentUser();
  const currentRole = userData?.role; // 'admin' or 'user'

  const findParentElements = (navItems: NavItemType[], targetUrl: string, parents: NavItemType[] = []): NavItemType[] | null => {
    for (const item of navItems) {
      const newParents = [...parents, item];

      if (item.url === targetUrl) {
        return newParents;
      }

      if (item.children) {
        const result = findParentElements(item.children, targetUrl, newParents);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  const findMenu = (): NavItemType | undefined => {
    for (const menu of menuItems?.items ?? []) {
      if (menu.type === 'group') {
        const matchedParents = findParentElements(menu.children || [], pathname);
        if (matchedParents) {
          return matchedParents[0];
        }
      }
    }
    return undefined;
  };

  const activeItem = useMemo(() => {
    return findMenu();
  }, [pathname]);

  if (isProcessing) return <PageLoader />;

  if (activeItem?.roles?.length && currentRole && !activeItem.roles.includes(currentRole)) {
    return <PermissionDenied />;
  }

  return <>{children}</>;
}
