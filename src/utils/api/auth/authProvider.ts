// @project
import { AUTH_PROVIDER } from '@/config';

// @types
import { LoginFormData } from '@/types/auth';

export interface AuthProvider {
  login: (formData: LoginFormData) => Promise<Response>;
  signOut: () => Promise<Response>;
}

// Mapping of auth types to dynamic imports — ONC uses server-side API routes, no client provider needed
const authProviderMapping: Record<string, () => Promise<AuthProvider>> = {};

// Dynamically loads and returns the auth provider based on AUTH_PROVIDER.
export async function authProvider() {
  return await authProviderMapping[AUTH_PROVIDER]();
}
