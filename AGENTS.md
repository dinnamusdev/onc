# ONC - Sistema de Gestão e Autenticação

## 📋 Visão Geral

Aplicação web SaaS construída com Next.js 16, React 19 e Material-UI 7, focada em gestão de usuários, papéis e permissões com integração à API ONC para autenticação.

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
src/
├── app/                      # Next.js App Router
│   ├── (admin)/             # Route group para páginas administrativas
│   │   ├── layout.tsx       # Layout principal com guards de autenticação
│   │   ├── users/           # Gestão de usuários
│   │   └── roles-permissions/ # Gestão de papéis e permissões
│   ├── (auth)/              # Route group para autenticação
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de registro
│   │   └── forgot-password/ # Recuperação de senha
│   ├── api/                 # API Routes (Next.js)
│   │   ├── auth/            # Endpoints de autenticação
│   │   ├── onc/             # Integração com API ONC
│   │   └── mock/            # Mock data para desenvolvimento
│   └── layout.tsx           # Root layout
├── components/              # Componentes reutilizáveis
│   ├── cards/               # Cards especializados
│   ├── dialog/              # Componentes de diálogo
│   ├── header/              # Componentes de cabeçalho
│   └── third-party/         # Integrações com terceiros (charts, tables)
├── contexts/                # React Context Providers
│   ├── AuthContext.tsx      # Gerenciamento de autenticação
│   └── ConfigContext.tsx    # Gerenciamento de configurações globais
├── layouts/                 # Layouts da aplicação
│   ├── AdminLayout/         # Layout do painel administrativo
│   └── AuthLayout/          # Layout de autenticação
├── menu/                    # Configuração de navegação
│   ├── pages.tsx            # Menu de páginas
│   └── other.tsx            # Outros itens de menu
├── sections/                # Seções de página
│   ├── auth/                # Seções de autenticação
│   ├── permissions/         # Seções de permissões
│   ├── roles/               # Seções de papéis
│   └── users/               # Seções de usuários
├── themes/                  # Configuração de temas
│   ├── overrides/           # Sobrescritas de componentes MUI
│   ├── theme/               # Configurações de tema
│   ├── palette.ts           # Paleta de cores
│   └── typography.ts       # Tipografia
├── types/                   # Definições TypeScript
│   ├── auth.ts              # Tipos de autenticação
│   ├── config.ts            # Tipos de configuração
│   └── overrides/           # Tipos de sobrescritas
├── utils/                   # Utilitários
│   ├── api/                 # Clientes de API
│   │   └── auth/            # Funções de autenticação
│   ├── route-guard/         # Guards de rota
│   ├── validation-schema/   # Schemas de validação
│   └── locales/             # Internacionalização
├── hooks/                   # Custom React Hooks
├── states/                  # Estado global
└── views/                   # Views principais
    ├── admin/               # Views administrativas
    └── auth/                # Views de autenticação
