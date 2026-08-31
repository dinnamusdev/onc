// @next
import dynamic from 'next/dynamic';

// @project
const UsersPage = dynamic(() => import('@/views/admin/users'));

/***************************  USERS PAGE  ***************************/

export default function Users() {
  return <UsersPage />;
}
