# Análise do Swagger ONC - Integração RBAC e Users

## 🎯 Endpoints Disponíveis no Backend ONC

### ✅ Endpoints de RBAC (Roles e Permissions)

#### 1. Gestão de Roles

| Endpoint | Método | Descrição | Integração com Frontend |
|----------|--------|-----------|------------------------|
| `/auth/api/Permission/roles` | POST | Criar novo role | ✅ CreateRoleDialog |
| `/auth/api/Permission/roles` | PUT | Atualizar role | ✅ CreateRoleDialog (modo edição) |
| `/auth/api/Permission/roles` | DELETE | Deletar role | ✅ RoleList (botão delete) |
| `/auth/api/Permission/role-by-id` | GET | Buscar role por ID | ✅ CreateRoleDialog (carregar dados) |

#### 2. Gestão de Permissions

| Endpoint | Método | Descrição | Integração com Frontend |
|----------|--------|-----------|------------------------|
| `/auth/api/Permission/permissions` | GET | Listar todas permissions | ✅ CreateRoleDialog (seleção) |
| `/auth/api/Permission/role-permissions` | PUT | Atribuir permissions a roles | ✅ CreateRoleDialog (checkboxes) |

#### 3. Gestão de User-Roles

| Endpoint | Método | Descrição | Integração com Frontend |
|----------|--------|-----------|------------------------|
| `/auth/api/Permission/user-roles-by-userId` | GET | Buscar roles de um usuário | ✅ CreateUserDialog (roles atuais) |
| `/auth/api/Permission/user-roles` | PUT | Atribuir roles a usuários | ✅ CreateUserDialog (seleção) |

#### 4. Gestão de User-Permissions

| Endpoint | Método | Descrição | Integração com Frontend |
|----------|--------|-----------|------------------------|
| `/auth/api/Permission/user-permissions` | PUT | Atribuir permissions diretas | ✅ CreateUserDialog (permissions diretas) |

### ✅ Endpoints de Users

#### 1. Gestão de Usuários

| Endpoint | Método | Descrição | Integração com Frontend |
|----------|--------|-----------|------------------------|
| `/auth/api/Users` | GET | Listar usuários (email, userName, cpf) | ✅ UserList (tabela) |
| `/auth/api/Users/{id}` | GET | Buscar usuário por ID | ✅ CreateUserDialog (edição) |
| `/auth/api/Users` | PUT | Atualizar usuário (multipart) | ✅ CreateUserDialog (edição) |
| `/auth/api/Users` | DELETE | Deletar usuário | ✅ UserList (botão delete) |

#### 2. Registro e Ativação

| Endpoint | Método | Descrição | Integração com Frontend |
|----------|--------|-----------|------------------------|
| `/auth/api/Register/register-account` | POST | Criar novo usuário | ✅ CreateUserDialog (criação) |
| `/auth/api/Register/activate-account` | GET | Ativar conta | ✅ Fluxo de ativação |
| `/auth/api/Register/resend-activation-code` | POST | Reenviar código | ✅ Fluxo de ativação |

## 📋 Schemas Relevantes

### RoleCreateRequestDTO
```typescript
{
  name: string;           // maxLength: 100, minLength: 3
  description?: string;  // maxLength: 400, nullable
  isSystem?: boolean;    // Sistema não pode ser editado
}
```

### RoleUpdateDTO
```typescript
{
  name?: string;          // nullable
  description?: string;   // nullable
  isSystem?: boolean;
}
```

### RolePermissionCreateDTO
```typescript
{
  role_id: number;        // int32
  permission_id: number;  // int32
  effect: string;         // maxLength: 5, minLength: 4 (ex: "allow")
}
```

### UserRoleCreateDTO
```typescript
{
  user_id?: string;       // nullable (UUID)
  role_id: number;        // int32
}
```

### UserPermissionCreateDTO
```typescript
{
  user_id?: string;       // nullable (UUID)
  permission_id: number;  // int32
  effect: string;         // maxLength: 5, minLength: 4
}
```

### CreateUserDTO
```typescript
{
  userName: string;       // minLength: 1
  email: string;          // minLength: 1, format: email
  password: string;       // minLength: 1, format: password
  rePassword: string;     // minLength: 1
}
```

## 🎯 Mapeamento Frontend ↔ Backend

### CreateRoleDialog

| Campo Frontend | Endpoint Backend | Schema | Observações |
|----------------|------------------|--------|-------------|
| name | POST/PUT `/auth/api/Permission/roles` | RoleCreateRequestDTO | minLength: 3, maxLength: 100 |
| description | POST/PUT `/auth/api/Permission/roles` | RoleCreateRequestDTO | maxLength: 400, nullable |
| permissions | PUT `/auth/api/Permission/role-permissions` | RolePermissionCreateDTO[] | Array de permissions |
| isSystem | (read-only) | RoleCreateRequestDTO | Não pode ser editado |

### CreateUserDialog

