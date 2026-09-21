# Documentação — Telas de Captação de Lead

## Visão Geral

São 4 telas/fluxos públicos (sem autenticação), acessíveis fora do painel admin:

| Rota | Descrição |
|------|-----------|
| `/solicitar-proposta` | Formulário inicial de captura de lead |
| `/solicitar-proposta/certificacao` | Formulário complementar — Certificação (multi-step) |
| `/solicitar-proposta/treinamento` | Formulário complementar — Treinamento (multi-step) |
| `/solicitar-proposta/obrigado` | Tela de agradecimento |

---

## Estrutura de Arquivos (Next.js App Router)

```
src/
├── app/
│   └── (lead)/                          # Route group público — sem auth
│       ├── layout.tsx                   # Layout público (logo ONC, sem sidebar)
│       ├── solicitar-proposta/
│       │   ├── page.tsx                 # Formulário inicial de lead
│       │   ├── certificacao/
│       │   │   └── page.tsx             # Multi-step certificação
│       │   ├── treinamento/
│       │   │   └── page.tsx             # Multi-step treinamento
│       │   └── obrigado/
│       │       └── page.tsx             # Tela de agradecimento
├── sections/
│   └── lead/
│       ├── LeadForm.tsx                 # Formulário inicial
│       ├── CertificacaoForm/
│       │   ├── index.tsx                # Orquestrador de steps
│       │   ├── Step1TipoSolicitante.tsx
│       │   ├── Step2Normas.tsx
│       │   ├── Step3DadosEmpresa.tsx
│       │   ├── Step4DadosNegocio.tsx
│       │   ├── Step5SistemaGestao.tsx
│       │   ├── Step6EspecificoNorma.tsx  # Condicional por norma selecionada
│       │   └── StepRevisao.tsx
│       └── TreinamentoForm/
│           ├── index.tsx                # Orquestrador de steps
│           ├── Step1TipoSolicitante.tsx
│           ├── Step2DadosEmpresaOuParticipante.tsx
│           ├── Step3Treinamentos.tsx
│           └── StepRevisao.tsx
├── types/
│   └── lead.ts                          # Tipos TypeScript das 3 formas
└── utils/
    └── api/
        └── lead/
            └── index.ts                 # Funções POST para o backend
```

---

## Layout Público (`(lead)/layout.tsx`)

Layout simples, centralizado, **sem** sidebar, **sem** header administrativo.

```
┌─────────────────────────────────────────────┐
│                                             │
│         [Logo ONC — vermelho]               │
│      Organismo Nacional de Certificação     │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │          CONTEÚDO DA PÁGINA           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  © 2025 ONC — Política de Privacidade       │
└─────────────────────────────────────────────┘
```

- Fundo: branco ou cinza levíssimo (`grey.50`)
- Container central: `maxWidth: 720px` (lead) / `maxWidth: 900px` (complementares)
- Borda sutil `1px solid divider` ao redor do card
- Cabeçalho fixo no topo do card: logo + nome empresa

---

## Tela 1 — Formulário Inicial de Captura de Lead

**Rota:** `/solicitar-proposta`
**Arquivo de seção:** `src/sections/lead/LeadForm.tsx`
**Formulário único** (não precisa de steps — é curto)

### Layout

```
┌──────────────────────────────────────────┐
│  [Logo ONC]                              │
│  Organismo Nacional de Certificação      │
├──────────────────────────────────────────┤
│  Solicitação de Proposta                 │  ← título do formulário
│                                          │
│  DADOS DO CONTATO                        │  ← seção label
│                                          │
│  Tipo de Proposta *                      │
│  [Certificação ▼]                        │
│                                          │
│  Nome do Contato *                       │
│  [__________________________]            │
│                                          │
│  Empresa *        │  Setor *             │
│  [______________] │  [Setor Privado ▼]   │
│                                          │
│  Cargo *                                 │
│  [__________________________]            │
│                                          │
│  E-mail *                                │
│  [__________________________]            │
│                                          │
│  Telefone *        │  WhatsApp *         │
│  [(99) 99999-9999] │  [(99) 99999-9999]  │
│                                          │
│  Como podemos te ajudar? *               │
│  (Descreva em poucas palavras a          │
│   sua solicitação)                       │
│  [                              ]        │
│  [                              ]        │
│  [                              ]        │
│                                          │
│  [reCAPTCHA — Não sou um robô]           │
│                                          │
│  [ ] Li e estou de acordo com a          │
│      Política de Privacidade             │
│                                          │
│           [Enviar Solicitação]           │
└──────────────────────────────────────────┘
```

### Campos

