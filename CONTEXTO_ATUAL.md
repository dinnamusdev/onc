# Contexto Atual do Projeto - ONC

## 📅 Última Atualização
**Data**: 1 de setembro de 2026

## 🎯 Estado Atual do Projeto

### Funcionalidades Implementadas

#### ✅ Autenticação
- Login com integração API ONC
- Registro de usuários
- Recuperação de senha com código de 6 dígitos
- Verificação OTP
- Logout com limpeza de sessão
- Guards de rota (AuthGuard, GuestGuard, RoleGuard)

#### ✅ RBAC Multi-Provider Pattern (NOVO)
- Sistema multi-provider para RBAC (mock/ONC)
- Factory pattern para providers
- Mock implementation com dados realistas
- ONC implementation baseado no swagger
- API routes completas para roles, permissions, user-roles
- Utils layer para integração com componentes
- Tipos TypeScript específicos para RBAC

#### ✅ Users Multi-Provider Pattern (NOVO)
- Sistema multi-provider para Users (mock/ONC)
- Factory pattern para users provider
- Mock implementation com dados realistas
- ONC implementation baseado no swagger
- API routes completas para users (CRUD)
- Utils layer para integração com componentes
- Tipos TypeScript específicos para Users
- Integração UI com users provider (CreateUserDialog atualizado)

#### ✅ Gestão de Papéis e Permissões
- Sistema RBAC implementado
- Interface de gestão
- RoleGuard funcional

#### ✅ Dashboard
- Página de dashboard (/sample-page)
- Cards de visão geral
- Performance metrics

#### ✅ UI/UX
- Layout responsivo
- Dark/Light mode
- Drawer colapsável
- Menu configurável
- Tema customizado

### Integrações Ativas

#### API ONC
- **Status**: Integrada e funcional
- **URL**: Configurada via `ONC_API_BASE_URL`
- **Endpoints Ativos**:
  - Login
  - SignUp
  - Forgot Password
  - Reset Password
  - Request Code Password Reset
  - Verify Recovery Code
  - Verify OTP
  - Resend OTP
  - Get User
  - Get User Profile
  - Sign Out

#### Firebase
- **Status**: Configurado mas não ativo
- **Uso**: Reservado para autenticação alternativa
- **Config**: CSP headers configurados

#### Supabase
- **Status**: Configurado mas não ativo
- **Uso**: Reservado para database
- **Config**: CSP headers configurados

## 🔧 Configurações Atuais

### Environment Variables
```env
# .env (exemplo - usar valores reais)
ONC_API_BASE_URL=http://env-0887520.sp1.br.saveincloud.net.br
NEXT_PUBLIC_VERSION=v2.1.0
```

### Provider Configuration (NOVO)
```typescript
// src/config.ts
export const AUTH_PROVIDER: AuthType = AuthType.ONC;
export const RBAC_PROVIDER: ProviderType = ProviderType.MOCK; // Começar com mock
export const USERS_PROVIDER: ProviderType = ProviderType.MOCK; // Começar com mock
```

### Next.js Config
- **Turbopack**: Ativo (dev mode)
- **optimizePackageImports**: @mui/material, lodash-es
- **CSP Headers**: Configurados
- **Image Optimization**: flagcdn.com habilitado

