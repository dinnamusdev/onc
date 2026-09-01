// @next
import dynamic from 'next/dynamic';

// @project
const RolesPermissionsPage = dynamic(() => import('@/views/admin/roles-permissions'));

/***************************  ROLES & PERMISSIONS PAGE  ***************************/

export default function RolesPermissions() {
  return <RolesPermissionsPage />;
}