```

### Padrões de Arquitetura

#### 1. Route Groups (Next.js App Router)
- `(admin)`: Rotas administrativas com autenticação obrigatória
- `(auth)`: Rotas de autenticação para usuários não autenticados
- Layouts aninhados com guards específicos

#### 2. Context Providers
- **AuthContext**: Gerencia estado de autenticação e dados do usuário
- **ConfigContext**: Gerencia configurações globais (tema, idioma, layout)

#### 3. Route Guards
- **AuthGuard**: Protege rotas administrativas
- **GuestGuard**: Protege rotas de autenticação
- **RoleGuard**: Verifica permissões de usuário

#### 4. API Layer
- API Routes do Next.js como proxy para serviços externos
- Cliente Axios configurado com interceptors
- Funções utilitárias centralizadas em `src/utils/api/`

## 🎨 Design System

### Stack de UI

- **Framework**: Material-UI v7.3.8
- **Ícones**: Tabler Icons (@tabler/icons-react)
- **Styled Components**: Emotion (@emotion/react, @emotion/styled)
- **Scrollbar**: Simplebar React
- **Notificações**: Notistack

### Sistema de Temas

#### Tema Principal
- **Paleta**: Customizada em `src/themes/palette.ts`
- **Tipografia**: Configurada em `src/themes/typography.ts`
- **Sobrescritas**: Componentes MUI customizados em `src/themes/overrides/`

#### Configurações de Tema
- **Temas**: Light/Dark mode
- **Direção**: LTR/RTL suportado
- **Layout**: Mini drawer, responsive drawer
- **Internacionalização**: Multi-idioma via react-intl

### Componentes Customizados

#### Cards
- BehaviorCard
- OverviewCard
- PerformanceCard
- PresentationCard
- ProgressCard
- SettingCard
- VideoCard

#### Layout Components
- AdminLayout com Drawer responsivo
- Header com navegação
- Drawer content com menu configurável

## 🔧 Stack Tecnológica

### Core
- **Framework**: Next.js 16.1.6
- **React**: 19.2.4
- **TypeScript**: 5.9.3
- **Build Tool**: Turbopack (Next.js 16)

### UI Components
- **Material-UI**: 7.3.8
- **Emotion**: 11.14.0 (CSS-in-JS)
- **Tabler Icons**: 3.37.1
- **TanStack Table**: 8.21.3 (Tabelas)

### Autenticação & API
- **Axios**: 1.13.5 (Cliente HTTP)
- **SWR**: 2.5.1 (Data fetching)
- **React Hook Form**: 7.71.2 (Formulários)
- **React OTP Input**: 3.1.1 (Verificação 2FA)

### Utilitários
- **Lodash-es**: 4.17.23 (Funções utilitárias)
- **React Device Detect**: 2.2.3 (Detecção de dispositivo)
- **React Dropzone**: 19.3.0 (Upload de arquivos)

### Ferramentas de Desenvolvimento
- **ESLint**: 9.39.3
- **Prettier**: 3.8.1
- **TypeScript**: 5.9.3

## 🔐 Autenticação

### Fluxo de Autenticação

#### 1. Login
- Usuário insere credenciais
- Requisição para `/api/auth/login`
- API ONC valida credenciais
- Token JWT armazenado no localStorage
- Dados do usuário no contexto global

#### 2. Recuperação de Senha
- Usuário solicita recuperação
- API ONC gera código de 6 dígitos
- Código enviado por email
- Validação do código via `/api/auth/verifyRecoveryCode`
- Reset de senha via `/api/auth/resetPassword`

#### 3. Guards de Autenticação
- AuthGuard: Verifica se usuário está autenticado
- GuestGuard: Verifica se usuário NÃO está autenticado
- RoleGuard: Verifica permissões específicas

### Integração API ONC

#### Configuração
```env
ONC_API_BASE_URL=http://seu-servidor-onc.com.br
```

#### Endpoints Principais
- `POST /auth/api/Login/login` - Login
- `POST /auth/api/Login/request-code-password-reset` - Solicitar código de recuperação
- `POST /auth/api/Login/verify-recovery-code` - Validar código
- `POST /auth/api/Login/do-reset-password` - Resetar senha

## 📱 Responsividade

### Breakpoints
- Mobile: < 600px
- Tablet: 600px - 900px
- Desktop: > 900px

### Layout Adaptativo
- Drawer colapsável em mobile
- Menu responsivo
- Grid system do MUI
- Componentes adaptativos

## 🌐 Internacionalização

### Configuração
- Biblioteca: react-intl 8.1.3
- Locale files: `src/utils/locales/`
- ConfigContext gerencia idioma atual

## 🗄️ Estado Global

### Contexts
- **AuthContext**: Dados do usuário, estado de autenticação
- **ConfigContext**: Configurações de tema, layout, idioma

### Hooks Customizados
- useLocalStorage: Persistência de configurações
- useAuth: Acesso ao contexto de autenticação
- useConfig: Acesso ao contexto de configuração

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com Turbopack
npm run build        # Build de produção
npm run start        # Iniciar servidor de produção
npm run lint         # Executar ESLint
npm run lint:fix     # Corrigir problemas ESLint
npm run prettier     # Formatar código com Prettier
```

## 🔒 Segurança

### CSP (Content Security Policy)
Configurado em `next.config.mjs`:
- Script sources restritos
- Connect sources com whitelist
- Font e image sources restritos

### Autenticação
- JWT tokens com expiração
- Validação de token no client-side
- Logout com limpeza de localStorage

### Validação
- Schemas de validação com react-hook-form
- Validação de formulários no client-side
- Sanitização de inputs

## 📦 Build & Deploy

