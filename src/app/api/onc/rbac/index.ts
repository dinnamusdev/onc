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

    console.log('ONC updateRole - Body recebido:', body);
    console.log('ONC updateRole - ID:', id, 'UpdateData:', updateData);

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
      console.error('ONC updateRole - Erro da API:', error);
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to update role' }, { status: res.status });
    }

    const data = await res.json();
    console.log('ONC updateRole - Sucesso:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('ONC updateRole - Erro:', error);
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
      // Backend retorna 404 quando a lista está vazia; trata como array vazio
      if (res.status === 404) {
        return NextResponse.json([], { status: 200 });
      }
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

    console.log('ONC createPermission - Body recebido:', body);

    // Swagger: POST /auth/api/Permission/permissions (PermissionCreateDTO)
    // PermissionCreateDTO exige subjectId (int) e actionId (int)
    const res = await fetch(`${ONC_API}/auth/api/Permission/permissions`, {
      method: 'POST',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subjectId: Number(body.subjectId),
        actionId: Number(body.actionId),
        conditions: body.conditions ?? null,
        fields: body.fields ?? null,
        description: body.description ?? null
      })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('ONC createPermission - Erro da API:', error);
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to create permission' }, { status: res.status });
    }

    const data = await res.json();
    console.log('ONC createPermission - Sucesso:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('ONC createPermission - Erro:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - UPDATE PERMISSION  ***************************/

export async function updatePermission(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    const { id, ...updateData } = body;

    console.log('ONC updatePermission - Body recebido:', body);
    console.log('ONC updatePermission - ID:', id, 'UpdateData:', updateData);

    // Swagger: PUT /auth/api/Permission/permissions?permissionId= (PermissionUpdateDTO)
    // PermissionUpdateDTO exige subjectId (int) e actionId (int)
    const res = await fetch(`${ONC_API}/auth/api/Permission/permissions?permissionId=${id}`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subjectId: Number(updateData.subjectId),
        actionId: Number(updateData.actionId),
        conditions: updateData.conditions ?? null,
        fields: updateData.fields ?? null,
        description: updateData.description ?? null
      })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('ONC updatePermission - Erro da API:', error);
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to update permission' }, { status: res.status });
    }

    const data = await res.json();
    console.log('ONC updatePermission - Sucesso:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('ONC updatePermission - Erro:', error);
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

    console.log('ONC assignPermission - Body recebido:', body);

    // Swagger: PUT /auth/api/Permission/role-permissions
    // Body: array of RolePermissionCreateDTO
    // Converter IDs para números (API ONC espera numbers)
    const rolePermissions = body.permissions.map((permId: string | number) => ({
      role_id: Number(body.roleId),
      permission_id: Number(permId),
      effect: 'allow' // obrigatório pelo schema
    }));

    console.log('ONC assignPermission - Enviando para API:', rolePermissions);

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
      console.error('ONC assignPermission - Erro da API:', error);
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to assign permission' }, { status: res.status });
    }

    const data = await res.json();
    console.log('ONC assignPermission - Sucesso:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('ONC assignPermission - Erro:', error);
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

    const payload = await res.json();
    const data = payload?.data ?? payload;
    return NextResponse.json(Array.isArray(data) ? data : [data], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - ASSIGN ROLES TO USER  ***************************/

export async function assignRolesToUser(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    console.log('ONC assignRolesToUser - Body recebido:', body);

    // Swagger: PUT /auth/api/Permission/user-roles
    // Body: array of UserRoleCreateDTO
    // userId é UUID (string), roleId é número
    const userRoles = body.roles.map((roleId: string | number) => ({
      user_id: String(body.userId), // Mantém como string (UUID)
      role_id: Number(roleId) // Converte para número
    }));

    console.log('ONC assignRolesToUser - Enviando para API:', userRoles);

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
      console.error('ONC assignRolesToUser - Erro da API:', error);
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to assign roles to user' }, { status: res.status });
    }

    const data = await res.json();
    console.log('ONC assignRolesToUser - Sucesso:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('ONC assignRolesToUser - Erro:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET SUBJECTS  ***************************/

export async function getSubjects(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    // Backend: GET /auth/api/Permission/subjects -> SubjectListServiceResponse { data: Subject[] }
    const res = await fetch(`${ONC_API}/auth/api/Permission/subjects`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch subjects' }, { status: res.status });
    }

    const payload = await res.json();
    const data = payload?.data ?? payload;
    return NextResponse.json(Array.isArray(data) ? data : [data], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET SUBJECT BY ID  ***************************/

export async function getSubjectById(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId') ?? searchParams.get('id');

    const res = await fetch(`${ONC_API}/auth/api/Permission/subject-by-id?subjectId=${subjectId}`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch subject' }, { status: res.status });
    }

    const payload = await res.json();
    const data = payload?.data ?? payload;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CREATE SUBJECT  ***************************/

export async function createSubject(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    // Swagger: POST /auth/api/Permission/subjects (SubjectCreateDTO { description: string 3-100 })
    const res = await fetch(`${ONC_API}/auth/api/Permission/subjects`, {
      method: 'POST',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: body.description })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to create subject' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - UPDATE SUBJECT  ***************************/

export async function updateSubject(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    const { id, subjectId, ...updateData } = body;
    const sid = subjectId ?? id;

    // Swagger: PUT /auth/api/Permission/subjects?subjectId= (SubjectUpdateDTO { description: string 3-100 })
    const res = await fetch(`${ONC_API}/auth/api/Permission/subjects?subjectId=${sid}`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: updateData.description })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to update subject' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Subject updated' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - DELETE SUBJECT  ***************************/

export async function deleteSubject(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') ?? searchParams.get('subjectId');

    const res = await fetch(`${ONC_API}/auth/api/Permission/subjects?subjectId=${id}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to delete subject' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Subject deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET ACTIONS  ***************************/

export async function getActions(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    // Backend: GET /auth/api/Permission/actions -> ActionResponseDTOListServiceResponse { data: Action[] }
    const res = await fetch(`${ONC_API}/auth/api/Permission/actions`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch actions' }, { status: res.status });
    }

    const payload = await res.json();
    const data = payload?.data ?? payload;
    return NextResponse.json(Array.isArray(data) ? data : [data], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET ACTION BY ID  ***************************/

export async function getActionById(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const actionId = searchParams.get('actionId') ?? searchParams.get('id');

    const res = await fetch(`${ONC_API}/auth/api/Permission/action-by-id?actionId=${actionId}`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch action' }, { status: res.status });
    }

    const payload = await res.json();
    const data = payload?.data ?? payload;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CREATE ACTION  ***************************/

export async function createAction(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    // Swagger: POST /auth/api/Permission/actions (ActionCreateDTO { description: string })
    const res = await fetch(`${ONC_API}/auth/api/Permission/actions`, {
      method: 'POST',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: body.description })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to create action' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Action created' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - UPDATE ACTION  ***************************/

export async function updateAction(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    const { id, actionId, ...updateData } = body;
    const aid = actionId ?? id;

    // Swagger: PUT /auth/api/Permission/actions?actionId= (ActionUpdateDTO { description: string req 3-100 })
    const res = await fetch(`${ONC_API}/auth/api/Permission/actions?actionId=${aid}`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: updateData.description })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to update action' }, { status: res.status });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - DELETE ACTION  ***************************/

export async function deleteAction(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') ?? searchParams.get('actionId');

    // Swagger: DELETE /auth/api/Permission/actions?actionId=
    const res = await fetch(`${ONC_API}/auth/api/Permission/actions?actionId=${id}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to delete action' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Action deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - ASSIGN USER PERMISSIONS  ***************************/

export async function assignUserPermissions(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();

    // Swagger: PUT /auth/api/Permission/user-permissions
    // Body: array of UserPermissionCreateDTO { user_id, permission_id, effect (4-5 chars) }
    const userPermissions = body.permissions.map((permId: string | number) => ({
      user_id: String(body.userId),
      permission_id: Number(permId),
      effect: body.effect ?? 'allow'
    }));

    const res = await fetch(`${ONC_API}/auth/api/Permission/user-permissions`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userPermissions)
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to assign user permissions' }, { status: res.status });
    }

    const data = await res.json().catch(() => ({}));
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
  assignRolesToUser,
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getActions,
  getActionById,
  createAction,
  updateAction,
  deleteAction,
  assignUserPermissions
};

export default oncRbac;
