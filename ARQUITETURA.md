# Arquitetura Técnica - ONC

## 🎯 Decisões Arquiteturais

### 1. Framework & Roteamento

**Next.js 16 com App Router**
- **Por que**: Server-side rendering por padrão, melhor SEO, performance
- **Route Groups**: `(admin)` e `(auth)` para organização lógica e compartilhamento de layouts
- **Server Components**: Maximizado para performance, Client Components apenas onde necessário
- **Turbopack**: Bundler mais rápido para desenvolvimento

**Padrão de Roteamento**
```
src/app/
├── (admin)/          # Rotas protegidas, layout compartilhado
│   ├── layout.tsx    # AdminLayout + AuthGuard + RoleGuard
│   └── users/        # /users
├── (auth)/           # Rotas públicas, layout compartilhado
│   ├── layout.tsx    # AuthLayout + GuestGuard
│   └── login/        # /login
└── layout.tsx        # Root layout com providers globais
```

### 2. Gerenciamento de Estado

**Arquitetura de Estado em Camadas**

1. **Global Contexts** (React Context)
   - AuthContext: Estado de autenticação
   - ConfigContext: Configurações globais

2. **Local State** (useState/useReducer)
   - Estado de componentes individuais
   - Formulários com react-hook-form

3. **Server State** (SWR)
   - Cache de dados da API
   - Revalidação automática
   - Loading states

**Decisão**: React Context para estado global simples, SWR para dados do servidor

### 3. Autenticação & Autorização

**Estratégia de Autenticação**
- JWT tokens armazenados no localStorage
- Validação de expiração no client-side
- API ONC como backend de autenticação
- Interceptors Axios para injeção de tokens

**Camadas de Proteção**
```
Route Request
    ↓
GuestGuard (rotas públicas)
    ↓
AuthGuard (rotas privadas)
    ↓
RoleGuard (permissões específicas)
    ↓
Componente
```

**Decisão**: Guards compostos para máxima flexibilidade e segurança

### 4. UI Framework

**Material-UI v7**
- **Por que**: Componentes consistentes, acessibilidade, theme system robusto
- **Emotion**: CSS-in-JS para estilização dinâmica
- **Customização**: Sobrescritas em `src/themes/overrides/`

**Sistema de Temas**
- Paleta customizada
- Tipografia configurável
- Componentes sobrescritos
- Suporte a dark/light mode

**Decisão**: MUI por maturidade e ecossistema, Emotion por performance

### 5. API Layer

**Arquitetura de API**
```
Component
    ↓
src/utils/api/auth/* (funções tipadas)
    ↓
src/utils/axios (cliente configurado)
    ↓
src/app/api/* (Next.js API Routes)
    ↓
API ONC (backend externo)
```

**Padrões**
- Funções centralizadas em `src/utils/api/`
- Tipos TypeScript para requests/responses
- Tratamento de erros consistente
- Interceptors para auth/retry

**Decisão**: API Routes como proxy para segurança e CORS

### 6. TypeScript

**Configuração Strict**
- `strict: true` habilitado
- Path aliases `@/*` para imports limpos
- Type checking em build time
- Interfaces para todos os dados

**Decisão**: Type safety em tempo de compilação

## 🏛️ Padrões de Design

### 1. Component Patterns

**Compound Components**
```typescript
<AdminLayout>
  <HeaderContent />
  <DrawerContent />
  {children}
</AdminLayout>
```

**Higher-Order Components**
```typescript
export default function Layout({ children }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <RoleGuard>
          <AdminLayout>{children}</AdminLayout>
        </RoleGuard>
      </AuthGuard>
    </AuthProvider>
  );
}
```

**Custom Hooks**
```typescript
const { user, isProcessing } = useAuth();
const { state, setField } = useConfig();
```

### 2. Data Fetching Patterns

**SWR Pattern**
```typescript
const { data, error, isLoading } = useSWR('/api/users', fetcher);
```

**React Hook Form + Zod**
```typescript
const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema)
});
```

### 3. Error Handling

**Centralized Error Handling**
```typescript
// src/utils/attempt.ts
export async function attempt(promise) {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
```

**Padrão de Uso**
```typescript
const { data, error } = await login(formData);
if (error) {
  // Tratar erro
}
```

### 4. Code Organization

**Barrel Exports**
```typescript
// src/utils/api/auth/index.ts
export { login } from './login';
export { signUp } from './signUp';
// ...
```

