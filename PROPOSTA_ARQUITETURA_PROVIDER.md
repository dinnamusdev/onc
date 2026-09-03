# Proposta de Arquitetura - Multi-Provider Pattern

## 🎯 Objetivo

Replicar o padrão `authProvider` para outros domínios (RBAC, Users, etc.), mantendo a flexibilidade de alternar entre mock e backend real.

## 📊 Problema Atual

- `authProvider` funciona muito bem para autenticação
- Roles e permissões estão misturadas ou precisam ser integradas
- Outras funcionalidades futuras (users, permissions, etc.) seguirão o mesmo padrão

## ✅ Solução Proposta

### Estrutura de Domínios

```
src/app/api/
├── auth/                    # Domínio de Autenticação (existente)
│   ├── authProvider.ts     # Factory pattern
│   ├── mock/
│   │   ├── index.ts        # Implementação mock
│   │   └── data.ts         # Dados mock
│   └── onc/
│       └── index.ts        # Implementação ONC
│
├── rbac/                    # Domínio de RBAC (NOVO)
│   ├── rbacProvider.ts     # Factory pattern
│   ├── mock/
│   │   ├── index.ts        # Implementação mock
│   │   ├── roles.ts        # Mock de roles
│   │   └── permissions.ts  # Mock de permissions
│   └── onc/
│       └── index.ts        # Implementação ONC
│
├── users/                   # Domínio de Users (NOVO)
│   ├── usersProvider.ts    # Factory pattern
│   ├── mock/
│   │   ├── index.ts        # Implementação mock
│   │   └── data.ts         # Dados mock
│   └── onc/
│       └── index.ts        # Implementação ONC
│
└── permissions/             # Domínio de Permissions (NOVO)
    ├── permissionsProvider.ts
    ├── mock/
    │   └── index.ts
    └── onc/
        └── index.ts
```

### Configuração Centralizada

```typescript
// src/config.ts
export const AUTH_PROVIDER: AuthType = AuthType.ONC;
export const RBAC_PROVIDER: ProviderType = ProviderType.ONC;
export const USERS_PROVIDER: ProviderType = ProviderType.MOCK; // Começar com mock
export const PERMISSIONS_PROVIDER: ProviderType = ProviderType.MOCK;
```

### Exemplo: rbacProvider.ts

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
}

const rbacProviderMapping: Record<string, () => Promise<RbacProvider>> = {
  mock: () => import('@/app/api/mock/rbac').then((mod) => mod.default as RbacProvider),
  onc: () => import('@/app/api/onc/rbac').then((mod) => mod.default as RbacProvider)
};

export async function rbacProvider() {
  return await rbacProviderMapping[RBAC_PROVIDER]();
}
```

### Exemplo: mock/rbac/index.ts

```typescript
// src/app/api/mock/rbac/index.ts
import { NextResponse } from 'next/server';
import mockRoles from './roles';
import mockPermissions from './permissions';

export async function getRoles(request: Request) {
  return NextResponse.json(mockRoles, { status: 200 });
}

export async function createRole(request: Request) {
  const body = await request.json();
  // Mock logic
  return NextResponse.json({ ...body, id: Date.now() }, { status: 201 });
}

export async function getPermissions(request: Request) {
  return NextResponse.json(mockPermissions, { status: 200 });
}

const mockRbac = {
  getRoles,
  createRole,
  updateRole: createRole, // Simplificado para mock
  deleteRole: createRole, // Simplificado para mock
  getPermissions,
  assignPermission: createRole,
  removePermission: createRole
};

export default mockRbac;
```

### Exemplo: onc/rbac/index.ts

```typescript
// src/app/api/onc/rbac/index.ts
import { NextResponse } from 'next/server';

const ONC_API = process.env.ONC_API_BASE_URL;

export async function getRoles(request: Request) {
  const res = await fetch(`${ONC_API}/api/roles`, {
    headers: {
      'Authorization': request.headers.get('Authorization') || '',
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: res.status });
  }

  return NextResponse.json(await res.json(), { status: 200 });
}

