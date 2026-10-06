// @next
import dynamic from 'next/dynamic';

// @project
const LeadsPage = dynamic(() => import('@/views/admin/leads'));

/***************************  LEADS PAGE  ***************************/

export default function Leads() {
  return <LeadsPage />;
}
