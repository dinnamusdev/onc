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
  normasSelecionadas: number[]; // IDs da tabela Normas
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
