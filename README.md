# ONC - Sistema de Gestão e Autenticação

Sistema web SaaS construído com Next.js 16, React 19 e Material-UI 7, focado em gestão de usuários, papéis e permissões com integração à API ONC para autenticação.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn

### Instalação

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

3. Editar `.env` com a URL da API ONC:
```env
ONC_API_BASE_URL=http://seu-servidor-onc.com.br
```

4. Iniciar desenvolvimento:
```bash
npm run dev
```

5. Acessar: http://localhost:3000

## 📚 Documentação

### Documentação do Projeto
Para entender completamente o projeto, consulte a documentação completa:

👉 **[INDEX_DOCUMENTACAO.md](./INDEX_DOCUMENTACAO.md)** - Índice completo da documentação

### Documentos Principais

| Documento | Descrição |
|-----------|-----------|
| [DEV_README.md](./DEV_README.md) | Guia rápido de desenvolvimento |
| [AGENTS.md](./AGENTS.md) | Visão geral, arquitetura e stack |
| [ARQUITETURA.md](./ARQUITETURA.md) | Arquitetura técnica detalhada |
| [STACK.md](./STACK.md) | Stack tecnológica completa |
| [CONTEXTO_ATUAL.md](./CONTEXTO_ATUAL.md) | Estado atual do projeto |

### Integração API

| Documento | Descrição |
|-----------|-----------|
| [ONC_API_INTEGRATION.md](./ONC_API_INTEGRATION.md) | Integração com API ONC |
| [ONC_ENDPOINTS_IMPLEMENTATION.md](./ONC_ENDPOINTS_IMPLEMENTATION.md) | Endpoints implementados |
| [CONFIGURACAO_EMAIL_ONC.md](./CONFIGURACAO_EMAIL_ONC.md) | Configuração de email |

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

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (Turbopack)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
npm run lint:fix     # Corrigir código
npm run prettier     # Formatar código
```

## 🎯 Funcionalidades Principais

- ✅ Autenticação com integração API ONC
- ✅ Sistema multi-provider (mock/ONC) para RBAC
- ✅ Sistema multi-provider (mock/ONC) para Users
- ✅ Gestão de usuários
- ✅ Gestão de papéis e permissões (RBAC)
- ✅ Dashboard administrativo
- ✅ Sistema de temas (Light/Dark)
- ✅ Layout responsivo
- ✅ Recuperação de senha com email

## 🔐 Stack Tecnológica

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **React**: 19.2.4
- **TypeScript**: 5.9.3
- **UI**: Material-UI 7.3.8
- **HTTP**: Axios 1.13.5
- **State**: React Context, SWR
- **Forms**: React Hook Form 7.71.2

## 📞 Suporte

### Documentação Template SaasAble
- [Documentação](https://phoenixcoded.gitbook.io/saasable/admin)
- [Suporte](https://support.phoenixcoded.net/)

### Documentação Interna
- Consulte os arquivos .md na raiz do projeto para documentação específica do ONC

## 📝 Versão

**Versão**: 2.1.0
**Baseado em**: SaasAble React MUI Admin Template
**Customizado para**: ONC - Sistema de Gestão
**Última atualização**: 1 de setembro de 2026
**Novidades**: Sistema multi-provider implementado para RBAC e Users (mock/ONC)
