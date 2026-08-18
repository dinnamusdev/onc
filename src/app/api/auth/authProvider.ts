// @project
import { AUTH_PROVIDER } from '@/config';

interface AuthProvider {
  login: (request: Request) => Promise<Response>;
  getUser: (requestOrToken: Request | string) => Promise<Response>;
  forgotPassword?: (request: Request) => Promise<Response>;
  resetPassword?: (request: Request) => Promise<Response>;
  signOut?: (request: Request) => Promise<Response>;
  signUp?: (request: Request) => Promise<Response>;
  verifyOtp?: (request: Request) => Promise<Response>;
  resend?: (request: Request) => Promise<Response>;
  getUserProfile?: (request: Request) => Promise<Response>;
}

// Mapping of auth types to dynamic imports
const authProviderMapping: Record<string, () => Promise<AuthProvider>> = {
  mock: () => import('@/app/api/mock/auth').then((mod) => mod.default as AuthProvider),
  onc: () => import('@/app/api/onc/auth').then((mod) => mod.default as AuthProvider)
};

// Dynamically loads and returns the auth provider based on AUTH_PROVIDER.
export async function authProvider() {
  return await authProviderMapping[AUTH_PROVIDER]();
}