| Campo | Tipo | Obrigatório | Observação |
|-------|------|:-----------:|-----------|
| Tipo de Proposta | Select | sim | Opções: Certificação, Treinamento |
| Nome do Contato | TextField | sim | — |
| Empresa | TextField | sim | — |
| Setor | Select | sim | Setor Privado, Setor Público |
| Cargo | TextField | sim | Era "Cargo / Função" no sistema antigo |
| E-mail | TextField (email) | sim | Validar formato |
| Telefone | TextField + máscara | sim | Máscara: `(99) 99999-9999` |
| WhatsApp | TextField + máscara | sim | Máscara: `(99) 99999-9999` |
| Como podemos te ajudar? | Textarea | sim | Placeholder: "Descreva em poucas palavras a sua solicitação" |
| reCAPTCHA | Componente Google | sim | — |
| Checkbox Política de Privacidade | Checkbox | sim | Link para `/politica-de-privacidade` |

### Regras de Negócio

**Duplicidade de e-mail:**

```
E-mail já cadastrado?
├── SIM — contato com status ATIVO e sem solicitação preenchida
│   └── Alerta inline:
│       "Você já possui um cadastro no ONC."
│       [Iniciar nova solicitação]  [Solicitar contato do Comercial]
│       → Nova solicitação: fecha alerta, continua preenchimento
│       → Contato Comercial: fecha form, exibe agradecimento,
│                            registra no Dashboard Comercial
└── NÃO → segue normalmente
```

**Ao enviar com sucesso:**
1. Registra lead no sistema
2. Envia e-mail automático ao solicitante (ver seção E-mail abaixo)
3. Redireciona para `/solicitar-proposta/obrigado`

---

## Tela 2 — Formulário Complementar de Certificação (Multi-step)

**Rota:** `/solicitar-proposta/certificacao`
**Arquivo de seção:** `src/sections/lead/CertificacaoForm/index.tsx`
**Acessado via link no e-mail enviado após o formulário inicial**

### Navegação entre Steps

Componente MUI `Stepper` horizontal no topo, com os nomes dos blocos como labels.
Botões `Anterior` e `Próximo` no rodapé de cada step. Último step: `Enviar`.

```
[TIPO E SOLICITANTE] → [NORMAS] → [EMPRESA] → [NEGÓCIO] → [SISTEMA DE GESTÃO] → [ESPECÍFICO] → [REVISÃO]
        1                  2           3            4               5                   6             7
```

O Step 6 (Específico) só aparece se houver norma selecionada que tenha dados específicos (Lixo Zero, ISO 50001, ISO 14001, ISO 45001, ISO 22000, ISO 37001).

---

### Step 1 — Tipo da Solicitação e do Solicitante

```
Solicitação de Certificação
(Caso a sua solicitação seja diferente dessa,
retorne ao Site do ONC e registre uma nova solicitação.)

TIPO DA SOLICITAÇÃO
─────────────────────────────────────────────
Tipo de Certificação *
[Certificação Inicial ▼]
  └── Opções: Inicial | Transferência de Organismo

  [Se "Transferência de Organismo" for selecionado:]
  Número do Certificado *   │  Validade *
  [___________________]    │  [__/__/____]
  [+ Adicionar outro certificado]

Conte-nos onde nos conheceu
[Campo texto livre]

─────────────────────────────────────────────
DADOS DO SOLICITANTE
(Pré-preenchido do formulário inicial — editável)
─────────────────────────────────────────────
Nome do Contato *     │  Cargo *
[________________]    │  [________________]

Empresa *
[________________________________]

E-mail *              │  Data de Nascimento
[________________]    │  [__/__/____]

Telefone *            │  WhatsApp
[(99) 99999-9999]     │  [(99) 99999-9999]
```

| Campo | Tipo | Obrigatório | Detalhe |
|-------|------|:-----------:|---------|
| Tipo de Certificação | Select | sim | Inicial / Transferência de Organismo |
| Número do Certificado | TextField | condicional | Aparece se Transferência |
| Validade | DateField | condicional | Aparece se Transferência |
| Onde nos conheceu | TextField | não | Campo texto livre |
| Nome do Contato | TextField | sim | Pré-preenchido |
| Cargo | TextField | sim | Pré-preenchido |
| Empresa | TextField | sim | Pré-preenchido |
| E-mail | TextField (email) | sim | Pré-preenchido |
| Data de Nascimento | TextField + máscara | não | Máscara: `99/99/9999` |
| Telefone | TextField + máscara | sim | Pré-preenchido |
| WhatsApp | TextField + máscara | não | — |

---

### Step 2 — Normas

```
NORMAS
─────────────────────────────────────────────
Selecione a(s) norma(s) para certificação: *

[ ] ISO 9001          [ ] ISO 14001
[ ] ISO 45001         [ ] ISO/IEC 27001
[ ] ISO/IEC 20000-1   [ ] ISO 37001
[ ] ISO 50001         [ ] ISO 22000
[ ] ISO/IEC 27701     [ ] ISO 37301
[ ] PRÓ-GESTÃO RPPS   [ ] SELO ONC
[ ] Lixo Zero         [ ] Outra

[Se "Outra" marcado:]
Descreva a norma (máx. 100 caracteres)
[________________________________________]
```

