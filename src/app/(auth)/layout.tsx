// @next
import dynamic from 'next/dynamic';

// @types
import { ChildrenProps } from '@/types/root';

// @project
const AuthLayout = dynamic(() => import('@/layouts/AuthLayout'));
const GuestGuard = dynamic(() => import('@/utils/route-guard/GuestGuard'));

/***************************  LAYOUT - AUTH  ***************************/

export default function Layout({ children }: ChildrenProps) {
  return (
    <GuestGuard>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  );
}
