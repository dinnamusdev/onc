// @project
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

// @types
import {
  CreateRoleRequest,
  UpdateRoleRequest,
  RolePermissionCreateRequest,
  UserRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest
} from '@/types/rbac';

/***************************  RBAC API FUNCTIONS  ***************************/

export async function getRoles() {
  return attempt(axiosServices.get('/api/rbac/roles'));
}

export async function createRole(data: CreateRoleRequest) {
  return attempt(axiosServices.post('/api/rbac/roles', data));
}

export async function updateRole(data: UpdateRoleRequest) {
  return attempt(axiosServices.put(`/api/rbac/roles/${data.id}`, data));
}

export async function deleteRole(id: string | number) {
  return attempt(axiosServices.delete(`/api/rbac/roles/${id}`));
}

export async function getPermissions() {
  return attempt(axiosServices.get('/api/rbac/permissions'));
}

export async function createPermission(data: CreatePermissionRequest) {
  return attempt(axiosServices.post('/api/rbac/permission', data));
}

export async function updatePermission(data: UpdatePermissionRequest) {
  return attempt(axiosServices.put('/api/rbac/permission', data));
}

export async function deletePermission(id: string | number) {
  return attempt(axiosServices.delete(`/api/rbac/permission?id=${id}`));
}

export async function assignPermission(data: RolePermissionCreateRequest) {
  return attempt(axiosServices.post('/api/rbac/permissions', data));
}

export async function removePermission(data: RolePermissionCreateRequest) {
  return attempt(axiosServices.delete('/api/rbac/permissions', { data }));
}

export async function getUserRoles(userId: string) {
  return attempt(axiosServices.get(`/api/rbac/user-roles?userId=${userId}`));
}

export async function assignRolesToUser(data: UserRoleRequest) {
  return attempt(axiosServices.post('/api/rbac/user-roles', data));
}