| Campo | Tipo | Obrigatório | Detalhe |
|-------|------|:-----------:|---------|
| Checkboxes de normas | CheckboxGroup | sim (mín. 1) | Vêm da tabela Normas do banco |
| Campo "Outra" | TextField | condicional | Máx. 100 chars, aparece se "Outra" marcado |

> As normas são carregadas da tabela `Normas` (campos: Descrição, Versão, Status). Exibir apenas normas com Status ativo.

---

### Step 3 — Dados da Empresa

```
DADOS DA EMPRESA
─────────────────────────────────────────────
CNPJ *                    │  Website
[99.999.999/9999-99]      │  [____________________]

Razão Social *
[____________________________________________]

Setor da Empresa *
[Setor Privado ▼]   Opções: Setor Privado | Setor Público

E-mail da Empresa *          │  Telefone da Empresa *
[_____________________]      │  [(99) 99999-9999]

Endereço *          │  Número     │  Complemento
[_______________]   │  [______]   │  [___________]

Bairro *            │  CEP *
[_______________]   │  [99999-999]

Cidade *                          │  Estado *
[____________________________]    │  [SP ▼]
```

| Campo | Tipo | Obrigatório | Detalhe |
|-------|------|:-----------:|---------|
| CNPJ | TextField + máscara | sim | `99.999.999/9999-99` — validar dígitos |
| Website | TextField | não | Era "Homepage" no sistema antigo |
| Razão Social | TextField | sim | — |
| Setor da Empresa | Select | sim | Privado / Público |
| E-mail da Empresa | TextField (email) | sim | Validar formato |
| Telefone | TextField + máscara | sim | `(99) 99999-9999` |
| Endereço | TextField | sim | — |
| Número | TextField | sim | — |
| Complemento | TextField | não | — |
| Bairro | TextField | sim | — |
| CEP | TextField + máscara | sim | `99999-999` |
| Cidade | TextField / Select | sim | Cidades do estado selecionado (IBGE) |
| Estado | Select | sim | Lista dos 27 estados |

**Regra de negócio — duplicidade de CNPJ:**

```
CNPJ já cadastrado?
├── Solicitação ATIVA para a(s) mesma(s) Norma(s) (status: Andamento ou Convertida)
│   └── Mensagem: "A empresa já possui uma solicitação para essa(s) Norma(s)."
│       [Solicitar contato do Comercial]
│
├── Solicitação EXISTENTE para a(s) mesma(s) Norma(s) (outro status)
│   └── Mensagem: "Empresa já possui uma solicitação para essa(s) Norma(s)."
│       [Seguir com nova solicitação]  [Solicitar contato do Comercial]
│       → Nova solicitação: fecha alerta, continua
│       → Contato Comercial: fecha form, agradecimento, registra no Dashboard
│
└── Normas diferentes → nenhuma mensagem, continua normalmente
```

---

### Step 4 — Dados do Negócio

```
DADOS DO NEGÓCIO
─────────────────────────────────────────────
Produtos e/ou Serviços *
[                                        ]

Principais processos e operações *
[                                        ]

Principais obrigações legais
[                                        ]

A empresa já é certificada em outra(s) norma(s)? *
[Não ▼]
  [Se "Sim":]
  Descreva a(s) norma(s)
  [____________________________________]

A empresa é responsável pelo projeto do produto ou serviço? *
[Não ▼]

A empresa terceiriza algum processo? *
[Não ▼]
  [Se "Sim":]
  Descreva os processos terceirizados
  [____________________________________]
```

| Campo | Tipo | Obrigatório | Detalhe |
|-------|------|:-----------:|---------|
| Produtos e/ou Serviços | Textarea | sim | — |
| Principais processos e operações | Textarea | sim | — |
| Principais obrigações legais | Textarea | não | — |
| Já é certificada em outra(s) norma(s)? | Select (Sim/Não) | sim | — |
| Descrição das normas | Textarea | condicional | Aparece se "Sim" |
| Responsável pelo projeto? | Select (Sim/Não) | sim | — |
| Terceiriza algum processo? | Select (Sim/Não) | sim | — |
| Descrição dos processos terceirizados | Textarea | condicional | Aparece se "Sim" |

---

### Step 5 — Dados do Sistema de Gestão

