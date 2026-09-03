// @next
import { NextResponse } from 'next/server';

// @project
import { mockRoles } from './roles';
import { mockPermissions } from './permissions';

// @types
import { Role, CreateRoleRequest, Permission } from '@/types/rbac';

// In-memory storage for mock operations
const roles = [...mockRoles];
const permissions = [...mockPermissions];

/***************************  MOCK - GET ROLES  ***************************/

export async function getRoles(request: Request) {
  return NextResponse.json(roles, { status: 200 });
}

/***************************  MOCK - CREATE ROLE  ***************************/

export async function createRole(request: Request) {
  try {
    const body: CreateRoleRequest = await request.json();

    const newRole: Role = {
      id: (roles.length + 1).toString(),
      name: body.name,
      description: body.description,
      isSystem: body.isSystem || false,
      permissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    roles.push(newRole);

    return NextResponse.json(newRole, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - UPDATE ROLE  ***************************/

export async function updateRole(request: Request) {
  try {
    const body: CreateRoleRequest & { id: string | number } = await request.json();
    const index = roles.findIndex((r) => r.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    roles[index] = {
      ...roles[index],
      name: body.name || roles[index].name,
      description: body.description !== undefined ? body.description : roles[index].description,
      isSystem: body.isSystem !== undefined ? body.isSystem : roles[index].isSystem,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(roles[index], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - DELETE ROLE  ***************************/

export async function deleteRole(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Role ID required' }, { status: 400 });
    }

    const index = roles.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    roles.splice(index, 1);

    return NextResponse.json({ message: 'Role deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - GET PERMISSIONS  ***************************/

export async function getPermissions(request: Request) {
  return NextResponse.json(permissions, { status: 200 });
}

/***************************  MOCK - CREATE PERMISSION  ***************************/

export async function createPermission(request: Request) {
  try {
    const body = await request.json();

    const newPermission: Permission = {
      id: (permissions.length + 1).toString(),
      subject: body.subject,
      action: body.action,
      conditions: body.conditions ?? undefined,
      fields: body.fields ?? undefined,
      description: body.description ?? undefined,
      createdAt: new Date().toISOString()
    };

    permissions.push(newPermission);

    return NextResponse.json(newPermission, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - UPDATE PERMISSION  ***************************/

export async function updatePermission(request: Request) {
  try {
    const body = await request.json();
    const index = permissions.findIndex((p) => String(p.id) === String(body.id));

    if (index === -1) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
    }

    permissions[index] = {
      ...permissions[index],
      subject: body.subject ?? permissions[index].subject,
      action: body.action ?? permissions[index].action,
      conditions: body.conditions ?? permissions[index].conditions,
      fields: body.fields ?? permissions[index].fields,
      description: body.description ?? permissions[index].description
    };

    return NextResponse.json(permissions[index], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - DELETE PERMISSION  ***************************/

export async function deletePermission(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Permission ID required' }, { status: 400 });
    }

    const index = permissions.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
    }

    permissions.splice(index, 1);

    return NextResponse.json({ message: 'Permission deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - ASSIGN PERMISSION  ***************************/

export async function assignPermission(request: Request) {
  try {
    const body = await request.json();
    const { roleId, permissions } = body;

    const role = roles.find((r) => r.id === roleId);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Atualiza todas as permissions do role
    role.permissions = permissions.map((permId: string) => {
      const permission = mockPermissions.find((p) => p.id === permId);
      return (
        permission || {
          id: permId,
          name: permId,
          resource: permId.split('.')[0],
          action: permId.split('.')[1],
          description: `Permission ${permId}`
        }
      );
    });

    return NextResponse.json(role, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - REMOVE PERMISSION  ***************************/

export async function removePermission(request: Request) {
  try {
    const body = await request.json();
    const { roleId, permissions } = body;

    const role = roles.find((r) => r.id === roleId);
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Atualiza permissions removendo as não selecionadas
    role.permissions = permissions.map((permId: string) => {
      const permission = mockPermissions.find((p) => p.id === permId);
      return (
        permission || {
          id: permId,
          name: permId,
          resource: permId.split('.')[0],
          action: permId.split('.')[1],
          description: `Permission ${permId}`
        }
      );
    });

    return NextResponse.json(role, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - GET USER ROLES  ***************************/

export async function getUserRoles(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Mock: retorna roles baseado no userId
    const userRoles = userId === '1' ? [1, 2] : [3]; // Exemplo

    return NextResponse.json(userRoles, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - ASSIGN ROLES TO USER  ***************************/

export async function assignRolesToUser(request: Request) {
  try {
    const body = await request.json();
    // Mock: apenas retorna sucesso
    return NextResponse.json({ success: true, roles: body.roles }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Export as a single object for easy import
const mockRbac = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  assignPermission,
  removePermission,
  getUserRoles,
  assignRolesToUser
};

export default mockRbac;
