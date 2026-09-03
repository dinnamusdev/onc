// @next
import dynamic from 'next/dynamic';

// @project
const ProfilePage = dynamic(() => import('@/views/admin/profile'));

/***************************  PROFILE PAGE  ***************************/

export default function Profile() {
  return <ProfilePage />;
}
