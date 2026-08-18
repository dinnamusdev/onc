// @next
import dynamic from 'next/dynamic';

// @types
import { ChildrenProps } from '@/types/root';

// @project
const AuthLayout = dynamic(() => import('@/layouts/AuthLayout'));

/***************************  LAYOUT - AUTH PAGES  ***************************/

export default function Layout({ children }: ChildrenProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
