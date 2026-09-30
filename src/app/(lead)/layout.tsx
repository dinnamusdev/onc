// @next
import dynamic from 'next/dynamic';

// @types
import { ChildrenProps } from '@/types/root';

// @project
const LeadLayout = dynamic(() => import('@/layouts/LeadLayout'));

/***************************  LAYOUT - LEAD  ***************************/

export default function Layout({ children }: ChildrenProps) {
  return <LeadLayout>{children}</LeadLayout>;
}
