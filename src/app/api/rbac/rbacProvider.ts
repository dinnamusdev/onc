// @project
import { RBAC_PROVIDER } from '@/config';

interface RbacProvider {
  getRoles: (request: Request) => Promise<Response>;
  createRole: (request: Request) => Promise<Response>;
  updateRole: (request: Request) => Promise<Response>;
  deleteRole: (request: Request) => Promise<Response>;
  getPermissions: (request: Request) => Promise<Response>;
  createPermission: (request: Request) => Promise<Response>;
  updatePermission: (request: Request) => Promise<Response>;
  deletePermission: (request: Request) => Promise<Response>;
  assignPermission: (request: Request) => Promise<Response>;
  removePermission: (request: Request) => Promise<Response>;
  getUserRoles: (request: Request) => Promise<Response>;
  assignRolesToUser: (request: Request) => Promise<Response>;
}

const rbacProviderMapping: Record<string, () => Promise<RbacProvider>> = {
  mock: () => import('@/app/api/mock/rbac').then((mod) => mod.default as RbacProvider),
  onc: () => import('@/app/api/onc/rbac').then((mod) => mod.default as RbacProvider)
};

export async function rbacProvider() {
  return await rbacProviderMapping[RBAC_PROVIDER]();
}
