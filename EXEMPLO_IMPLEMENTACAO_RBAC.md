# Exemplo Prático - Implementação RBAC Provider

## 📁 Estrutura de Arquivos

```
src/
├── enum.ts                          (adicionar ProviderType)
├── config.ts                        (adicionar RBAC_PROVIDER)
├── types/
│   └── rbac.ts                      (novo - tipos RBAC)
├── app/
│   └── api/
│       └── rbac/                    (novo)
│           ├── rbacProvider.ts      (factory)
│           ├── mock/
│           │   ├── index.ts         (implementação mock)
│           │   ├── roles.ts         (dados mock)
│           │   └── permissions.ts   (dados mock)
│           └── onc/
│               └── index.ts         (implementação ONC)
└── utils/
    └── api/
        └── rbac/                    (novo)
            └── index.ts             (funções de API)
```

## 🔧 Implementação Passo a Passo

### 1. Adicionar Enum

```typescript
// src/enum.ts
export enum AuthType {
  MOCK = 'mock',
  ONC = 'onc',
  FIREBASE = 'firebase',
  SUPABASE = 'supabase'
}

// NOVO: Provider genérico para outros domínios
export enum ProviderType {
  MOCK = 'mock',
  ONC = 'onc',
  FIREBASE = 'firebase',
  SUPABASE = 'supabase'
}
```

### 2. Atualizar Config

```typescript
// src/config.ts
export const AUTH_PROVIDER: AuthType = AuthType.ONC;

// NOVO: Provider para RBAC
export const RBAC_PROVIDER: ProviderType = ProviderType.MOCK; // Começar com mock
```

### 3. Criar Tipos RBAC

```typescript
// src/types/rbac.ts
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleRequest extends CreateRoleRequest {
  id: string;
}

export interface AssignPermissionRequest {
  roleId: string;
  permissionId: string;
}
```

### 4. Criar rbacProvider (Factory)

```typescript
// src/app/api/rbac/rbacProvider.ts
// @project
import { RBAC_PROVIDER } from '@/config';

interface RbacProvider {
  getRoles: (request: Request) => Promise<Response>;
  createRole: (request: Request) => Promise<Response>;
  updateRole: (request: Request) => Promise<Response>;
  deleteRole: (request: Request) => Promise<Response>;
  getPermissions: (request: Request) => Promise<Response>;
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
```

### 5. Criar Mock Data

```typescript
// src/app/api/mock/rbac/roles.ts
import { Role } from '@/types/rbac';

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access',
    permissions: ['*'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Limited administrative access',
    permissions: ['users.read', 'users.write', 'roles.read'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'User',
    description: 'Standard user access',
    permissions: ['users.read'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
```

```typescript
// src/app/api/mock/rbac/permissions.ts
import { Permission } from '@/types/rbac';

export const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'users.read',
    resource: 'users',
    action: 'read',
    description: 'Can read user data'
  },
  {
    id: '2',
    name: 'users.write',
    resource: 'users',
    action: 'write',
    description: 'Can create and update users'
  },
  {
    id: '3',
    name: 'users.delete',
    resource: 'users',
    action: 'delete',
    description: 'Can delete users'
  },
  {
    id: '4',
    name: 'roles.read',
    resource: 'roles',
    action: 'read',
    description: 'Can read roles'
  },
  {
    id: '5',
    name: 'roles.write',
    resource: 'roles',
    action: 'write',
    description: 'Can create and update roles'
  },
  {
    id: '6',
    name: 'roles.delete',
    resource: 'roles',
    action: 'delete',
    description: 'Can delete roles'
  }
];
```

### 6. Criar Mock Implementation

