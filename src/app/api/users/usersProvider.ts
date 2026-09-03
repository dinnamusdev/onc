// @project
import { USERS_PROVIDER } from '@/config';

interface UsersProvider {
  getUsers: (request: Request) => Promise<Response>;
  getUserById: (request: Request) => Promise<Response>;
  createUser: (request: Request) => Promise<Response>;
  updateUser: (request: Request) => Promise<Response>;
  deleteUser: (request: Request) => Promise<Response>;
}

const usersProviderMapping: Record<string, () => Promise<UsersProvider>> = {
  mock: () => import('@/app/api/mock/users').then((mod) => mod.default as UsersProvider),
  onc: () => import('@/app/api/onc/users').then((mod) => mod.default as UsersProvider)
};

export async function usersProvider() {
  return await usersProviderMapping[USERS_PROVIDER]();
}
