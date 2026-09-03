/***************************  RBAC TYPES  ***************************/

export interface Role {
  id: string | number;
  name: string;
  description?: string;
  isSystem?: boolean;
  permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string | number;
  name?: string;
  subject?: string;
  resource?: string;
  action?: string;
  conditions?: string;
  fields?: string;
  description?: string;
  createdAt?: string;
}

export interface CreatePermissionRequest {
  subject?: string;
  action?: string;
  conditions?: string;
  fields?: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  id: string | number;
  subject?: string;
  action?: string;
  conditions?: string;
  fields?: string;
  description?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  isSystem?: boolean;
}

export interface UpdateRoleRequest {
  id: string | number;
  name?: string;
  description?: string;
  isSystem?: boolean;
}

export interface RolePermissionCreateRequest {
  roleId: string | number;
  permissions: (string | number)[];
}

export interface UserRoleRequest {
  userId: string;
  roles: (string | number)[];
}

export interface UserRolesResponse {
  userId: string;
  roles: number[];
}
