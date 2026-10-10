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
  // Usado apenas na gestão administrativa (tela /leads) para ativar/desativar um lead.
  // No formulário público de captação este campo não é definido (assume-se `true`).
  isAtivo?: boolean;
}

// --- Backend ONC (domínio Lead — swagger `backend.url.txt`) ---
// Obs.: o swagger não nomeia os valores dos enums (apenas inteiros). Mapeamento assumido
// com base na ordem exibida no formulário; ajustar aqui caso o backend use outra ordem.
export enum EnumTipoPropostaLead {
  Certificacao = 0,
  Treinamento = 1
}

export enum EnumSetorEmpresa {
  Privado = 0,
  Publico = 1
}

// Valores 0/1/2 confirmados no swagger, nomes não documentados — não utilizado no formulário público.
export enum EnumLeadOrderBy {
  Id = 0,
  NomeContato = 1,
  DataCriacao = 2
}

export interface LeadCreateDTO {
  nomeContato: string;
  tipoProposta: EnumTipoPropostaLead;
  empresa: string;
  setor: EnumSetorEmpresa;
  cargo: string;
  email: string;
  telefone: string;
  whatsapp: string;
  comoPodemosAjudar: string;
  isAceitaPoliticaPrivacidade?: boolean;
  isAtivo?: boolean;
}

/** Representa o objeto `Lead` retornado pelo backend (schema `Lead` do swagger). */
export interface LeadDTO {
  id: number;
  tipoProposta: EnumTipoPropostaLead;
  nomeContato: string;
  empresa: string;
  setor: EnumSetorEmpresa;
  cargo: string;
  email: string;
  telefone: string;
  whatsapp: string;
  comoPodemosAjudar: string;
  isAceitaPoliticaPrivacidade?: boolean | null;
  isAtivo: boolean;
  // Dados complementares de certificação (domínio `LeadCertificacoes`) — fora do escopo atual.
  certificacao?: unknown | null;
}

export interface LeadPagedResult {
  items: LeadDTO[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface LeadListParams {
  page?: number;
  pageSize?: number;
  orderBy?: EnumLeadOrderBy;
}

export interface CheckEmailExistsResult {
  exists: boolean;
  hasExistingLead: boolean;
}

export interface CheckCNPJExistsResult {
  exists: boolean;
  hasActiveRequest: boolean;
  hasExistingRequest: boolean;
}

/***************************  MAPPERS — LeadFormData <-> LeadCreateDTO/LeadDTO  ***************************/

export function tipoPropostaToEnum(tipo: LeadFormData['tipoProposta']): EnumTipoPropostaLead {
  return tipo === 'treinamento' ? EnumTipoPropostaLead.Treinamento : EnumTipoPropostaLead.Certificacao;
}

export function enumToTipoProposta(value: EnumTipoPropostaLead): LeadFormData['tipoProposta'] {
  return value === EnumTipoPropostaLead.Treinamento ? 'treinamento' : 'certificacao';
}

export function setorToEnum(setor: LeadFormData['setor']): EnumSetorEmpresa {
  return setor === 'publico' ? EnumSetorEmpresa.Publico : EnumSetorEmpresa.Privado;
}

export function enumToSetor(value: EnumSetorEmpresa): LeadFormData['setor'] {
  return value === EnumSetorEmpresa.Publico ? 'publico' : 'privado';
}

export function mapLeadFormDataToCreateDTO(form: LeadFormData): LeadCreateDTO {
  return {
    nomeContato: form.nomeContato,
    tipoProposta: tipoPropostaToEnum(form.tipoProposta),
    empresa: form.empresa,
    setor: setorToEnum(form.setor),
    cargo: form.cargo,
    email: form.email,
    telefone: form.telefone,
    whatsapp: form.whatsapp,
    comoPodemosAjudar: form.comoPodemosAjudar,
    isAceitaPoliticaPrivacidade: form.aceitaPoliticaPrivacidade,
    isAtivo: form.isAtivo ?? true
  };
}

export function mapLeadDTOToFormData(lead: LeadDTO): LeadFormData {
  return {
    tipoProposta: enumToTipoProposta(lead.tipoProposta),
    nomeContato: lead.nomeContato,
    empresa: lead.empresa,
    setor: enumToSetor(lead.setor),
    cargo: lead.cargo,
    email: lead.email,
    telefone: lead.telefone,
    whatsapp: lead.whatsapp,
    comoPodemosAjudar: lead.comoPodemosAjudar,
    aceitaPoliticaPrivacidade: !!lead.isAceitaPoliticaPrivacidade,
    isAtivo: lead.isAtivo
  };
}

// --- Certificação ---
export interface Certificado {
  numero: string;
  validade: string;
}

export interface CertificacaoStep1 {
  tipoCertificacao: 'inicial' | 'transferencia';
  certificados?: Certificado[];
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
  normasSelecionadas: string[]; // Nomes das normas (temp: usar IDs quando integrar com backend)
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
  jaCertificada: 'true' | 'false';
  descricaoCertificacoes?: string;
  responssavelProjeto: 'true' | 'false';
  terceirizaProcesso: 'true' | 'false';
  processosTerceirizados?: string;
}

export interface CertificacaoStep5 {
  grauImplementacao: 'total' | 'parcial' | 'nao';
  grauIntegracao: 'total' | 'parcial' | 'nao';
  cobreTodasLocalidades: 'true' | 'false';
  localidadesIndependentes?: string;
  utilizaConsultoria: 'true' | 'false';
  nomeConsultoria?: string;
  nomeConsultor?: string;
  certificacaoAcreditada: 'true' | 'false';
  escopo: string;
  localidades: LocalidadeCertificacao[];
  // Inputs nativos `type="file"` registrados via react-hook-form armazenam um FileList
  // (não um File único) — ver src/utils/file.ts para extrair o arquivo selecionado.
  arquivoLocalidades?: File | FileList;
  funcionariosEmClientes: 'true' | 'false';
  descricaoClientes?: string;
}

export interface DadosEspecificosLixoZero {
  areaTotalM2: number;
  residuosGerados: string;
  possuiGestaoResiduos: 'true' | 'false';
  tiposResiduos: string;
  geracaoMensalKg: number;
  porcentualReciclagem: number;
  existeDestinacao: 'true' | 'false';
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
  acidentesSemAfastamento: 'true' | 'false';
  totalAcidentesSemAfastamento?: number;
  acidentesComAfastamento: 'true' | 'false';
  totalAcidentesComAfastamento?: number;
  requisitosLegaisSSO: string;
  alocaFuncionariosEmClientes: 'true' | 'false';
  sistemaGestaoCobreClientes?: 'true' | 'false';
  avaliadaPorOrgao: 'true' | 'false';
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
  realizaDoacoes: 'true' | 'false';
  descricaoDoacoes?: string;
  envolvidoSuborno: 'true' | 'false';
}

export interface CertificacaoStep6 {
  lixoZero?: DadosEspecificosLixoZero;
  iso50001?: DadosEspecificosISO50001;
  iso14001?: DadosEspecificosISO14001;
  iso45001?: DadosEspecificosISO45001;
  iso22000?: DadosEspecificosISO22000;
  iso37001?: DadosEspecificosISO37001;
  aceitaTermos?: boolean;
  aceitaPoliticaPrivacidade?: boolean;
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
  id?: number;
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