**Feature-Based Structure**
```
src/
├── components/        # Componentes genéricos
├── sections/          # Componentes de feature
├── layouts/           # Layouts
└── views/             # Views completas
```

## 🔐 Segurança

### 1. Content Security Policy
```javascript
// next.config.mjs
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' ${ONC_API_URL};
`;
```

### 2. Authentication Security
- JWT tokens com expiração
- Validação de token em cada request
- Limpeza de localStorage no logout
- HttpOnly cookies (opcional para produção)

### 3. Input Validation
- Schemas Zod/Yup para validação
- Sanitização de inputs
- XSS prevention via React

### 4. API Security
- Rate limiting (via API ONC)
- CORS configurado
- Environment variables para secrets

## 🚀 Performance

### 1. Code Splitting
- Dynamic imports para componentes pesados
- Route-based splitting automático
- Lazy loading de layouts

### 2. Image Optimization
- Next.js Image component
- WebP/AVIF formatos
- Lazy loading automático

### 3. Bundle Optimization
```javascript
// next.config.mjs
experimental: {
  optimizePackageImports: ['@mui/material', 'lodash-es']
}
```

### 4. Caching
- SWR para dados da API
- Service Worker (opcional)
- Browser caching headers

## 📱 Responsividade

### Breakpoints (MUI)
```typescript
{
  xs: 0,    // Mobile
  sm: 600,  // Tablet
  md: 900,  // Desktop pequeno
  lg: 1200, // Desktop grande
  xl: 1536  // Desktop extra grande
}
```

### Estratégias
- Mobile-first approach
- Drawer colapsável em mobile
- Grid adaptativo
- Touch-friendly components

## 🌐 Internacionalização

### Configuração
```typescript
// react-intl
<IntlProvider locale={locale} messages={messages}>
  {children}
</IntlProvider>
```

### Estrutura
```
src/utils/locales/
├── pt-BR.json
├── en-US.json
└── es-ES.json
```

## 🧪 Testing Strategy

### Unit Tests (Planejado)
- Componentes isolados
- Hooks customizados
- Funções utilitárias

### Integration Tests (Planejado)
- Fluxos de autenticação
- API routes
- Guards de rota

### E2E Tests (Planejado)
- Playwright ou Cypress
- Fluxos críticos de usuário
- Cross-browser testing

## 📊 Monitoramento & Logging

### Client-side
- Error boundaries
- Console logging (desenvolvimento)
- Sentry (opcional para produção)

### Server-side
- Next.js analytics
- API ONC logs
- Performance monitoring

## 🔧 Configuração

### Environment Variables
```env
# .env
ONC_API_BASE_URL=http://seu-servidor.com.br
NEXT_PUBLIC_VERSION=v2.1.0
```

### Config Files
- `next.config.mjs` - Configuração Next.js
- `tsconfig.json` - Configuração TypeScript
- `eslint.config.mjs` - Linting
- `.prettierrc` - Formatação

## 🔄 CI/CD (Planejado)

### Pipeline
1. Lint & Prettier
2. Type check
3. Unit tests
4. Build
5. E2E tests
6. Deploy

### Deploy Targets
- Vercel (recomendado para Next.js)
- Docker containers
- Kubernetes (escala)

## 📈 Escalabilidade

### Horizontal Scaling
- Stateless API routes
- CDN para assets
- Database connection pooling

### Vertical Scaling
- Server-side rendering
- Edge functions
- Caching estratégico

## 🎓 Convenções da Equipe

### Commits
```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
refactor: refatorar código
```

### Code Review
- Mínimo 1 approval
- Checks de CI passando
- Sem conflicts

### Branching
```
main        → Produção
develop     → Desenvolvimento
feature/*   → Features
bugfix/*    → Bug fixes
```

## 🚨 Decisões Técnicas Pendentes

1. **State Management**: Considerar Redux/Zustand se estado crescer
2. **Testing**: Implementar suite de testes
3. **Monitoring**: Adicionar Sentry ou similar
4. **PWA**: Considerar Progressive Web App
5. **SSR**: Avaliar necessidade de SSR para páginas específicas

## 📚 Recursos de Aprendizado

### Next.js
- https://nextjs.org/docs
- https://nextjs.org/learn

### Material-UI
- https://mui.com/
- https://mui.com/material-ui/getting-started/

### TypeScript
- https://www.typescriptlang.org/docs/
- https://www.totaltypescript.com/

### React
- https://react.dev/
- https://react.dev/learn