```typescript
// src/app/api/mock/rbac/index.ts
import { NextResponse } from 'next/server';
import { mockRoles } from './roles';
import { mockPermissions } from './permissions';
import { Role, CreateRoleRequest } from '@/types/rbac';

// In-memory storage for mock operations
let roles = [...mockRoles];

export async function getRoles(request: Request) {
  return NextResponse.json(roles, { status: 200 });
}

export async function createRole(request: Request) {
  try {
    const body: CreateRoleRequest = await request.json();

    const newRole: Role = {
      id: (roles.length + 1).toString(),
      name: body.name,
      description: body.description,
      permissions: body.permissions.map(id => ({
        id,
        name: id,
        resource: id.split('.')[0],
        action: id.split('.')[1],
        description: `Permission ${id}`
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    roles.push(newRole);

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function updateRole(request: Request) {
  try {
    const body: CreateRoleRequest & { id: string } = await request.json();
    const index = roles.findIndex(r => r.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    roles[index] = {
      ...roles[index],
      name: body.name,
      description: body.description,
      permissions: body.permissions.map(id => ({
        id,
        name: id,
        resource: id.split('.')[0],
        action: id.split('.')[1],
        description: `Permission ${id}`
      })),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(roles[index], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function deleteRole(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Role ID required' }, { status: 400 });
    }

    const index = roles.findIndex(r => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    roles.splice(index, 1);

    return NextResponse.json({ message: 'Role deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function getPermissions(request: Request) {
  return NextResponse.json(mockPermissions, { status: 200 });
}

export async function assignPermission(request: Request) {
  try {
    const body = await request.json();
    const { roleId, permissions } = body;

    const role = roles.find(r => r.id === roleId);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Atualiza todas as permissions do role
    role.permissions = permissions.map((permId: string) => {
      const permission = mockPermissions.find(p => p.id === permId);
      return permission || {
        id: permId,
        name: permId,
        resource: permId.split('.')[0],
        action: permId.split('.')[1],
        description: `Permission ${permId}`
      };
    });

    return NextResponse.json(role, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function removePermission(request: Request) {
  try {
    const body = await request.json();
    const { roleId, permissions } = body;

    const role = roles.find(r => r.id === roleId);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Atualiza permissions removendo as não selecionadas
    role.permissions = permissions.map((permId: string) => {
      const permission = mockPermissions.find(p => p.id === permId);
      return permission || {
        id: permId,
        name: permId,
        resource: permId.split('.')[0],
        action: permId.split('.')[1],
        description: `Permission ${permId}`
      };
    });

    return NextResponse.json(role, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// NOVO: User-Roles endpoints para mock
export async function getUserRoles(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Mock: retorna roles baseado no userId
    const userRoles = userId === '1' ? [1, 2] : [3]; // Exemplo

    return NextResponse.json(userRoles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function assignRolesToUser(request: Request) {
  try {
    const body = await request.json();
    // Mock: apenas retorna sucesso
    return NextResponse.json({ success: true, roles: body.roles }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

const mockRbac = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  assignPermission,
  removePermission,
  getUserRoles,
  assignRolesToUser
};

export default mockRbac;
```

### 7. Criar ONC Implementation

```typescript
// src/app/api/onc/rbac/index.ts
import { NextResponse } from 'next/server';

const ONC_API = process.env.ONC_API_BASE_URL;

export async function getRoles(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    // NOTA: Swagger não mostra GET para roles, implementar se necessário
    // Por enquanto, vamos usar role-by-id individualmente ou mock
    const res = await fetch(`${ONC_API}/auth/api/Permission/role-by-id`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to fetch roles' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : [data], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function createRole(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/Permission/roles`, {
      method: 'POST',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: body.name,
        description: body.description,
        isSystem: false
      })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to create role' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function updateRole(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    const { id, ...updateData } = body;

    const res = await fetch(`${ONC_API}/auth/api/Permission/roles?roleId=${id}`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to update role' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function deleteRole(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const res = await fetch(`${ONC_API}/auth/api/Permission/roles?roleId=${id}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to delete role' },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: 'Role deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function getPermissions(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    const res = await fetch(`${ONC_API}/auth/api/Permission/permissions`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to fetch permissions' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function assignPermission(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    // Swagger: PUT /auth/api/Permission/role-permissions
    // Body: array of RolePermissionCreateDTO
    const rolePermissions = body.permissions.map((permId: number) => ({
      role_id: body.roleId,
      permission_id: permId,
      effect: 'allow' // obrigatório pelo schema
    }));

    const res = await fetch(`${ONC_API}/auth/api/Permission/role-permissions`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rolePermissions)
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to assign permission' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function removePermission(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    // NOTA: Swagger não mostra DELETE específico para remover permission
    // A estratégia é re-enviar o array completo sem a permission removida
    const rolePermissions = body.permissions.map((permId: number) => ({
      role_id: body.roleId,
      permission_id: permId,
      effect: 'allow'
    }));

    const res = await fetch(`${ONC_API}/auth/api/Permission/role-permissions`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rolePermissions)
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to remove permission' },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: 'Permission removed' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// NOVO: User-Roles endpoints (descobertos no swagger)
export async function getUserRoles(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const res = await fetch(`${ONC_API}/auth/api/Permission/user-roles-by-userId?userId=${userId}`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to fetch user roles' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function assignRolesToUser(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    // Swagger: PUT /auth/api/Permission/user-roles
    // Body: array of UserRoleCreateDTO
    const userRoles = body.roles.map((roleId: number) => ({
      user_id: body.userId,
      role_id: roleId
    }));

    const res = await fetch(`${ONC_API}/auth/api/Permission/user-roles`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userRoles)
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.message || error?.title || 'Failed to assign roles to user' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

const oncRbac = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  assignPermission,
  removePermission,
  getUserRoles,
  assignRolesToUser
};

export default oncRbac;
```

### 8. Criar API Routes

```typescript
// src/app/api/rbac/roles/route.ts
import { rbacProvider } from '../../rbacProvider';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.getRoles(request);
}

export async function POST(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.createRole(request);
}
```

```typescript
// src/app/api/rbac/roles/[id]/route.ts
import { rbacProvider } from '../../../rbacProvider';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.updateRole(request);
}