```
DADOS DO SISTEMA DE GESTÃO
─────────────────────────────────────────────
Grau de Implementação do Sistema de Gestão *
[Totalmente Implementado ▼]
  Opções: Totalmente Implementado | Parcialmente Implementado | Não Implementado

Em se tratando de um Sistema de Gestão Integrado,
qual o grau de integração? *
[Totalmente Integrado ▼]
  Opções: Totalmente Integrado | Parcialmente Integrado | Não Integrado

O Sistema de Gestão cobre todas as localidades? *
[Sim ▼]
  [Se "Não":]
  Descreva as localidades com Sistemas de Gestão independentes
  [____________________________________]

A empresa utiliza consultoria para implementação? *
[Não ▼]
  [Se "Sim":]
  Nome da Consultoria *   │  Nome do Consultor *
  [__________________]   │  [__________________]

A empresa necessita da certificação acreditada? *
[Não ▼]

Escopo a ser certificado *
[                                        ]

─────────────────────────────────────────────
LOCALIDADES A SEREM CERTIFICADAS

[Caso possua arquivo com os dados, faça upload aqui]
[  Selecionar arquivo  ]

Ou preencha manualmente:

┌──────┬───────┬────────┬──────────────┬───────────┬────────────┬──────────────┬────────┬────────────┐
│ Nome │ Estado│ Cidade │ Atividades   │ Total Fun.│ Adm.       │ Operacional  │ Turnos │ Horários   │
├──────┼───────┼────────┼──────────────┼───────────┼────────────┼──────────────┼────────┼────────────┤
│ [__] │ [SP▼] │ [SP▼]  │ [__________] │ [_______] │ [________] │ [__________] │ [__]   │ [__]–[__]  │
└──────┴───────┴────────┴──────────────┴───────────┴────────────┴──────────────┴────────┴────────────┘
[+ Adicionar localidade]

Existem funcionários permanentes em sites de clientes? *
[Não ▼]
  [Se "Sim":]
  Descreva em quais clientes
  [____________________________________]
```

| Campo | Tipo | Obrigatório | Detalhe |
|-------|------|:-----------:|---------|
| Grau de Implementação | Select | sim | 3 opções |
| Grau de Integração | Select | sim | 3 opções |
| Cobre todas as localidades? | Select (Sim/Não) | sim | — |
| Localidades independentes | Textarea | condicional | — |
| Utiliza consultoria? | Select (Sim/Não) | sim | — |
| Nome da Consultoria | TextField | condicional | — |
| Nome do Consultor | TextField | condicional | — |
| Certificação acreditada? | Select (Sim/Não) | sim | — |
| Escopo a ser certificado | Textarea | sim | — |
| Upload de arquivo de localidades | File input | não | Alternativa à tabela manual |
| Tabela de localidades | Tabela dinâmica (linhas repetíveis) | sim (mín. 1) | Colunas: Nome, Estado, Cidade, Atividades, Total Fun., Fun. Adm., Fun. Op., Turnos, Horários |
| Funcionários em sites de clientes? | Select (Sim/Não) | sim | — |
| Descrição de clientes | Textarea | condicional | — |

---

### Step 6 — Dados Específicos da Norma (Condicional)

> Este step aparece **somente** quando ao menos uma das seguintes normas estiver selecionada no Step 2: Lixo Zero, ISO 50001, ISO 14001, ISO 45001, ISO 22000, ISO 37001.

Cada bloco abaixo é exibido conforme a norma selecionada. Se mais de uma norma específica for selecionada, os blocos aparecem em sequência na mesma tela, separados por divisor.

#### Bloco — Lixo Zero

```
ESPECÍFICO — LIXO ZERO
─────────────────────────────────────────────
Área total da empresa (m²) *
[__________]

Quais são os resíduos gerados? *
[                          ]

A empresa possui gestão de resíduos? *  [Sim ▼]

Quais são os tipos de resíduos gerados? *
[                          ]

Geração mensal de resíduos (kg/mês) *
[__________]

Porcentual de reciclagem dos resíduos gerados (%) *
[__________]

Existe destinação dos resíduos gerados? *   [Sim ▼]
  [Se "Sim":]
  A destinação é feita pela:
  ( ) Própria empresa   ( ) Empresa contratada

[Caso a certificação seja para várias localidades,
 faça upload das informações por site:]
[  Selecionar arquivo  ]
```

#### Bloco — ISO 50001

```
ESPECÍFICO — ISO 50001
─────────────────────────────────────────────
Consumo total de energia (kWh) *
[__________]

Número de fontes de energia *
[__________]

Número de usos significativos de energia *
(ex.: ventilação, linha de produção, aquecimento)
[__________]
```

#### Bloco — ISO 14001

```
ESPECÍFICO — ISO 14001
─────────────────────────────────────────────
Quais os aspectos ambientais identificados? *
[                                        ]

Requisitos legais ambientais relacionados com
as atividades da empresa:
[                                        ]
```

#### Bloco — ISO 45001

