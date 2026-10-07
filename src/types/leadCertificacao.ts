// --- Backend ONC (domínio LeadCertificacoes — swagger `backend.url.txt`) ---
// Dados complementares de certificação, preenchidos no formulário detalhado e vinculados
// a um `Lead` (campo `leadId`). Obs.: o backend não expõe endpoint de listagem paginada
// nem de exclusão para este domínio — apenas criar, atualizar e buscar por id/leadId/email.

export enum EnumTipoCertificacao {
  Inicial = 0,
  Transferencia = 1
}

/** Representa o objeto `Norma` retornado pelo backend (schema `Norma` do swagger). */
export interface Norma {
  id: number;
  sigla: string;
}

/** Representa o objeto `LeadCertificacaoTransferencia` retornado pelo backend. */
export interface LeadCertificacaoTransferencia {
  id: number;
  leadCertificacaoId?: number | null;
  numeroCertificado?: string | null;
  validadeCertificado?: string | null;
}

export interface LeadCertificacaoTransferenciaInput {
  id?: number | null; // usado apenas no update, para identificar transferências já existentes
  numeroCertificado: string;
  validadeCertificado: string; // ISO date-time
}

/** Representa o objeto `LeadCertificacao` retornado pelo backend (schema `LeadCertificacao`). */
export interface LeadCertificacaoDTO {
  id: number;
  leadId?: number | null;
  tipoCertificacao: EnumTipoCertificacao;
  numeroCertificado?: string | null;
  validadeCertificado?: string | null;
  ondeNosConheceu?: string | null;
  nomeContato?: string | null;
  cargo?: string | null;
  empresa?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  certificadosTransferencias?: LeadCertificacaoTransferencia[] | null;
  normas?: Norma[] | null;
}

export interface LeadCertificacaoCreateDTO {
  leadId: number;
  tipoCertificacao: EnumTipoCertificacao;
  numeroCertificado?: string | null;
  validadeCertificado?: string | null;
  ondeNosConheceu?: string | null;
  nomeContato?: string | null;
  cargo?: string | null;
  empresa?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  certificadosTransferencias?: LeadCertificacaoTransferenciaInput[] | null;
  normasIds?: number[] | null;
}

export interface LeadCertificacaoUpdateDTO {
  tipoCertificacao: EnumTipoCertificacao;
  numeroCertificado?: string | null;
  validadeCertificado?: string | null;
  ondeNosConheceu?: string | null;
  nomeContato?: string | null;
  cargo?: string | null;
  empresa?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  normasIds?: number[] | null;
  certificadosTransferencias?: LeadCertificacaoTransferenciaInput[] | null;
}

/***************************  FORM DATA (formato amigável para UI)  ***************************/

export interface LeadCertificacaoFormData {
  tipoCertificacao: 'inicial' | 'transferencia';
  numeroCertificado?: string;
  validadeCertificado?: string; // yyyy-MM-dd (input type="date")
  ondeNosConheceu?: string;
  nomeContato?: string;
  cargo?: string;
  empresa?: string;
  email?: string;
  dataNascimento?: string;
  telefone?: string;
  whatsapp?: string;
  normasIds: number[];
  certificadosTransferencias: LeadCertificacaoTransferenciaInput[];
}

export const emptyLeadCertificacaoFormData: LeadCertificacaoFormData = {
  tipoCertificacao: 'inicial',
  numeroCertificado: '',
  validadeCertificado: '',
  ondeNosConheceu: '',
  nomeContato: '',
  cargo: '',
  empresa: '',
  email: '',
  dataNascimento: '',
  telefone: '',
  whatsapp: '',
  normasIds: [],
  certificadosTransferencias: []
};

/***************************  MAPPERS  ***************************/

export function tipoCertificacaoToEnum(tipo: LeadCertificacaoFormData['tipoCertificacao']): EnumTipoCertificacao {
  return tipo === 'transferencia' ? EnumTipoCertificacao.Transferencia : EnumTipoCertificacao.Inicial;
}

export function enumToTipoCertificacao(value: EnumTipoCertificacao): LeadCertificacaoFormData['tipoCertificacao'] {
  return value === EnumTipoCertificacao.Transferencia ? 'transferencia' : 'inicial';
}

export function mapLeadCertificacaoFormDataToCreateDTO(leadId: number, form: LeadCertificacaoFormData): LeadCertificacaoCreateDTO {
  return {
    leadId,
    tipoCertificacao: tipoCertificacaoToEnum(form.tipoCertificacao),
    numeroCertificado: form.numeroCertificado || null,
    validadeCertificado: form.validadeCertificado || null,
    ondeNosConheceu: form.ondeNosConheceu || null,
    nomeContato: form.nomeContato || null,
    cargo: form.cargo || null,
    empresa: form.empresa || null,
    email: form.email || null,
    dataNascimento: form.dataNascimento || null,
    telefone: form.telefone || null,
    whatsapp: form.whatsapp || null,
    normasIds: form.normasIds,
    certificadosTransferencias: form.tipoCertificacao === 'transferencia' ? form.certificadosTransferencias : []
  };
}

export function mapLeadCertificacaoFormDataToUpdateDTO(form: LeadCertificacaoFormData): LeadCertificacaoUpdateDTO {
  return {
    tipoCertificacao: tipoCertificacaoToEnum(form.tipoCertificacao),
    numeroCertificado: form.numeroCertificado || null,
    validadeCertificado: form.validadeCertificado || null,
    ondeNosConheceu: form.ondeNosConheceu || null,
    nomeContato: form.nomeContato || null,
    cargo: form.cargo || null,
    empresa: form.empresa || null,
    email: form.email || null,
    dataNascimento: form.dataNascimento || null,
    telefone: form.telefone || null,
    whatsapp: form.whatsapp || null,
    normasIds: form.normasIds,
    certificadosTransferencias: form.tipoCertificacao === 'transferencia' ? form.certificadosTransferencias : []
  };
}

export function mapLeadCertificacaoDTOToFormData(dto: LeadCertificacaoDTO): LeadCertificacaoFormData {
  return {
    tipoCertificacao: enumToTipoCertificacao(dto.tipoCertificacao),
    numeroCertificado: dto.numeroCertificado ?? '',
    validadeCertificado: dto.validadeCertificado ? dto.validadeCertificado.slice(0, 10) : '',
    ondeNosConheceu: dto.ondeNosConheceu ?? '',
    nomeContato: dto.nomeContato ?? '',
    cargo: dto.cargo ?? '',
    empresa: dto.empresa ?? '',
    email: dto.email ?? '',
    dataNascimento: dto.dataNascimento ? dto.dataNascimento.slice(0, 10) : '',
    telefone: dto.telefone ?? '',
    whatsapp: dto.whatsapp ?? '',
    normasIds: (dto.normas ?? []).map((norma) => norma.id),
    certificadosTransferencias: (dto.certificadosTransferencias ?? []).map((transferencia) => ({
      id: transferencia.id,
      numeroCertificado: transferencia.numeroCertificado ?? '',
      validadeCertificado: transferencia.validadeCertificado ? transferencia.validadeCertificado.slice(0, 10) : ''
    }))
  };
}