### Otimizações
- Turbopack para builds mais rápidos
- optimizePackageImports para tree-shaking
- Imagens otimizadas via Next.js Image
- Code splitting automático

### Configurações Importantes
- Não incluir @tabler/icons-react no optimizePackageImports (uso dinâmico)
- CSP headers configurados
- Imagens remotas configuradas (flagcdn.com)

## 🧪 Desenvolvimento

### Mock Data
- Mock services em `src/app/api/mock/`
- Dados de teste para autenticação
- Ambiente de desenvolvimento isolado

### Verificação
- Executar `npm run lint` antes de commits
- Verificar build com `npm run build`
- Testar em múltiplos navegadores

## 📝 Convenções de Código

### Estrutura de Imports
```typescript
// @next
import { Metadata } from 'next';

// @mui
import { Button } from '@mui/material';

// @project
import { myFunction } from '@/utils/myFunction';

// @types
import { MyType } from '@/types/myType';
```

### TypeScript
- Strict mode habilitado
- Path aliases configurados (@/*)
- Type checking rigoroso

### Estilização
- Material-UI components como base
- Emotion para customizações
- Tema centralizado em `src/themes/`

## 🔗 Integrações Externas

### API ONC
- Autenticação de usuários
- Gestão de credenciais
- Recuperação de senha com email

### Firebase (Configurado mas não ativo)
- Autenticação opcional
- Configuração em CSP

### Supabase (Configurado mas não ativo)
- Database opcional
- Configuração em CSP

## 📚 Documentação Adicional

- ONC_API_INTEGRATION.md - Detalhes da integração com API ONC
- ONC_ENDPOINTS_IMPLEMENTATION.md - Implementação de endpoints
- CONFIGURACAO_EMAIL_ONC.md - Configuração de email
- backend.url.txt - URL do backend

## 🎯 Principais Funcionalidades

1. **Autenticação**: Login, registro, recuperação de senha
2. **Gestão de Usuários**: CRUD de usuários
3. **Papéis e Permissões**: Sistema RBAC
4. **Dashboard**: Visão geral do sistema
5. **Tema**: Light/Dark mode
6. **Internacionalização**: Multi-idioma
7. **Layout Responsivo**: Adaptação a todos os dispositivos

## 🔄 Fluxo de Trabalho

### Para Adicionar Nova Página
1. Criar rota em `src/app/(admin)/` ou `src/app/(auth)/`
2. Adicionar item ao menu em `src/menu/pages.tsx`
3. Criar componentes em `src/components/` ou `src/sections/`
4. Adicionar tipos em `src/types/`
5. Testar responsividade

### Para Integrar Novo Endpoint
1. Adicionar função em `src/utils/api/`
2. Criar API Route em `src/app/api/`
3. Adicionar tipos TypeScript
4. Documentar em markdown apropriado

### Para Modificar Tema
1. Editar `src/themes/palette.ts` para cores
2. Editar `src/themes/typography.ts` para fontes
3. Adicionar sobrescritas em `src/themes/overrides/`
4. Testar em light/dark mode

## ⚠️ Observações Importantes

1. **Turbopack**: Next.js 16 usa Turbopack por padrão, gerencia cache automaticamente
2. **Tabler Icons**: Não usar optimizePackageImports devido ao acesso dinâmico
3. **CSP**: Headers de segurança configurados no next.config.mjs
4. **LocalStorage**: Dados de autenticação e configurações persistidos localmente
5. **API ONC**: Configurar URL base no .env antes de usar

## 🐛 Troubleshooting

### Build Issues
- Limpar cache: `rm -rf .next`
- Reinstalar dependências: `rm -rf node_modules && npm install`

### Auth Issues
- Verificar configuração ONC_API_BASE_URL
- Limpar localStorage
- Verificar CSP headers

### Theme Issues
- Verificar ConfigContext
- Limpar localStorage da chave 'saas-able-react-mui-admin-vite-ts'
- Verificar sobrescritas em src/themes/overrides/

## 📞 Suporte

Para dúvidas sobre o template base:
- Documentação: https://phoenixcoded.gitbook.io/saasable/admin
- Suporte: https://support.phoenixcoded.net/

Para integrações ONC:
- Ver documentação em ONC_API_INTEGRATION.md
- ONC_ENDPOINTS_IMPLEMENTATION.md
- CONFIGURACAO_EMAIL_ONC.md
