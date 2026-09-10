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
  console.log('updateRole (API client) - Enviando dados:', data);
  return attempt(axiosServices.put(`/api/rbac/roles/${data.id}`, data));
}

export async function deleteRole(id: string | number) {
  return attempt(axiosServices.delete(`/api/rbac/roles/${id}`));
}

export async function getPermissions() {
  return attempt(axiosServices.get('/api/rbac/permissions'));
}

export async function getSubjects() {
  return attempt(axiosServices.get('/api/rbac/subjects'));
}

export async function createSubject(data: { description: string }) {
  return attempt(axiosServices.post('/api/rbac/subjects', data));
}

export async function updateSubject(data: { id: string | number; description: string }) {
  return attempt(axiosServices.put(`/api/rbac/subjects?subjectId=${data.id}`, data));
}

export async function deleteSubject(id: string | number) {
  return attempt(axiosServices.delete(`/api/rbac/subjects?subjectId=${id}`));
}

export async function getActions() {
  return attempt(axiosServices.get('/api/rbac/actions'));
}

export async function createAction(data: { description: string }) {
  return attempt(axiosServices.post('/api/rbac/actions', data));
}

export async function updateAction(data: { id: string | number; description: string }) {
  return attempt(axiosServices.put(`/api/rbac/actions?actionId=${data.id}`, data));
}

export async function deleteAction(id: string | number) {
  return attempt(axiosServices.delete(`/api/rbac/actions?actionId=${id}`));
}

export async function createPermission(data: CreatePermissionRequest) {
  return attempt(axiosServices.post('/api/rbac/permission', data));
}

export async function updatePermission(data: UpdatePermissionRequest) {
  return attempt(axiosServices.put(`/api/rbac/permission?id=${data.id}`, data));
}

export async function deletePermission(id: string | number) {
  return attempt(axiosServices.delete(`/api/rbac/permission?id=${id}`));
}

export async function assignPermission(data: RolePermissionCreateRequest) {
  console.log('assignPermission (API client) - Enviando dados:', data);
  return attempt(axiosServices.post('/api/rbac/permissions', data));
}

export async function removePermission(data: RolePermissionCreateRequest) {
  return attempt(axiosServices.delete('/api/rbac/permissions', { data }));
}

export async function getUserRoles(userId: string) {
  return attempt(axiosServices.get(`/api/rbac/user-roles?userId=${userId}`));
}

export async function assignRolesToUser(data: UserRoleRequest) {
  console.log('assignRolesToUser (API client) - Enviando dados:', data);
  return attempt(axiosServices.post('/api/rbac/user-roles', data));
}
