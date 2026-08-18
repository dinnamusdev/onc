// @types
import { ChildrenProps } from '@/types/root';

// @project
import { AuthProvider } from '@/contexts/AuthContext';
import AdminLayout from '@/layouts/AdminLayout';
import AuthGuard from '@/utils/route-guard/AuthGuard';
import RoleGuard from '@/utils/route-guard/RoleGuard';

/***************************  LAYOUT - ADMIN  ***************************/

export default function Layout({ children }: ChildrenProps) {
  return (
    <AuthProvider>
      <AuthGuard>
        <RoleGuard>
          <AdminLayout>{children}</AdminLayout>
        </RoleGuard>
      </AuthGuard>
    </AuthProvider>
  );
}
