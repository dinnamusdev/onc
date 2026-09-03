// @next
import { NextResponse } from 'next/server';

const ONC_API = process.env.ONC_API_BASE_URL || 'http://env-0887520.sp1.br.saveincloud.net.br';

/***************************  ONC - GET ROLES  ***************************/

export async function getRoles(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    // Backend: GET /auth/api/Permission/roles -> RoleListServiceResponse { data: Role[] }
    const res = await fetch(`${ONC_API}/auth/api/Permission/roles`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch roles' }, { status: res.status });
    }

    const payload = await res.json();
    // Desempacota o envelope ServiceResponse { data: [...] }
    const data = payload?.data ?? payload;
    return NextResponse.json(Array.isArray(data) ? data : [data], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CREATE ROLE  ***************************/

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
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to create role' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - UPDATE ROLE  ***************************/

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
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to update role' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - DELETE ROLE  ***************************/

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
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to delete role' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Role deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET PERMISSIONS  ***************************/

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
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch permissions' }, { status: res.status });
    }

    const payload = await res.json();
    // Desempacota o envelope ServiceResponse { data: [...] }
    const data = payload?.data ?? payload;
    return NextResponse.json(Array.isArray(data) ? data : [data], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CREATE PERMISSION  ***************************/

export async function createPermission(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    // Swagger: POST /auth/api/Permission/permissions (PermissionCreateDTO)
    const res = await fetch(`${ONC_API}/auth/api/Permission/permissions`, {
      method: 'POST',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: body.subject,
        action: body.action,
        conditions: body.conditions ?? null,
        fields: body.fields ?? null,
        description: body.description ?? null
      })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to create permission' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - UPDATE PERMISSION  ***************************/

export async function updatePermission(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    const { id, ...updateData } = body;

    // Swagger: PUT /auth/api/Permission/permissions?permissionId= (PermissionUpdateDTO)
    const res = await fetch(`${ONC_API}/auth/api/Permission/permissions?permissionId=${id}`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: updateData.subject,
        action: updateData.action,
        conditions: updateData.conditions ?? null,
        fields: updateData.fields ?? null,
        description: updateData.description ?? null
      })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to update permission' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - DELETE PERMISSION  ***************************/

export async function deletePermission(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Swagger: DELETE /auth/api/Permission/permissions?permissionId=
    const res = await fetch(`${ONC_API}/auth/api/Permission/permissions?permissionId=${id}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to delete permission' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Permission deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - ASSIGN PERMISSION  ***************************/

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
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to assign permission' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - REMOVE PERMISSION  ***************************/

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
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to remove permission' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Permission removed' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET USER ROLES  ***************************/

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
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch user roles' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - ASSIGN ROLES TO USER  ***************************/

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
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to assign roles to user' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Export as a single object for easy import
const oncRbac = {
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

export default oncRbac;
