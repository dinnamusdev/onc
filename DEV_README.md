# Guia Rápido de Desenvolvimento - ONC

## 🚀 Início Rápido

### 1. Configurar Ambiente
```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Editar .env com ONC_API_BASE_URL correto
```

### 2. Iniciar Desenvolvimento
```bash
npm run dev
```
Acessar: http://localhost:3000

### 3. Build de Produção
```bash
npm run build
npm run start
```

## 📚 Documentação Importante

### Para Entender o Projeto
- **AGENTS.md** - Visão geral, arquitetura, stack
- **ARQUITETURA.md** - Arquitetura técnica detalhada
- **STACK.md** - Stack tecnológica completa
- **CONTEXTO_ATUAL.md** - Estado atual do projeto

### Para Integração API
- **ONC_API_INTEGRATION.md** - Integração com API ONC
- **ONC_ENDPOINTS_IMPLEMENTATION.md** - Endpoints implementados
- **CONFIGURACAO_EMAIL_ONC.md** - Configuração de email

## 🏗️ Estrutura do Projeto

```
src/
├── app/              # Next.js App Router
│   ├── (admin)/     # Páginas administrativas
│   ├── (auth)/      # Páginas de autenticação
│   └── api/         # API Routes
├── components/      # Componentes reutilizáveis
├── contexts/        # React Contexts
├── layouts/         # Layouts
├── themes/          # Configuração de tema
├── utils/           # Utilitários
│   └── api/        # Clientes de API
└── types/          # Tipos TypeScript
```

## 🔧 Tarefas Comuns

### Adicionar Nova Página
1. Criar rota em `src/app/(admin)/` ou `src/app/(auth)/`
2. Adicionar item ao menu em `src/menu/pages.tsx`
3. Criar componentes em `src/sections/` ou `src/components/`

### Adicionar Novo Endpoint API
1. Criar função em `src/utils/api/`
2. Criar API Route em `src/app/api/`
3. Adicionar tipos em `src/types/`
4. Documentar em ONC_API_INTEGRATION.md

### Modificar Tema
1. Editar `src/themes/palette.ts` (cores)
2. Editar `src/themes/typography.ts` (fontes)
3. Adicionar sobrescritas em `src/themes/overrides/`

### Modificar Autenticação
1. Editar `src/contexts/AuthContext.tsx`
2. Modificar `src/utils/api/auth/index.ts`
3. Testar guards em `src/utils/route-guard/`

## 🐛 Troubleshooting

### Build Falha
```bash
rm -rf .next
npm run build
```

### Estilos Não Funcionam
```bash
# Limpar localStorage
localStorage.removeItem('saas-able-react-mui-admin-vite-ts')
```

### Autenticação Falha
1. Verificar `ONC_API_BASE_URL` no .env
2. Limpar localStorage: `AUTH_USER_KEY`
3. Verificar CSP headers em `next.config.mjs`

### Dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔐 Configuração Obrigatória

### .env
```env
ONC_API_BASE_URL=http://seu-servidor-onc.com.br
NEXT_PUBLIC_VERSION=v2.1.0
```

## 📦 Stack Principal

- **Next.js**: 16.1.6 (App Router, Turbopack)
- **React**: 19.2.4
- **TypeScript**: 5.9.3
- **Material-UI**: 7.3.8
- **Axios**: 1.13.5
- **SWR**: 2.5.1

## 🚨 Atenção

### Ao Retornar ao Projeto
1. Verificar `ONC_API_BASE_URL` no .env
2. Ler `CONTEXTO_ATUAL.md` para estado atual
3. Limpar `.next` cache se build falhar
4. Verificar dependências desatualizadas

### Não Fazer
- ❌ Adicionar @tabler/icons-react no optimizePackageImports
- � ignorar erros de TypeScript
- ❌ Commitar .env com secrets
- ❌ Modificar estrutura de pastas sem necessidade

## 📞 Suporte

### Documentação SaasAble
- https://phoenixcoded.gitbook.io/saasable/admin
- https://support.phoenixcoded.net/

### Documentação Interna
- Ver arquivos .md na raiz do projeto

## ✅ Checklist Antes de Commit

1. `npm run lint` - Sem erros
2. `npm run build` - Build funciona
3. Tipos TypeScript - Sem erros
4. Documentação atualizada (se necessário)

## 🎯 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Servidor produção
npm run lint         # Verificar código
npm run lint:fix     # Corrigir código
npm run prettier     # Formatar código
```

---

**Última atualização**: 1 de setembro de 2026
**Versão**: 2.1.0