```
ESPECÍFICO — ISO 45001
─────────────────────────────────────────────
Riscos à saúde e segurança ocupacional identificados: *
[                                        ]

Principais ameaças e riscos dos processos:
[                                        ]

Principais materiais perigosos usados nos processos:
[                                        ]

Acidentes ou incidentes sem afastamento no último ano? *
[Não ▼]
  [Se "Sim":] Total: [___]

Acidentes graves com afastamento no último ano? *
[Não ▼]
  [Se "Sim":] Total: [___]

Requisitos legais relevantes à atividade: *
[                                        ]

A organização aloca funcionários em outras empresas? *
[Não ▼]
  [Se "Sim":]
  O Sistema de Gestão dessas empresas cobre essas atividades?
  [Não ▼]

A empresa é avaliada por órgão municipal/estadual/federal (SSO)? *
[Não ▼]
  [Se "Sim":] Qual e periodicidade: [__________________]
```

#### Bloco — ISO 22000

```
ESPECÍFICO — ISO 22000
─────────────────────────────────────────────
APPCCs implementadas: *
[                          ]

Linhas de processos: *
[                          ]

Categorias de alimentos: *
[                          ]

Subcategorias de alimentos: *
[                          ]

Lista de Programas de Pré-Requisitos (PPRs): *
[                          ]
```

#### Bloco — ISO 37001

```
ESPECÍFICO — ISO 37001
─────────────────────────────────────────────
Pessoas na área de serviços financeiros: *      [___]

Pessoas envolvidas em elaboração de ofertas/licitações: *  [___]

Pessoas envolvidas em aquisições e compras: *   [___]

Pessoas em comunicação com subcontratados/clientes: *      [___]

A empresa realiza doações? *   [Não ▼]
  [Se "Sim":] Liste as principais doações do último ano:
  [                          ]

Algum membro do quadro societário esteve envolvido
com suspeitas de suborno? *   [Não ▼]
```

---

### Step 7 — Revisão e Envio

```
REVISÃO DA SOLICITAÇÃO
─────────────────────────────────────────────
Resumo de todos os dados preenchidos,
organizados por bloco (colapsável / accordion).

[TIPO E SOLICITANTE      ▼] [Editar]
[NORMAS                  ▼] [Editar]
[EMPRESA                 ▼] [Editar]
[NEGÓCIO                 ▼] [Editar]
[SISTEMA DE GESTÃO       ▼] [Editar]
[ESPECÍFICO DA NORMA     ▼] [Editar]  ← apenas se existir

─────────────────────────────────────────────
[ ] Declaro que as informações fornecidas são
    verídicas e atualizadas. *

[ ] Li e estou de acordo com a
    Política de Privacidade *

[reCAPTCHA — Não sou um robô]

           [← Anterior]   [Enviar Solicitação]
```

---

## Tela 3 — Formulário Complementar de Treinamento (Multi-step)

**Rota:** `/solicitar-proposta/treinamento`
**Arquivo de seção:** `src/sections/lead/TreinamentoForm/index.tsx`

### Navegação entre Steps

```
[TIPO E SOLICITANTE] → [EMPRESA / PARTICIPANTE] → [TREINAMENTOS] → [REVISÃO]
        1                          2                      3               4
```

---

### Step 1 — Tipo da Solicitação e do Solicitante

```
Solicitação de Treinamento
(Caso a sua solicitação seja diferente dessa,
retorne ao Site do ONC e registre uma nova solicitação.)

TIPO DA SOLICITAÇÃO
─────────────────────────────────────────────
Para quem será o treinamento? *
( ) Para uma Empresa
( ) Para uma Pessoa Física

Conte-nos onde nos conheceu
[Campo texto livre]

─────────────────────────────────────────────
DADOS DO SOLICITANTE
(Pré-preenchido do formulário inicial — editável)
─────────────────────────────────────────────
Nome do Contato *     │  Cargo *
[________________]    │  [________________]

E-mail *              │  Data de Nascimento
[________________]    │  [__/__/____]

Telefone *            │  WhatsApp
[(99) 99999-9999]     │  [(99) 99999-9999]
```

| Campo | Tipo | Obrigatório | Detalhe |
|-------|------|:-----------:|---------|
| Para quem será o treinamento? | RadioGroup | sim | Empresa / Pessoa Física — determina Step 2 |
| Onde nos conheceu | TextField | não | Texto livre |
| Nome do Contato | TextField | sim | Pré-preenchido |
| Cargo | TextField | sim | Pré-preenchido |
| E-mail | TextField (email) | sim | Pré-preenchido |
| Data de Nascimento | TextField + máscara | não | `99/99/9999` |
| Telefone | TextField + máscara | sim | Pré-preenchido |
| WhatsApp | TextField + máscara | não | — |

---

### Step 2A — Dados da Empresa (se "Para uma Empresa")

