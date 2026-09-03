// @project
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

// @types
import { CreateUserRequest, UpdateUserRequest, UserListParams } from '@/types/users';

/***************************  USERS API FUNCTIONS  ***************************/

export async function getUsers(params?: UserListParams) {
  const queryParams = new URLSearchParams();
  if (params?.email) queryParams.append('email', params.email);
  if (params?.userName) queryParams.append('userName', params.userName);
  if (params?.cpf) queryParams.append('cpf', params.cpf);

  const url = queryParams.toString() ? `/api/users?${queryParams.toString()}` : '/api/users';
  return attempt(axiosServices.get(url));
}

export async function getUserById(id: string) {
  return attempt(axiosServices.get(`/api/users/${id}`));
}

export async function createUser(data: CreateUserRequest) {
  return attempt(axiosServices.post('/api/users', data));
}

export async function updateUser(data: UpdateUserRequest) {
  return attempt(axiosServices.put(`/api/users/${data.id}`, data));
}

export async function deleteUser(id: string) {
  return attempt(axiosServices.delete(`/api/users/${id}`));
}
