# Índice de Documentação - ONC

## 📚 Documentação do Projeto

Este projeto contém documentação completa para desenvolvimento, arquitetura e contexto. Use os arquivos abaixo para navegar rapidamente.

## 🎯 Guia Rápido

### Para Começar Agora
👉 **Leia primeiro**: [DEV_README.md](./DEV_README.md)

### Para Entender o Projeto
👉 **Leia**: [AGENTS.md](./AGENTS.md)

### Para Retornar ao Projeto
👉 **Leia**: [CONTEXTO_ATUAL.md](./CONTEXTO_ATUAL.md)

## 📖 Documentação Detalhada

### 1. AGENTS.md
**Visão geral do projeto**
- Estrutura de diretórios
- Stack tecnológica
- Sistema de autenticação
- Design system
- Funcionalidades principais
- Scripts disponíveis
- Convenções de código

**Quando usar**: Para entender a estrutura geral do projeto e stack utilizada.

---

### 2. ARQUITETURA.md
**Arquitetura técnica detalhada**
- Decisões arquiteturais
- Padrões de design
- Estratégias de estado
- Segurança
- Performance
- Responsividade
- Internacionalização
- CI/CD (planejado)

**Quando usar**: Para entender decisões técnicas e padrões arquiteturais.

---

### 3. STACK.md
**Stack tecnológica completa**
- Dependências principais
- DevDependencies
- Configurações
- Sistema de temas
- Integrações
- Performance
- Browser support
- Deploy

**Quando usar**: Para entender detalhes técnicos da stack e configurações.

---

### 4. CONTEXTO_ATUAL.md
**Estado atual do projeto**
- Funcionalidades implementadas
- Integrações ativas
- Configurações atuais
- Issues conhecidos
- Próximos passos
- Pontos críticos
- Debugging

**Quando usar**: Ao retornar ao projeto após algum tempo para entender o estado atual.

---

### 5. DEV_README.md
**Guia rápido de desenvolvimento**
- Início rápido
- Tarefas comuns
- Troubleshooting
- Configuração obrigatória
- Checklist antes de commit

**Quando usar**: Para consultas rápidas durante o desenvolvimento.

---

## 🔗 Integração API

### ONC_API_INTEGRATION.md
**Integração com API ONC**
- Visão geral
- Endpoints necessários
- Serviço de email
- Segurança
- Testes
- Exemplo de fluxo completo

**Quando usar**: Para entender e implementar integração com API ONC.

---

### ONC_ENDPOINTS_IMPLEMENTATION.md
**Endpoints implementados**
- Detalhes de cada endpoint
- Request/Response formatos
- Validações
- Tratamento de erros

**Quando usar**: Para referência de endpoints específicos da API ONC.

---

### CONFIGURACAO_EMAIL_ONC.md
**Configuração de email**
- Configuração SMTP
- Templates de email
- Variáveis de ambiente
- Testes

**Quando usar**: Para configurar sistema de email da aplicação.

---

### SWAGGER_ANALISE_RBAC.md
**Análise do Swagger ONC - RBAC e Users**
- Endpoints de RBAC disponíveis
- Endpoints de Users disponíveis
- Schemas do backend
- Mapeamento Frontend ↔ Backend
- Implementação sugerida

**Quando usar**: Para entender endpoints do backend ONC e mapear com forms do frontend.

**Nota**: Baseado no arquivo `swagger back,json` (com vírgula no nome) na raiz do projeto.

---

## 🏗️ Arquitetura e Padrões

### PROPOSTA_ARQUITETURA_PROVIDER.md
**Proposta multi-provider pattern**
- Estrutura de domínios separados
- Factory pattern para providers
- Benefícios da abordagem
- Plano de implementação

**Quando usar**: Para entender a arquitetura de múltiplos providers (mock/ONC).

---

### EXEMPLO_IMPLEMENTACAO_RBAC.md
**Exemplo implementação RBAC provider**
- Implementação passo a passo completa
- Código pronto para copiar/colar
- Exemplos de mock e ONC
- Como usar nos componentes

**Quando usar**: Para implementar o padrão multi-provider para RBAC.

---

## 🚀 Fluxo de Leitura Recomendado

### Novo no Projeto
1. [DEV_README.md](./DEV_README.md) - Início rápido
2. [AGENTS.md](./AGENTS.md) - Visão geral
3. [ARQUITETURA.md](./ARQUITETURA.md) - Arquitetura
4. [ONC_API_INTEGRATION.md](./ONC_API_INTEGRATION.md) - Integração API
5. [PROPOSTA_ARQUITETURA_PROVIDER.md](./PROPOSTA_ARQUITETURA_PROVIDER.md) - Padrão multi-provider

### Retornando ao Projeto
1. [CONTEXTO_ATUAL.md](./CONTEXTO_ATUAL.md) - Estado atual
2. [DEV_README.md](./DEV_README.md) - Refresh rápido
3. [AGENTS.md](./AGENTS.md) - Revisão geral

### Desenvolvimento Diário
1. [DEV_README.md](./DEV_README.md) - Consultas rápidas
2. [STACK.md](./STACK.md) - Referência técnica
3. [ONC_ENDPOINTS_IMPLEMENTATION.md](./ONC_ENDPOINTS_IMPLEMENTATION.md) - API
4. [SWAGGER_ANALISE_RBAC.md](./SWAGGER_ANALISE_RBAC.md) - Endpoints backend

