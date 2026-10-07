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
  arquivoLocalidades?: File;
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