export async function DELETE(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.deleteRole(request);
}
```

```typescript
// src/app/api/rbac/permissions/route.ts
import { rbacProvider } from '../../rbacProvider';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.getPermissions(request);
}

export async function POST(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.assignPermission(request);
}
```

### 9. Criar Utils Layer

```typescript
// src/utils/api/rbac/index.ts
// @project
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

// @types
import { Role, CreateRoleRequest, UpdateRoleRequest, Permission } from '@/types/rbac';

export async function getRoles() {
  return attempt(axiosServices.get('/api/rbac/roles'));
}

export async function createRole(data: CreateRoleRequest) {
  return attempt(axiosServices.post('/api/rbac/roles', data));
}

export async function updateRole(data: UpdateRoleRequest) {
  return attempt(axiosServices.put(`/api/rbac/roles/${data.id}`, data));
}

export async function deleteRole(id: string) {
  return attempt(axiosServices.delete(`/api/rbac/roles/${id}`));
}

export async function getPermissions() {
  return attempt(axiosServices.get('/api/rbac/permissions'));
}

export async function assignPermission(roleId: string, permissions: number[]) {
  return attempt(axiosServices.post('/api/rbac/permissions', { roleId, permissions }));
}

export async function removePermission(roleId: string, permissions: number[]) {
  return attempt(axiosServices.delete(`/api/rbac/permissions`, { data: { roleId, permissions } }));
}

export async function getUserRoles(userId: string) {
  return attempt(axiosServices.get(`/api/rbac/user-roles?userId=${userId}`));
}

export async function assignRolesToUser(userId: string, roles: number[]) {
  return attempt(axiosServices.post('/api/rbac/user-roles', { userId, roles }));
}
```

### 10. Exemplo de Uso no Componente

```typescript
// src/sections/roles/RoleList.tsx
'use client';

import { useSWR } from 'swr';
import { getRoles, createRole } from '@/utils/api/rbac';
import { Role } from '@/types/rbac';

export default function RoleList() {
  const { data: roles, error, isLoading } = useSWR('/api/rbac/roles', getRoles);

  const handleCreateRole = async (roleData: CreateRoleRequest) => {
    const { data, error } = await createRole(roleData);
    if (error) {
      console.error('Failed to create role:', error);
    } else {
      // Refresh or mutate cache
      mutate('/api/rbac/roles');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Roles ({roles?.length || 0})</h2>
      {roles?.map((role: Role) => (
        <div key={role.id}>
          <h3>{role.name}</h3>
          <p>{role.description}</p>
          <div>Permissions: {role.permissions.length}</div>
        </div>
      ))}
    </div>
  );
}
```

## 🚀 Como Usar

### Desenvolvimento com Mock
```typescript
// src/config.ts
export const RBAC_PROVIDER = ProviderType.MOCK;
```

### Produção com ONC
```typescript
// src/config.ts
export const RBAC_PROVIDER = ProviderType.ONC;
```

## ✅ Benefícios Imediatos

1. **Desenvolvimento Paralelo**: UI pode ser desenvolvida com mock enquanto backend ONC é implementado
2. **Testes Isolados**: Testar UI sem depender de backend real
3. **Troca Simples**: Uma linha de código para trocar entre mock e ONC
4. **Type Safety**: TypeScript garante contratos iguais
5. **Escalável**: Padrão replicável para outros domínios

## 📝 Próximos Passos

1. Implementar estrutura base de RBAC
2. Criar dados mock realistas
3. Implementar endpoints ONC quando disponíveis
4. Atualizar componentes para usar novos utils
5. Testar integração completa