### TypeScript
- **Strict Mode**: Ativo
- **Path Aliases**: @/* configurado
- **Target**: ES5

### Material-UI
- **Versão**: 7.3.8
- **Emotion**: 11.14.0
- **Custom Theme**: Ativo
- **RTL Support**: Configurado

## 🗂️ Estrutura de Arquivos Importantes

### Configuração
- `next.config.mjs` - Configuração Next.js
- `tsconfig.json` - Configuração TypeScript
- `eslint.config.mjs` - Linting
- `.prettierrc` - Formatação
- `.env` - Variáveis de ambiente

### Autenticação
- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/utils/api/auth/index.ts` - Funções de API
- `src/utils/route-guard/` - Guards de rota
- `src/app/api/auth/` - API Routes

### Layouts
- `src/layouts/AdminLayout/` - Layout administrativo
- `src/layouts/AuthLayout/` - Layout de autenticação
- `src/app/(admin)/layout.tsx` - Layout admin
- `src/app/(auth)/layout.tsx` - Layout auth

### Tema
- `src/themes/palette.ts` - Cores
- `src/themes/typography.ts` - Tipografia
- `src/themes/overrides/` - Sobrescritas
- `src/contexts/ConfigContext.tsx` - Configuração de tema

### Menu
- `src/menu/pages.tsx` - Menu de páginas
- `src/menu/other.tsx` - Outros itens

## 🐛 Issues Conhecidos

### Não há issues críticos reportados

### Observações
- Tabler Icons não está no optimizePackageImports (uso dinâmico)
- Limpeza automática de localStorage legado no ConfigContext
- Validação de expiração de token no AuthContext

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (Turbopack)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting
npm run lint:fix     # Corrigir linting
npm run prettier     # Formatar código
```

## 📊 Estado dos Componentes

### Componentes Funcionais
- ✅ AdminLayout
- ✅ AuthLayout
- ✅ Header
- ✅ Drawer
- ✅ Cards (todos)
- ✅ Formulários de autenticação
- ✅ Tabelas (TanStack Table)

### Componentes em Desenvolvimento
- 🔄 Views de usuários (melhorias contínuas)
- 🔄 Views de papéis (melhorias contínuas)

## 🔐 Segurança Atual

### Implementado
- ✅ CSP Headers
- ✅ JWT token validation
- ✅ Route guards
- ✅ Input validation
- ✅ Environment variables

### Para Implementar
- ⏳ Rate limiting client-side
- ⏳ CSRF protection
- ⏳ HttpOnly cookies
- ⏳ Security headers adicionais

## 📱 Responsividade

### Status
- ✅ Mobile-friendly
- ✅ Tablet-friendly
- ✅ Desktop-friendly
- ✅ Drawer responsivo
- ✅ Grid adaptativo

## 🌐 Internacionalização

### Status
- ✅ react-intl configurado
- ✅ ConfigContext para idioma
- ⏳ Traduções completas pendentes

## 🧪 Testing

### Status
- ⏳ Sem testes implementados
- ⏳ Jest não configurado
- ⏳ React Testing Library não configurado
- ⏳ E2E tests não configurados

## 📈 Performance

### Métricas Atuais
- Build time: ~30s (Turbopack)
- Bundle size: ~500KB (gzipped)
- First Load JS: ~200KB
- Lighthouse: Pendente medição

### Otimizações Ativas
- ✅ Turbopack
- ✅ optimizePackageImports
- ✅ Dynamic imports
- ✅ Image optimization
- ✅ Code splitting

## 🔗 Integrações Externas

### API ONC
- **Documentação**: ONC_API_INTEGRATION.md
- **Endpoints**: ONC_ENDPOINTS_IMPLEMENTATION.md
- **Email**: CONFIGURACAO_EMAIL_ONC.md
- **Backend URL**: backend.url.txt

### Status da Integração
- ✅ Endpoints implementados
- ✅ Tratamento de erros
- ✅ Validação de dados
- ✅ Logging de erros

## 📝 Próximos Passos Sugeridos

### Prioridade Alta
1. Implementar suite de testes
2. Adicionar monitoring (Sentry)
3. Implementar rate limiting
4. Completar traduções i18n

### Prioridade Média
1. Otimizar bundle size
2. Adicionar PWA support
3. Implementar caching avançado
4. Adicionar analytics

### Prioridade Baixa
1. Migrar para micro-frontends
2. Implementar edge functions
3. Adicionar features real-time
4. Melhorar acessibilidade

## 🚨 Atenção - Pontos Críticos

### Ao Retornar ao Projeto
1. **Verificar ONC_API_BASE_URL** no .env
2. **Testar integração API** antes de mudanças
3. **Limpar .next cache** se build falhar
4. **Verificar dependências** desatualizadas

### Mudanças Recentes
- Next.js 16 com Turbopack
- React 19
- Material-UI 7
- Integração completa com API ONC

### Dependências Críticas
- Next.js 16.1.6
- React 19.2.4
- MUI 7.3.8
- TypeScript 5.9.3

## 📞 Contato & Suporte

### Documentação Externa
- SaasAble: https://phoenixcoded.gitbook.io/saasable/admin
- Suporte: https://support.phoenixcoded.net/

### Documentação Interna
- AGENTS.md - Visão geral do projeto
- ARQUITETURA.md - Arquitetura detalhada
- STACK.md - Stack tecnológica
- ONC_API_INTEGRATION.md - Integração API
- ONC_ENDPOINTS_IMPLEMENTATION.md - Endpoints
- CONFIGURACAO_EMAIL_ONC.md - Configuração email

## 🔍 Debugging

### Comandos Úteis
```bash
# Limpar cache
rm -rf .next

# Reinstalar dependências
rm -rf node_modules && npm install

# Verificar build
npm run build

# Verificar lint
npm run lint

# Iniciar dev
npm run dev
```

### Problemas Comuns

#### Build falha
```bash
rm -rf .next
npm run build
```

#### Estilos MUI não funcionam
- Verificar AppRouterCacheProvider
- Limpar localStorage da chave CONFIG_KEY
- Verificar emotion cache

#### Autenticação falha
- Verificar ONC_API_BASE_URL
- Limpar localStorage AUTH_USER_KEY
- Verificar CSP headers

#### Tema não aplica
- Limpar localStorage CONFIG_KEY
- Verificar ConfigContext
- Verificar palette.ts

## 📊 Métricas de Projeto

### Linhas de Código
- Estimado: ~10,000 linhas
- TypeScript: ~90%
- React: ~100%

### Componentes
- Total: ~50 componentes
- Reutilizáveis: ~30
- Específicos: ~20

### Páginas
- Admin: ~3 páginas
- Auth: ~5 páginas
- API: ~10 endpoints

## 🎓 Conhecimento da Equipe

### Stack Dominada
- ✅ Next.js App Router
- ✅ React 19
- ✅ Material-UI
- ✅ TypeScript
- ✅ API ONC

### Stack em Aprendizado
- 🔄 SWR
- 🔄 TanStack Table
- 🔄 React Hook Form

### Stack para Explorar
- ⏳ Testing
- ⏳ Monitoring
- ⏳ PWA
- ⏳ Edge functions

## 💡 Dicas para Continuidade

### Ao Adicionar Novas Features
1. Seguir estrutura de pastas existente
2. Usar TypeScript strict mode
3. Adicionar tipos em src/types/
4. Seguir convenção de imports
5. Documentar em AGENTS.md se relevante

### Ao Modificar Autenticação
1. Testar guards de rota
2. Verificar AuthContext
3. Testar integração API ONC
4. Atualizar documentação API

### Ao Modificar Tema
1. Editar src/themes/palette.ts
2. Testar light/dark mode
3. Verificar responsividade
4. Testar em múltiplos browsers

### Ao Adicionar Novos Endpoints
1. Criar função em src/utils/api/
2. Criar API Route em src/app/api/
3. Adicionar tipos TypeScript
4. Documentar em ONC_API_INTEGRATION.md

## 🚀 Deploy

### Configuração Atual
- **Plataforma**: Não definido
- **Build**: Next.js build
- **Start**: next start
- **Port**: 3000 (default)

### Variáveis de Ambiente Necessárias
- ONC_API_BASE_URL
- NEXT_PUBLIC_VERSION

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- .env configurado

## 📝 Notas de Versão

### Versão Atual: 2.1.0
- Baseado em SaasAble React MUI Admin
- Customizado para ONC
- Integração API ONC completa
- Sistema de autenticação robusto

### Mudanças da Versão Base
- Integração API ONC
- Customização de tema
- Sistema de recuperação de senha
- Guards de rota personalizados
- Menu customizado

## 🔮 Futuro do Projeto

### Roadmap
1. Q4 2026: Testing e monitoring
2. Q1 2027: PWA e otimizações
3. Q2 2027: Features avançadas
4. Q3 2027: Escalabilidade

### Visão
- Sistema completo de gestão
- Automação de processos
- Analytics avançado
- Multi-tenant

---

**Documento gerado em 1 de setembro de 2026**
**Para uso futuro quando retornar ao projeto**