---

## 📋 Checklist por Documento

### Antes de Começar Desenvolvimento
- [ ] Ler DEV_README.md
- [ ] Configurar .env
- [ ] Verificar ONC_API_BASE_URL
- [ ] Executar npm install

### Antes de Modificar Arquitetura
- [ ] Ler ARQUITETURA.md
- [ ] Entender padrões existentes
- [ ] Planejar mudanças
- [ ] Documentar alterações

### Antes de Adicionar Novas Features
- [ ] Ler AGENTS.md
- [ ] Verificar CONTEXTO_ATUAL.md
- [ ] Seguir estrutura de pastas
- [ ] Adicionar tipos TypeScript

### Antes de Integrar API
- [ ] Ler ONC_API_INTEGRATION.md
- [ ] Verificar ONC_ENDPOINTS_IMPLEMENTATION.md
- [ ] Testar endpoints
- [ ] Documentar mudanças

---

## 🔍 Busca Rápida

### "Como inicio o projeto?"
→ [DEV_README.md](./DEV_README.md) - Seção Início Rápido

### "Qual a arquitetura?"
→ [ARQUITETURA.md](./ARQUITETURA.md) - Seção Decisões Arquiteturais

### "Qual stack usamos?"
→ [STACK.md](./STACK.md) - Seção Dependências Principais

### "O que está implementado?"
→ [CONTEXTO_ATUAL.md](./CONTEXTO_ATUAL.md) - Seção Funcionalidades Implementadas

### "Como integro a API ONC?"
→ [ONC_API_INTEGRATION.md](./ONC_API_INTEGRATION.md) - Seção Endpoints Necessários

### "Como configuro email?"
→ [CONFIGURACAO_EMAIL_ONC.md](./CONFIGURACAO_EMAIL_ONC.md)

### "Quais endpoints do backend para RBAC?"
→ [SWAGGER_ANALISE_RBAC.md](./SWAGGER_ANALISE_RBAC.md) - Seção Endpoints Disponíveis

### "Como implementar multi-provider?"
→ [PROPOSTA_ARQUITETURA_PROVIDER.md](./PROPOSTA_ARQUITETURA_PROVIDER.md) - Seção Solução Proposta

### "Como implementar RBAC provider?"
→ [EXEMPLO_IMPLEMENTACAO_RBAC.md](./EXEMPLO_IMPLEMENTACAO_RBAC.md) - Seção Implementação Passo a Passo

### "Onde está a estrutura de pastas?"
→ [AGENTS.md](./AGENTS.md) - Seção Estrutura de Diretórios

### "Como adiciono nova página?"
→ [DEV_README.md](./DEV_README.md) - Seção Tarefas Comuns

### "Qual o estado atual?"
→ [CONTEXTO_ATUAL.md](./CONTEXTO_ATUAL.md) - Seção Estado Atual

### "Como faço debug?"
→ [CONTEXTO_ATUAL.md](./CONTEXTO_ATUAL.md) - Seção Debugging

---

## 📝 Atualização de Documentação

### Quando Atualizar
- Adicionar nova funcionalidade → Atualizar AGENTS.md e CONTEXTO_ATUAL.md
- Modificar arquitetura → Atualizar ARQUITETURA.md
- Adicionar dependência → Atualizar STACK.md
- Modificar API → Atualizar ONC_API_INTEGRATION.md
- Mudar configuração → Atualizar DEV_README.md
- Implementar novo provider → Atualizar PROPOSTA_ARQUITETURA_PROVIDER.md
- Mapear endpoints backend → Atualizar SWAGGER_ANALISE_RBAC.md

### Padrão de Atualização
1. Adicionar data da atualização
2. Descrever mudança brevemente
3. Atualizar seções relevantes
4. Manter consistência entre documentos

---

## 🎯 Resumo por Documento

| Documento | Foco | Tamanho | Quando Usar |
|-----------|------|---------|-------------|
| DEV_README.md | Desenvolvimento rápido | Curto | Diariamente |
| AGENTS.md | Visão geral | Médio | Novo no projeto |
| ARQUITETURA.md | Arquitetura técnica | Longo | Mudanças técnicas |
| STACK.md | Stack tecnológica | Médio | Referência técnica |
| CONTEXTO_ATUAL.md | Estado atual | Longo | Retornar ao projeto |
| ONC_API_INTEGRATION.md | Integração API | Médio | Integrações |
| ONC_ENDPOINTS_IMPLEMENTATION.md | Endpoints | Médio | Referência API |
| CONFIGURACAO_EMAIL_ONC.md | Email | Curto | Configuração |
| SWAGGER_ANALISE_RBAC.md | Endpoints backend | Médio | Integração RBAC/Users |
| PROPOSTA_ARQUITETURA_PROVIDER.md | Multi-provider | Médio | Arquitetura |
| EXEMPLO_IMPLEMENTACAO_RBAC.md | Implementação RBAC | Longo | Implementação |

---

## 📞 Suporte

### Documentação Externa
- SaasAble: https://phoenixcoded.gitbook.io/saasable/admin
- Suporte: https://support.phoenixcoded.net/

### Documentação Interna
- Todos os arquivos .md na raiz do projeto

---

**Índice criado em 1 de setembro de 2026**
**Para facilitar navegação na documentação do projeto ONC**