```
DADOS DA EMPRESA
─────────────────────────────────────────────
CNPJ *                    │  Website
[99.999.999/9999-99]      │  [____________________]

Razão Social *
[____________________________________________]

Setor da Empresa *
[Setor Privado ▼]

E-mail da Empresa *       │  Telefone da Empresa *
[___________________]     │  [(99) 99999-9999]

Endereço *      │  Número    │  Complemento
[____________]  │  [______]  │  [___________]

Bairro *        │  CEP *
[____________]  │  [99999-999]

Cidade *                       │  Estado *
[_________________________]    │  [SP ▼]
```

Mesmos campos e validações da Tela 2, Step 3 — Dados da Empresa.
**Regra de duplicidade de CNPJ** aplica aqui também (cruzando Norma + Tipo de Treinamento).

---

### Step 2B — Dados do Participante (se "Para uma Pessoa Física")

```
DADOS DO PARTICIPANTE
─────────────────────────────────────────────
Nome Completo *         │  CPF *
[__________________]    │  [999.999.999-99]

E-mail *                │  Data de Nascimento *
[__________________]    │  [__/__/____]

Telefone *              │  WhatsApp
[(99) 99999-9999]       │  [(99) 99999-9999]

Endereço *      │  Número    │  Complemento
[____________]  │  [______]  │  [___________]

Bairro *        │  CEP *
[____________]  │  [99999-999]

Cidade *                       │  Estado *
[_________________________]    │  [SP ▼]

Em qual empresa trabalha?
[__________________________]

Qual o seu cargo?
[__________________________]
```

| Campo | Tipo | Obrigatório |
|-------|------|:-----------:|
| Nome Completo | TextField | sim |
| CPF | TextField + máscara `999.999.999-99` | sim |
| E-mail | TextField (email) | sim |
| Data de Nascimento | TextField + máscara | sim |
| Telefone | TextField + máscara | sim |
| WhatsApp | TextField + máscara | não |
| Endereço + Número + Complemento | TextField | sim (exceto complemento) |
| Bairro + CEP + Cidade + Estado | TextField / Select | sim |
| Empresa onde trabalha | TextField | não |
| Cargo | TextField | não |

---

### Step 3 — Treinamentos

Tabela de linhas repetíveis. O usuário adiciona uma linha por treinamento desejado.

```
TREINAMENTOS SOLICITADOS
─────────────────────────────────────────────
┌──────────────┬────────────────────┬────────┬─────────────┬─────────────────┐
│ Norma *      │ Tipo de Treinamento│ Total  │ Formato *   │ Data Prevista * │
│              │ *                  │ Part.* │             │                 │
├──────────────┼────────────────────┼────────┼─────────────┼─────────────────┤
│ [ISO 9001 ▼] │ [Auditoria Int. ▼] │ [___]  │ [Online ▼]  │ [__/__/____]    │
│  └─"Outra":  │  └─"Outro":        │        │             │                 │
│  [texto]     │  [texto]           │        │             │                 │
├──────────────┼────────────────────┼────────┼─────────────┼─────────────────┤
│ [           ]│ [                 ]│ [   ]  │ [          ]│ [             ] │
└──────────────┴────────────────────┴────────┴─────────────┴─────────────────┘

[+ Adicionar treinamento]     [Remover linha ×]
```

| Campo por linha | Tipo | Obrigatório | Detalhe |
|----------------|------|:-----------:|---------|
| Norma | Select + opção "Outra" | sim | Vem da tabela Normas (ativas) |
| Se "Outra" | TextField | condicional | — |
| Tipo de Treinamento | Select + opção "Outro" | sim | Vem da tabela Tipos de Treinamento (ativos) |
| Se "Outro" | TextField | condicional | — |
| Total de Participantes | TextField numérico | sim | Máx. 3 dígitos |
| Formato | Select | sim | Vem da tabela Formatos de Treinamento (ativos) / opções: Online Ao Vivo, Presencial |
| Data Prevista | TextField + máscara | sim | `dd/mm/aaaa` |

---

### Step 4 — Revisão e Envio

```
REVISÃO DA SOLICITAÇÃO
─────────────────────────────────────────────
[TIPO E SOLICITANTE              ▼] [Editar]
[EMPRESA / DADOS DO PARTICIPANTE ▼] [Editar]
[TREINAMENTOS                    ▼] [Editar]

─────────────────────────────────────────────
[ ] Declaro que as informações fornecidas são
    verídicas e atualizadas. *

[ ] Li e estou de acordo com a
    Política de Privacidade *

[reCAPTCHA — Não sou um robô]

           [← Anterior]   [Enviar Solicitação]
```

---

## Tela 4 — Agradecimento

**Rota:** `/solicitar-proposta/obrigado`

