// @next
import dynamic from 'next/dynamic';

// @project
import GuestGuard from '@/utils/route-guard/GuestGuard';

const AuthLayout = dynamic(() => import('@/layouts/AuthLayout'));
const AuthLogin = dynamic(() => import('@/views/auth/login'));

/***************************  MAIN - DEFAULT PAGE  ***************************/

export default function Home() {
  return (
    <GuestGuard>
      <AuthLayout>
        <AuthLogin />
      </AuthLayout>
    </GuestGuard>
  );
}
