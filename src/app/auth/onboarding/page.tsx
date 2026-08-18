// @next
import dynamic from 'next/dynamic';

// @project
const AuthOnboarding = dynamic(() => import('@/views/auth/onboarding'));

/***************************  AUTH - ONBOARDING  ***************************/

export default function Onboarding() {
  return <AuthOnboarding />;
}
