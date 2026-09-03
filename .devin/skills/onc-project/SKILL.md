---
name: onc-project
description: ONC project context and multi-provider architecture
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - edit
permissions:
  allow:
    - Read(src/**)
    - Write(src/**)
    - Exec(npm run)
---

# ONC Project Context

## 🎯 Project Overview

ONC is a SaaS web application built with Next.js 16, React 19, and Material-UI 7, focused on user management, roles, and permissions with ONC API integration.

## 🏗️ Architecture: Multi-Provider Pattern

The application uses a multi-provider pattern allowing switching between mock and real backend implementations:

**Current Providers:**
- `authProvider`: Authentication domain (mock/ONC) - Set to ONC
- `rbacProvider`: RBAC domain (mock/ONC) - Set to MOCK
- `usersProvider`: Users domain (mock/ONC) - NEWLY IMPLEMENTED, set to MOCK

**Configuration in `src/config.ts`:**
```typescript
export const AUTH_PROVIDER: AuthType = AuthType.ONC;
export const RBAC_PROVIDER: ProviderType = ProviderType.MOCK; // Switch to ONC for production
export const USERS_PROVIDER: ProviderType = ProviderType.MOCK; // Switch to ONC for production
```

## 📁 Key Project Structure

```
src/
├── app/
│   ├── (admin)/              # Admin routes with AuthGuard + RoleGuard
│   ├── (auth)/               # Auth routes with GuestGuard
│   ├── api/
│   │   ├── mock/             # CENTRALIZED mock implementations
│   │   │   ├── auth/     (index.ts, data.ts)
│   │   │   ├── rbac/     (index.ts, roles.ts, permissions.ts)
│   │   │   └── users/    (index.ts, data.ts)
│   │   ├── onc/              # CENTRALIZED ONC (real backend) implementations
│   │   │   ├── auth/     (index.ts)
│   │   │   ├── rbac/     (index.ts)
│   │   │   └── users/    (index.ts)
│   │   ├── auth/             # Auth domain: provider factory + routes
│   │   │   ├── authProvider.ts
│   │   │   ├── login/route.ts, signUp/route.ts, ...
│   │   │   └── requestCodePasswordReset/route.ts
│   │   ├── rbac/             # RBAC domain: provider factory + routes
│   │   │   ├── rbacProvider.ts
│   │   │   ├── roles/route.ts + roles/[id]/route.ts
│   │   │   ├── permissions/route.ts
│   │   │   └── user-roles/route.ts
│   │   └── users/            # Users domain: provider factory + routes
│   │       ├── usersProvider.ts
│   │       ├── route.ts (GET list / POST create)
│   │       └── [id]/route.ts (GET / PUT / DELETE)
├── components/               # Reusable components
├── contexts/                 # AuthContext, ConfigContext
├── layouts/                  # AdminLayout, AuthLayout
├── themes/                   # Material-UI theme configuration
├── types/                    # auth.ts, rbac.ts, users.ts, config.ts, ...
├── utils/
│   └── api/
│       ├── auth/            # Client API functions (axios)
│       ├── rbac/            # Client API functions (axios)
│       └── users/           # Client API functions (axios)
└── enum.ts                   # AuthType, ProviderType, AuthRole, ...
```

> ⚠️ **Padrão real:** as implementações `mock/` e `onc/` são **centralizadas** em `src/app/api/mock/` e `src/app/api/onc/` (uma subpasta por domínio), e **não** dentro de cada pasta de domínio. As pastas de domínio (`auth/`, `rbac/`, `users/`) contêm apenas o `*Provider.ts` (factory) e as rotas HTTP.

## 🔧 Recent Implementation: Multi-Provider System

### RBAC Provider (Implemented)
- `src/types/rbac.ts` - RBAC TypeScript types
- `src/app/api/rbac/rbacProvider.ts` - Factory pattern
- `src/app/api/mock/rbac/` - Mock implementation with roles and permissions data
- `src/app/api/onc/rbac/` - ONC API integration based on swagger
- `src/app/api/rbac/roles/` - Roles API routes (GET/POST/PUT/DELETE)
- `src/app/api/rbac/permissions/` - Permissions API routes (GET/POST/DELETE)
- `src/app/api/rbac/user-roles/` - User roles API routes (GET/POST)
- `src/utils/api/rbac/` - Client API functions
- `src/sections/roles/CreateRoleDialog.tsx` - Updated to use RBAC provider

### Users Provider (NEWLY IMPLEMENTED)
- `src/types/users.ts` - Users TypeScript types
- `src/app/api/users/usersProvider.ts` - Factory pattern
- `src/app/api/mock/users/` - Mock implementation with user data
- `src/app/api/onc/users/` - ONC API integration based on swagger
- `src/app/api/users/route.ts` - Users API routes (GET/POST)
- `src/app/api/users/[id]/route.ts` - User detail routes (GET/PUT/DELETE)
- `src/utils/api/users/` - Client API functions
- `src/sections/users/CreateUserDialog.tsx` - Updated to use users provider

### How to Use RBAC Provider

**In components:**
```typescript
import { getRoles, createRole } from '@/utils/api/rbac';

function RoleList() {
  const { data, error, isLoading } = useSWR('/api/rbac/roles', getRoles);

  const handleCreate = async (roleData) => {
    const { data, error } = await createRole(roleData);
    // Handle response
  };
}
```

### How to Use Users Provider

**In components:**
```typescript
import { getUsers, createUser } from '@/utils/api/users';

function UserList() {
  const { data, error, isLoading } = useSWR('/api/users', getUsers);

  const handleCreate = async (userData) => {
    const { data, error } = await createUser({
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      rePassword: userData.rePassword
    });
    // Handle response
  };
}
```

**Switch providers:**
```typescript
// src/config.ts
export const RBAC_PROVIDER = ProviderType.MOCK; // Development
export const RBAC_PROVIDER = ProviderType.ONC;  // Production
export const USERS_PROVIDER = ProviderType.MOCK; // Development
export const USERS_PROVIDER = ProviderType.ONC;  // Production
```

## 🔐 Authentication

### Auth Provider Pattern
- Uses `authProvider` factory with mock/ONC implementations
- JWT tokens stored in localStorage
- AuthContext manages user state
- Guards: AuthGuard, GuestGuard, RoleGuard

### ONC API Integration
**Base URL:** Configurada via `ONC_API_BASE_URL` no `.env` (fallback hardcoded no código).

**Endpoints reais implementados (conferidos no código):**

*Auth* (`src/app/api/onc/auth/index.ts`):
- Login: `POST /auth/api/Login/login-by-email` — retorna o JWT como **string** em `data`
- Sign up: `POST /auth/api/Cadastro`
- Reenvio ativação: `POST /auth/api/Cadastro/resend-activation`
- Solicitar código de reset: `POST /auth/api/Login/request-code-password-reset`
- Verificar código: `POST /auth/api/Login/verify-recovery-code`
- Reset senha: `POST /auth/api/Login/do-reset-password`
- Perfil: `GET /auth/api/Users?email=...`
- Logout: `POST /auth/api/Logout`

*RBAC* (`src/app/api/onc/rbac/index.ts`) — base `/auth/api/Permission/*`:
- Roles: `roles` (POST/PUT/DELETE), `role-by-id` (GET)
- Permissions: `permissions` (GET/POST/PUT/DELETE), `permission-by-id` (GET), `role-permissions` (PUT)
- User-roles: `user-roles-by-userId` (GET), `user-roles` (PUT)

*Users* (`src/app/api/onc/users/index.ts`):
- Listar/perfil: `GET /auth/api/Users`
- Criar: `POST /auth/api/Register/register-account`
- Atualizar/Excluir: `PUT|DELETE /auth/api/Users?id=...`

## 🎨 UI Framework
- **Material-UI v7.3.8** with Emotion for styling
- **Tabler Icons** for iconography
- **TanStack Table** for data tables
- **React Hook Form** for form management
- **SWR** for data fetching

## 🚀 Development Commands
```bash
npm run dev    # Development with Turbopack
npm run build  # Production build
npm run lint   # ESLint
```

## 📚 Documentation Files

**Main Documentation:**
- `README.md` - Project overview and quick start
- `AGENTS.md` - Comprehensive project documentation
- `ARQUITETURA.md` - Technical architecture details
- `STACK.md` - Complete technology stack
- `CONTEXTO_ATUAL.md` - Current project state
- `DEV_README.md` - Quick development guide
- `INDEX_DOCUMENTACAO.md` - Documentation index

**API Integration:**
- `ONC_API_INTEGRATION.md` - ONC API integration guide
- `ONC_ENDPOINTS_IMPLEMENTATION.md` - Implemented endpoints
- `CONFIGURACAO_EMAIL_ONC.md` - Email configuration
- `SWAGGER_ANALISE_RBAC.md` - Swagger analysis for RBAC endpoints

**Architecture:**
- `PROPOSTA_ARQUITETURA_PROVIDER.md` - Multi-provider pattern proposal
- `EXEMPLO_IMPLEMENTACAO_RBAC.md` - RBAC implementation example

## 🔑 Configuration

**Environment Variables:**
```env
ONC_API_BASE_URL=http://seu-servidor-onc.com.br
NEXT_PUBLIC_VERSION=v2.1.0
```

**Key Constants in `src/config.ts`:**
```typescript
AUTH_PROVIDER = AuthType.ONC
RBAC_PROVIDER = ProviderType.MOCK  // Change to ONC for production
```

## ⚠️ Important Notes

1. **RBAC Provider**: Newly implemented, currently set to MOCK for development
2. **Tabler Icons**: Do not add to `optimizePackageImports` in next.config.mjs
3. **Authentication**: Uses JWT tokens with client-side validation
4. **CSP Headers**: Configured in next.config.mjs for security
5. **Type Safety**: Strict TypeScript mode enabled
6. **Multi-Provider Pattern**: Follow this pattern for new domains

## 🐛 Known Gotchas (armadilhas já resolvidas)

Estes são problemas reais já enfrentados neste projeto — consulte antes de depurar:

1. **`next/link` com `href={undefined}` → erro 500** (`Cannot destructure property 'auth' of ...`).
   O `formatUrl` do Next desestrutura `auth` da URL; um href indefinido quebra.
   Sempre use fallback: `href={item.url || '#'}` / `href={process.env.X || '#'}`.

2. **Login ONC retorna o JWT como STRING em `data`** (não objeto `{ token }`).
   Normalize para `{ access_token, token, ...claims }` e decodifique as claims do JWT
   para popular `id/name/email/role`. Ver `src/app/api/onc/auth/index.ts`.

3. **App Router NÃO tem navigation state.** No fluxo de recuperação de senha,
   passe token/code entre telas via `sessionStorage` (`recovery_token`, `recovery_code`),
   não via `router.state`.

4. **Rotas dinâmicas `[id]`:** o id vem em `params` (path), mas as implementações
   leem `searchParams.get('id')`. Injete o id na query no route handler (ver
   "Dynamic `[id]` Route Pattern").

5. **localStorage legado quebra o ConfigContext.** `sanitizeConfig()` roda
   sincronamente no carregamento do módulo para descartar chaves inválidas
   (evita `Cannot destructure property 'auth'` vindo de config corrompida).

6. **Token/claims:** o campo `access_token` no topo do objeto salvo é exigido por
   `axios.ts` (header Authorization), `GuestGuard` e `AuthContext`. Não salve o
   envelope cru do backend.

## 🎯 Development Patterns

### Adding New Domain with Multi-Provider

1. Add provider type to `ProviderType` enum in `src/enum.ts`
2. Add configuration constant in `src/config.ts`
3. Create provider factory in `src/app/api/{domain}/{domain}Provider.ts`
4. Implement mock version in `src/app/api/mock/{domain}/`
5. Implement ONC version in `src/app/api/onc/{domain}/`
6. Create API routes in `src/app/api/{domain}/`
7. Create utils functions in `src/utils/api/{domain}/`
8. Add types in `src/types/{domain}.ts`

### Provider Factory Pattern
```typescript
// src/app/api/{domain}/{domain}Provider.ts
import { DOMAIN_PROVIDER } from '@/config';

interface DomainProvider {
  getSomething: (request: Request) => Promise<Response>;
  // ... demais métodos
}

const providerMapping: Record<string, () => Promise<DomainProvider>> = {
  mock: () => import('@/app/api/mock/domain').then((mod) => mod.default as DomainProvider),
  onc: () => import('@/app/api/onc/domain').then((mod) => mod.default as DomainProvider)
};

export async function domainProvider() {
  return await providerMapping[DOMAIN_PROVIDER]();
}
```

> Cada implementação (`mock/domain/index.ts` e `onc/domain/index.ts`) faz `export default` de um objeto com todos os métodos da interface.

### API Route Pattern
```typescript
import { domainProvider } from '../domainProvider';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const provider = await domainProvider();
  return provider.getSomething(request);
}
```

### Dynamic `[id]` Route Pattern (IMPORTANTE)
As implementações (mock/ONC) leem o id de `searchParams.get('id')`. Em rotas
dinâmicas (`[id]`), o id chega em `params` (path param), então é preciso
**injetar o id na query** antes de repassar ao provider:
```typescript
type Context = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Context) {
  const { id } = await params;                 // Next.js 15+: params é Promise
  const url = new URL(request.url);
  url.searchParams.set('id', id);              // injeta id na query
  const newRequest = new NextRequest(url, { method: 'DELETE', headers: request.headers });
  const provider = await domainProvider();
  return provider.deleteSomething(newRequest);
}
```
Para `PUT` (com body), preserve o corpo via `const bodyText = await request.text()`
e repasse em `new NextRequest(url, { method: 'PUT', headers: request.headers, body: bodyText })`.

## 🔧 Troubleshooting

### Build Issues
```bash
rm -rf .next
npm run build
```

### RBAC Provider Not Working
- Check `RBAC_PROVIDER` in `src/config.ts`
- Verify provider implementations in `src/app/api/mock/rbac/` and `src/app/api/onc/rbac/`
- Check API routes in `src/app/api/rbac/`

### Auth Issues
- Verify `ONC_API_BASE_URL` in `.env`
- Check `AUTH_PROVIDER` in `src/config.ts`
- Clear localStorage `AUTH_USER_KEY`

## 📊 Current State

**Implemented:**
- ✅ Authentication with ONC API
- ✅ Multi-provider pattern for auth
- ✅ RBAC multi-provider pattern (Mock + ONC)
- ✅ Mock implementation for RBAC
- ✅ ONC implementation for RBAC
- ✅ API routes for RBAC
- ✅ Utils layer for RBAC
- ✅ UI integration with RBAC provider
- ✅ Users multi-provider pattern (Mock + ONC) - NEW
- ✅ Mock implementation for Users - NEW
- ✅ ONC implementation for Users - NEW
- ✅ API routes for Users - NEW
- ✅ Utils layer for Users - NEW
- ✅ UI integration with Users provider - NEW
- ✅ Permissions CRUD (Create/Update/Delete) - NEW (backend passou a expor POST/PUT/DELETE em `/auth/api/Permission/permissions`)

**In Progress:**
- 🔄 Complete UI integration testing
- 🔄 End-to-end testing with providers

**TODO (pendente de validação/decisão):**
- [ ] **Validar CRUD de Permissões end-to-end** (RBAC_PROVIDER=ONC). Fluxo criar/editar/excluir permissão na tela roles-permissions contra o backend real. Ao validar OK, marcar como concluído.
  - Rota nova: `src/app/api/rbac/permission/route.ts` (POST/PUT/DELETE) — separada de `/permissions` (que trata role-permissions) para evitar colisão.
  - Clients: `createPermission`, `updatePermission`, `deletePermission` em `src/utils/api/rbac/index.ts`.
  - Provider ONC/mock: `createPermission`/`updatePermission`/`deletePermission` em `src/app/api/{onc,mock}/rbac/index.ts`.
  - Modelo backend: `Permission { id, subject, action, conditions, fields, description, createdAt }` (estilo CASL).
- [ ] **Modelo derivado para autorização (flatten de `action` multi-valor)**. O form permite múltiplas ações por conveniência de cadastro; hoje o handler `handleCreatePermission` já explode em 1 registro por ação. Formalizar a normalização:
  - Criar tipo `EffectivePermission` (atômico) separado do DTO `Permission`.
  - Criar `normalizePermissions(raw: Permission[]): EffectivePermission[]` (puro: `flatMap` + `split` do `action`), id sintético `${p.id}:${action}`.
  - Enforcement (`can(action, subject)`) deve consumir SEMPRE o modelo derivado, nunca o payload cru.
  - Atenção: escrita (editar/excluir) volta a mirar o `id` original; `conditions`/`fields` são herdados por todas as ações expandidas.
  - Nota: hoje NÃO existe camada de enforcement fina no front (autorização é via guards de rota/role). Este modelo só entra em jogo ao implementar checagem por permissão granular.

**Planned:**
- ⏳ Production testing with ONC providers
- ⏳ Performance monitoring
- ⏳ Error handling improvements

## 🎓 Key Principles

1. **Separation of Concerns**: Each domain has its own provider
2. **Mock-First Development**: Use mock providers for UI development
3. **Type Safety**: Strong TypeScript typing throughout
4. **Consistent Patterns**: Follow established patterns for new domains
5. **Documentation First**: Document architecture and decisions

---

**Last Updated**: September 3, 2026
**Version**: 2.1.0
**Recent Changes**: Integrado CRUD completo de Permissões (backend passou a expor
POST/PUT/DELETE em `/auth/api/Permission/permissions`): nova rota
`src/app/api/rbac/permission/route.ts`, clients `createPermission`/`updatePermission`/
`deletePermission`, provider ONC+mock e handlers na view roles-permissions. Modelo
`Permission` atualizado para `{ subject, action, conditions, fields, description }`.
Dois TODOs abertos: validar CRUD end-to-end e formalizar modelo derivado
(`EffectivePermission` + `normalizePermissions`) para autorização.