```
┌──────────────────────────────────────────┐
│  [Logo ONC]                              │
│  Organismo Nacional de Certificação      │
├──────────────────────────────────────────┤
│                                          │
│   Obrigado por seu interesse             │
│   nos serviços do ONC!                   │
│                                          │
│   Em breve receberá um e-mail para       │
│   completar a sua solicitação.           │
│                                          │
│        [Ir para o site ONC]              │
│                                          │
└──────────────────────────────────────────┘
```

> Texto específico para o formulário inicial (lead). Após o envio do complementar (certificação ou treinamento), a mensagem muda para: *"Sua solicitação foi enviada com sucesso. Em breve nosso departamento comercial entrará em contato."*

---

## E-mail Automático (Pós-Formulário Inicial)

Disparado automaticamente após cadastro do lead.

| Atributo | Valor |
|----------|-------|
| Remetente | `no-reply-otp@onccertificacao.com.br` |
| Assunto | `ONC Certificação - Solicitação de Proposta de <Tipo> - Mensagem Automática do Sistema ONC` |

**Corpo do e-mail:**

```
Agradecemos por seu contato e para darmos continuidade a sua solicitação,
pedimos a gentileza de clicar no link abaixo e preencher as informações
necessárias para a elaboração da sua proposta.

[Clique aqui para preencher a sua solicitação.]

Ficamos no aguardo das informações.

Atenciosamente,

Departamento Comercial
ONC Organismo Nacional de Certificação
Rua Correia Dias, 184, 11º andar - Paraíso
04104-000   São Paulo - SP
Fone: +55 11 3052-4274
www.onccertificacao.com.br
```

**Tipografia da assinatura:**
- Fonte: Century Gothic
- "ONC Organismo Nacional de Certificação" → vermelho `rgb(102, 0, 0)`
- Demais dados → cinza `rgb(68, 68, 68)`

> O link do e-mail direciona para `/solicitar-proposta/certificacao` ou `/solicitar-proposta/treinamento` de acordo com o Tipo de Proposta selecionado no formulário inicial.

---

## Tipos TypeScript (`src/types/lead.ts`)

