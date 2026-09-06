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

// Mock storage for user-role assignments
const userRoles: Record<string, string[]> = {};

// Mock users data
const mockUsers = [
  { id: '1', name: 'Allison Mosciski', username: 'allison_mosciski' },
  { id: '2', name: 'Stacy Reichel', username: 'stacy_reichel.880' },
  { id: '3', name: 'Roderick Rohan', username: 'roderick.rohan' }
];

/***************************  MOCK - GET ROLES  ***************************/

export async function getRoles(request: Request) {
  // Adiciona usuários atribuídos a cada role
  const rolesWithUsers = roles.map((role) => {
    // Encontra todos os usuários que têm este role
    const assignedUserIds = Object.entries(userRoles)
      .filter(([, roleIds]) => roleIds.includes(String(role.id)))
      .map(([userId]) => userId);

    // Busca os dados dos usuários
    const assignedUsers = mockUsers.filter((user) => assignedUserIds.includes(user.id));

    console.log(`getRoles - Role ${role.id} (${role.name}) tem ${assignedUsers.length} usuários:`, assignedUsers.map(u => u.name));

    return {
      ...role,
      users: assignedUsers
    };
  });

  console.log('getRoles - Retornando roles:', rolesWithUsers.map(r => ({ id: r.id, name: r.name, description: r.description, userCount: r.users?.length || 0 })));
  return NextResponse.json(rolesWithUsers, { status: 200 });
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
    console.log('updateRole - Body recebido:', body);
    console.log('updateRole - Roles antes:', roles.map(r => ({ id: r.id, name: r.name })));

    const index = roles.findIndex((r) => r.id === body.id);

    if (index === -1) {
      console.error('updateRole - Role não encontrado:', body.id);
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    roles[index] = {
      ...roles[index],
      name: body.name || roles[index].name,
      description: body.description !== undefined ? body.description : roles[index].description,
      isSystem: body.isSystem !== undefined ? body.isSystem : roles[index].isSystem,
      updatedAt: new Date().toISOString()
    };

    console.log('updateRole - Role atualizado:', roles[index]);
    console.log('updateRole - Roles depois:', roles.map(r => ({ id: r.id, name: r.name })));

    return NextResponse.json(roles[index], { status: 200 });
  } catch (error) {
    console.error('updateRole - Erro:', error);
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
      name: body.name ?? permissions[index].name,
      subject: body.subject ?? permissions[index].subject,
      action: body.action ?? permissions[index].action,
      conditions: body.conditions ?? permissions[index].conditions,
      fields: body.fields ?? permissions[index].fields,
      description: body.description ?? permissions[index].description,
      roles: body.roles ?? permissions[index].roles
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
    console.log('assignPermission - Body recebido:', body);

    const { roleId, permissions } = body;

    const role = roles.find((r) => r.id === roleId);
    if (!role) {
      console.error('assignPermission - Role não encontrado:', roleId);
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    console.log('assignPermission - Role encontrado:', role);
    console.log('assignPermission - Permissions antes:', role.permissions?.map(p => p.id));

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

    console.log('assignPermission - Permissions depois:', role.permissions?.map(p => p.id));

    return NextResponse.json({ success: true, role }, { status: 200 });
  } catch (error) {
    console.error('assignPermission - Erro:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - REMOVE PERMISSION  ***************************/

export async function removePermission(request: Request) {
  try {
    const body = await request.json();
    console.log('removePermission - Body recebido:', body);

    const { roleId, permissions } = body;

    const role = roles.find((r) => r.id === roleId);
    if (!role) {
      console.error('removePermission - Role não encontrado:', roleId);
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    console.log('removePermission - Role encontrado:', role);
    console.log('removePermission - Permissions antes:', role.permissions?.map(p => p.id));

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

    console.log('removePermission - Permissions depois:', role.permissions?.map(p => p.id));

    return NextResponse.json({ success: true, role }, { status: 200 });
  } catch (error) {
    console.error('removePermission - Erro:', error);
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
    console.log('assignRolesToUser - Body recebido:', body);

    // Validação básica
    if (!body.userId || !body.roles || !Array.isArray(body.roles)) {
      console.error('assignRolesToUser - Dados inválidos:', body);
      return NextResponse.json({ error: 'Dados inválidos: userId e roles são obrigatórios' }, { status: 400 });
    }

    // Salva a atribuição no armazenamento mock
    const userId = String(body.userId);
    const rolesToAdd = body.roles.map((r: string | number) => String(r));

    if (!userRoles[userId]) {
      userRoles[userId] = [];
    }

    // Adiciona os papéis (evita duplicatas)
    rolesToAdd.forEach((role: string) => {
      if (!userRoles[userId].includes(role)) {
        userRoles[userId].push(role);
      }
    });

    console.log('assignRolesToUser - Atribuição salva:', { userId, roles: userRoles[userId] });

    // Mock: retorna no mesmo formato que a API ONC esperaria
    const userRolesArray = userRoles[userId].map((roleId) => ({
      user_id: userId,
      role_id: roleId
    }));

    return NextResponse.json(userRolesArray, { status: 200 });
  } catch (error) {
    console.error('assignRolesToUser - Erro:', error);
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
