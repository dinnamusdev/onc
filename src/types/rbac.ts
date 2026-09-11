/***************************  RBAC TYPES  ***************************/

export interface Role {
  id: string | number;
  name: string;
  description?: string;
  isSystem?: boolean;
  // ONC retorna number[] (IDs); mock retorna Permission[]
  permissions?: (number | Permission)[];
  // ONC retorna string[] (UUIDs); mock retorna objetos completos
  users?: (string | { id: string | number; name: string; username?: string })[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string | number;
  name?: string;
  subject?: string;
  subjectId?: number;
  resource?: string;
  action?: string;
  actionId?: number;
  conditions?: string;
  fields?: string;
  description?: string;
  roles?: string[];
  createdAt?: string;
}

export interface CreatePermissionRequest {
  subjectId?: number;
  actionId?: number;
  conditions?: string;
  fields?: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  id: string | number;
  subjectId?: number;
  actionId?: number;
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