export async function createRole(request: Request) {
  const body = await request.json();
  const res = await fetch(`${ONC_API}/api/roles`, {
    method: 'POST',
    headers: {
      'Authorization': request.headers.get('Authorization') || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to create role' }, { status: res.status });
  }

  return NextResponse.json(await res.json(), { status: 201 });
}

const oncRbac = {
  getRoles,
  createRole,
  updateRole: createRole,
  deleteRole: createRole,
  getPermissions: getRoles, // Assumir endpoint similar
  assignPermission: createRole,
  removePermission: createRole
};

export default oncRbac;
```

### API Routes

```typescript
// src/app/api/rbac/roles/route.ts
import { rbacProvider } from '../rbacProvider';
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

### Utils Layer

```typescript
// src/utils/api/rbac/index.ts
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

export async function getRoles() {
  return attempt(axiosServices.get('/api/rbac/roles'));
}

export async function createRole(data: any) {
  return attempt(axiosServices.post('/api/rbac/roles', data));
}

export async function getPermissions() {
  return attempt(axiosServices.get('/api/rbac/permissions'));
}
```

## 🎨 Benefícios

### 1. Separação de Domínios
- Auth permanece isolado
- RBAC tem seu próprio provider
- Users tem seu próprio provider
- Cada domínio pode evoluir independentemente

### 2. Flexibilidade de Configuração
```typescript
// Desenvolvimento - UI com mock
export const RBAC_PROVIDER = ProviderType.MOCK;
export const USERS_PROVIDER = ProviderType.MOCK;

// Produção - Integração real
export const RBAC_PROVIDER = ProviderType.ONC;
export const USERS_PROVIDER = ProviderType.ONC;
```

### 3. Testabilidade
- Testar UI com mock de RBAC independente
- Testar integração com ONC separadamente
- Mocks realistas para desenvolvimento

### 4. Escalabilidade
- Fácil adicionar novos domínios
- Padrão consistente em toda aplicação
- Manutenção simplificada

### 5. Paralelismo de Desenvolvimento
- Frontend pode desenvolver com mock
- Backend pode desenvolver endpoints
- Integração acontece no final

## 📋 Plano de Implementação

### Fase 1: Estrutura Base
1. Criar `src/app/api/rbac/rbacProvider.ts`
2. Criar `src/app/api/mock/rbac/index.ts`
3. Criar `src/app/api/onc/rbac/index.ts`
4. Adicionar `RBAC_PROVIDER` ao config.ts

### Fase 2: API Routes
1. Criar `src/app/api/rbac/roles/route.ts`
2. Criar `src/app/api/rbac/permissions/route.ts`
3. Criar rotas para CRUD de roles

### Fase 3: Utils Layer
1. Criar `src/utils/api/rbac/index.ts`
2. Implementar funções para CRUD
3. Adicionar tipos TypeScript

### Fase 4: Integração UI
1. Atualizar componentes para usar novos utils
2. Testar com mock
3. Validar integração

### Fase 5: Replicar para Users
1. Seguir mesmo padrão para domínio users
2. Criar usersProvider
3. Implementar mock e ONC

## 🔧 Enums e Tipos

```typescript
// src/enum.ts (adicionar)
export enum ProviderType {
  MOCK = 'mock',
  ONC = 'onc',
  FIREBASE = 'firebase',
  SUPABASE = 'supabase'
}

// src/types/rbac.ts (novo)
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}
```

## 🚀 Exemplo de Uso

### No Componente
```typescript
// src/sections/roles/RoleList.tsx
import { getRoles } from '@/utils/api/rbac';

function RoleList() {
  const { data, error, isLoading } = useSWR('/api/rbac/roles', getRoles);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <Table>
      {data?.map(role => <RoleItem key={role.id} role={role} />)}
    </Table>
  );
}
```

### Trocar de Mock para ONC
```typescript
// src/config.ts
// Apenas mudar uma linha!
export const RBAC_PROVIDER = ProviderType.ONC; // Era MOCK
```

## ⚠️ Considerações

### 1. Autenticação vs Autorização
- `authProvider` continua responsável por autenticação
- `rbacProvider` é responsável por autorização
- Tokens ainda gerenciados pelo AuthContext

### 2. Headers de Autenticação
- Providers não-auth precisam receber headers
- Implementar interceptors para injetar tokens
- Exemplo: `request.headers.get('Authorization')`

### 3. Error Handling
- Padronizar error handling entre providers
- Usar `attempt` utilitário consistentemente
- Mensagens de erro consistentes

### 4. Tipagem Forte
- Interfaces TypeScript para cada provider
- Garantir contratos iguais entre mock e ONC
- Type safety em todo o fluxo

## 📊 Comparação: Atual vs Proposto

### Atual
```
auth/
├── authProvider.ts
├── mock/
└── onc/
```

### Proposto
```
auth/          (existente)
├── authProvider.ts
├── mock/
└── onc/

rbac/          (novo)
├── rbacProvider.ts
├── mock/
└── onc/

users/         (novo)
├── usersProvider.ts
├── mock/
└── onc/
```

## 🎯 Conclusão

Essa abordagem:
- ✅ Mantém a excelência do padrão atual
- ✅ Separa responsabilidades corretamente
- ✅ Permite desenvolvimento paralelo
- ✅ Facilita testes
- ✅ É escalável para novos domínios
- ✅ Mantém type safety
- ✅ Simplifica manutenção

**Recomendação**: Implementar imediatamente para RBAC e replicar para outros domínios conforme necessário.