```typescript
// --- Formulário Inicial ---
export interface LeadFormData {
  tipoProposta: 'certificacao' | 'treinamento';
  nomeContato: string;
  empresa: string;
  setor: 'privado' | 'publico';
  cargo: string;
  email: string;
  telefone: string;
  whatsapp: string;
  comoPodemosAjudar: string;
  aceitaPoliticaPrivacidade: boolean;
}

// --- Certificação ---
export interface CertificacaoStep1 {
  tipoCertificacao: 'inicial' | 'transferencia';
  numeroCertificado?: string;
  validadeCertificado?: string;
  ondeNosConheceu?: string;
  nomeContato: string;
  cargo: string;
  empresa: string;
  email: string;
  dataNascimento?: string;
  telefone: string;
  whatsapp?: string;
}

export interface CertificacaoStep2 {
  normasSelecionadas: number[];   // IDs da tabela Normas
  outraNorma?: string;
}

export interface CertificacaoStep3 {
  cnpj: string;
  website?: string;
  razaoSocial: string;
  setorEmpresa: 'privado' | 'publico';
  emailEmpresa: string;
  telefoneEmpresa: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}

export interface LocalidadeCertificacao {
  nome: string;
  estado: string;
  cidade: string;
  atividades: string;
  totalFuncionarios: number;
  funcionariosAdm: number;
  funcionariosOp: number;
  numeroDeTurnos: number;
  horarioInicio: string;
  horarioTermino: string;
}

export interface CertificacaoStep4 {
  produtosServicos: string;
  principaisProcessos: string;
  principaisObrigacoesLegais?: string;
  jaCertificada: boolean;
  descricaoCertificacoes?: string;
  responssavelProjeto: boolean;
  terceirizaProcesso: boolean;
  processosTerceirizados?: string;
}

export interface CertificacaoStep5 {
  grauImplementacao: 'total' | 'parcial' | 'nao';
  grauIntegracao: 'total' | 'parcial' | 'nao';
  cobreTodasLocalidades: boolean;
  localidadesIndependentes?: string;
  utilizaConsultoria: boolean;
  nomeConsultoria?: string;
  nomeConsultor?: string;
  certificacaoAcreditada: boolean;
  escopo: string;
  localidades: LocalidadeCertificacao[];
  arquivoLocalidades?: File;
  funcionariosEmClientes: boolean;
  descricaoClientes?: string;
}

export interface DadosEspecificosLixoZero {
  areaTotalM2: number;
  residuosGerados: string;
  possuiGestaoResiduos: boolean;
  tiposResiduos: string;
  geracaoMensalKg: number;
  porcentualReciclagem: number;
  existeDestinacao: boolean;
  quemRealiza?: 'propria' | 'contratada';
  arquivoLocalidades?: File;
}

export interface DadosEspecificosISO50001 {
  consumoTotalKwh: number;
  numeroFontesEnergia: number;
  numeroUsoSignificativos: number;
}

export interface DadosEspecificosISO14001 {
  aspectosAmbientais: string;
  requisitosLegaisAmbientais?: string;
}

export interface DadosEspecificosISO45001 {
  riscosSSOIdentificados: string;
  principaisAmeacas?: string;
  materiaisPerigosos?: string;
  acidentesSemAfastamento: boolean;
  totalAcidentesSemAfastamento?: number;
  acidentesComAfastamento: boolean;
  totalAcidentesComAfastamento?: number;
  requisitosLegaisSSO: string;
  alocaFuncionariosEmClientes: boolean;
  sistemaGestaoCobreClientes?: boolean;
  avaliadaPorOrgao: boolean;
  descricaoOrgao?: string;
}

export interface DadosEspecificosISO22000 {
  appccs: string;
  linhasProcessos: string;
  categoriasAlimentos: string;
  subcategoriasAlimentos: string;
  pprs: string;
}

export interface DadosEspecificosISO37001 {
  pessoasServicosFinanceiros: number;
  pessoasElaboracaoOfertas: number;
  pessoasAquisicoes: number;
  pessoasComunicacaoSubcontratados: number;
  realizaDoacoes: boolean;
  descricaoDoacoes?: string;
  envolvidoSuborno: boolean;
}

export interface CertificacaoStep6 {
  lixoZero?: DadosEspecificosLixoZero;
  iso50001?: DadosEspecificosISO50001;
  iso14001?: DadosEspecificosISO14001;
  iso45001?: DadosEspecificosISO45001;
  iso22000?: DadosEspecificosISO22000;
  iso37001?: DadosEspecificosISO37001;
}

export interface CertificacaoFormData {
  step1: CertificacaoStep1;
  step2: CertificacaoStep2;
  step3: CertificacaoStep3;
  step4: CertificacaoStep4;
  step5: CertificacaoStep5;
  step6: CertificacaoStep6;
  aceitaTermos: boolean;
  aceitaPoliticaPrivacidade: boolean;
}

// --- Treinamento ---
export interface TreinamentoLinha {
  normaId: number | 'outra';
  outraNorma?: string;
  tipoTreinamentoId: number | 'outro';
  outroTipoTreinamento?: string;
  totalParticipantes: number;
  formatoId: number;
  dataPrevista: string;
}

export interface TreinamentoFormData {
  paraQuem: 'empresa' | 'pessoa_fisica';
  ondeNosConheceu?: string;
  // Solicitante (pré-preenchido)
  nomeContato: string;
  cargo: string;
  email: string;
  dataNascimento?: string;
  telefone: string;
  whatsapp?: string;
  // Empresa (se paraQuem === 'empresa')
  empresa?: CertificacaoStep3;
  // Participante (se paraQuem === 'pessoa_fisica')
  participante?: {
    nomeCompleto: string;
    cpf: string;
    email: string;
    dataNascimento: string;
    telefone: string;
    whatsapp?: string;
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    empresaOndeTrabalha?: string;
    cargo?: string;
  };
  treinamentos: TreinamentoLinha[];
  aceitaTermos: boolean;
  aceitaPoliticaPrivacidade: boolean;
}
```

---

## Regras Gerais de Validação

| Tipo de campo | Regra |
|---------------|-------|
| E-mail | Formato RFC — `/.+@.+\..+/` |
| Telefone / WhatsApp | Máscara `(99) 99999-9999` |
| CNPJ | Máscara + validação de dígitos verificadores |
| CPF | Máscara `999.999.999-99` + validação de dígitos |
| CEP | Máscara `99999-999` — ao preencher, tentar auto-fill via ViaCEP |
| Data | Máscara `dd/mm/aaaa` |
| Horário | Formato `HH:MM` |
| Textarea "Outra norma" | Máx. 100 caracteres com contador |
| Campos numéricos de pessoas | Inteiro positivo, máx. 3 dígitos |

---

## Pontos Pendentes para Definição

| Item | Observação |
|------|-----------|
| Figma | Designs mencionados nos docs mas não compartilhados. Usar `upede.com.br/business` como referência de layout multi-step |
| Endpoints do backend | Definir URL e payload esperado para POST de lead, certificação e treinamento |
| Chave reCAPTCHA | Site key pública do Google reCAPTCHA v2 |
| URL Política de Privacidade | Já existe em `https://www.onccertificacao.com.br/politica-de-privacidade/` |
| Tabelas do banco | Normas, Tipos de Treinamento, Formatos de Treinamento — confirmar schema e endpoint de leitura |
| Token do link de e-mail | Mecanismo de token para que o link do e-mail abra o formulário complementar pré-identificado |
| Status de inativação automática | Regra dos 30 dias + 3 follow-ups fica no backend; front apenas exibe dados |
| Dashboard Comercial | Fora do escopo das telas de captação; será tela interna do painel admin |