| Campo Frontend | Endpoint Backend | Schema | Observações |
|----------------|------------------|--------|-------------|
| userName | POST `/auth/api/Register/register-account` | CreateUserDTO | minLength: 1 |
| email | POST `/auth/api/Register/register-account` | CreateUserDTO | format: email |
| password | POST `/auth/api/Register/register-account` | CreateUserDTO | format: password |
| rePassword | POST `/auth/api/Register/register-account` | CreateUserDTO | minLength: 1 |
| roles | PUT `/auth/api/Permission/user-roles` | UserRoleCreateDTO[] | Array de roles |
| permissions | PUT `/auth/api/Permission/user-permissions` | UserPermissionCreateDTO[] | Array de permissions |
| profile data | PUT `/auth/api/Users` | multipart/form-data | Nome, telefone, endereço, etc |

### CreatePermissionDialog

| Campo Frontend | Endpoint Backend | Schema | Observações |
|----------------|------------------|--------|-------------|
| name | (busca de GET permissions) | - | Listado via GET `/auth/api/Permission/permissions` |
| resource | (busca de GET permissions) | - | Parte do permission name |
| action | (busca de GET permissions) | - | Parte do permission name |

## 🔧 Implementação Sugerida

### 1. rbacProvider ONC

```typescript
// src/app/api/onc/rbac/index.ts

// GET /auth/api/Permission/permissions
export async function getPermissions(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const res = await fetch(`${ONC_API}/auth/api/Permission/permissions`, {
    headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
  });
  // ... handling
}

// POST /auth/api/Permission/roles
export async function createRole(request: Request) {
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
  // ... handling
}

// PUT /auth/api/Permission/roles?roleId={id}
export async function updateRole(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId') || body.id;

  const res = await fetch(`${ONC_API}/auth/api/Permission/roles?roleId=${roleId}`, {
    method: 'PUT',
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: body.name,
      description: body.description,
      isSystem: body.isSystem
    })
  });
  // ... handling
}

// DELETE /auth/api/Permission/roles?roleId={id}
export async function deleteRole(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('id');

  const res = await fetch(`${ONC_API}/auth/api/Permission/roles?roleId=${roleId}`, {
    method: 'DELETE',
    headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
  });
  // ... handling
}

// PUT /auth/api/Permission/role-permissions
export async function assignPermissionsToRole(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const body = await request.json();

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
  // ... handling
}

// GET /auth/api/Permission/user-roles-by-userId?userId={id}
export async function getUserRoles(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const res = await fetch(`${ONC_API}/auth/api/Permission/user-roles-by-userId?userId=${userId}`, {
    headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
  });
  // ... handling
}

// PUT /auth/api/Permission/user-roles
export async function assignRolesToUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const body = await request.json();

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
  // ... handling
}
```

### 2. usersProvider ONC

```typescript
// src/app/api/onc/users/index.ts

// GET /auth/api/Users?email={email}&userName={userName}&cpf={cpf}
export async function getUsers(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const userName = searchParams.get('userName');
  const cpf = searchParams.get('cpf');

  const queryParams = new URLSearchParams();
  if (email) queryParams.append('email', email);
  if (userName) queryParams.append('userName', userName);
  if (cpf) queryParams.append('cpf', cpf);

  const res = await fetch(`${ONC_API}/auth/api/Users?${queryParams.toString()}`, {
    headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
  });
  // ... handling
}

// GET /auth/api/Users/{id}
export async function getUserById(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const res = await fetch(`${ONC_API}/auth/api/Users/${id}`, {
    headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
  });
  // ... handling
}

// POST /auth/api/Register/register-account
export async function createUser(request: Request) {
  const body = await request.json();

  const res = await fetch(`${ONC_API}/auth/api/Register/register-account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: body.userName,
      email: body.email,
      password: body.password,
      rePassword: body.rePassword
    })
  });
  // ... handling
}

// PUT /auth/api/Users?id={id} (multipart/form-data)
export async function updateUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const body = await request.formData();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const res = await fetch(`${ONC_API}/auth/api/Users?id=${id}`, {
    method: 'PUT',
    headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    body // FormData
  });
  // ... handling
}

// DELETE /auth/api/Users?id={id}
export async function deleteUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const res = await fetch(`${ONC_API}/auth/api/Users?id=${id}`, {
    method: 'DELETE',
    headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
  });
  // ... handling
}
```

## 🎯 Conclusão

### ✅ O backend ONC tem TODOS os endpoints necessários:

1. **RBAC Completo**: Roles, Permissions, User-Roles, User-Permissions
2. **Users Completo**: CRUD de usuários, registro, ativação
3. **Integração Perfeita**: Forms do frontend mapeiam 1:1 com schemas do backend

### 📋 Próximos Passos:

1. Implementar `rbacProvider` ONC seguindo os endpoints acima
2. Implementar `usersProvider` ONC seguindo os endpoints acima
3. Atualizar tipos TypeScript para match com schemas do swagger
4. Adaptar forms existentes para usar novos providers
5. Testar integração completa

### 🔧 Observações Importantes:

1. **Query Params vs Path Params**: Alguns endpoints usam query params (`?roleId=1`) em vez de path params (`/roles/1`)
2. **Multipart Form Data**: Update de usuário usa multipart/form-data para upload de foto
3. **Effect Field**: RolePermission e UserPermission exigem campo `effect` (ex: "allow")
4. **IsSystem Flag**: Roles de sistema não devem ser editáveis no frontend
5. **UUID vs Integer**: User IDs são UUID, Role/Permission IDs são integers

**Recomendação**: Implementar imediatamente seguindo o padrão multi-provider que discutimos anteriormente! 🚀
