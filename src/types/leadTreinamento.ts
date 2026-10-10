import { CertificacaoStep3, EnumSetorEmpresa, LeadFormData, TreinamentoFormData, TreinamentoLinha, setorToEnum } from '@/types/lead';

// A API exposes these values as integers without named enum members.
export enum EnumParaQuemTreinamento {
  Empresa = 0,
  PessoaFisica = 1
}

export interface LeadTreinamentoEmpresa {
  cnpj?: string | null;
  website?: string | null;
  razaoSocial?: string | null;
  setorEmpresa?: EnumSetorEmpresa | null;
  emailEmpresa?: string | null;
  telefoneEmpresa?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cep?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

export interface LeadTreinamentoParticipante {
  nomeCompleto?: string | null;
  cpf?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cep?: string | null;
  cidade?: string | null;
  estado?: string | null;
  empresaOndeTrabalha?: string | null;
  cargo?: string | null;
}

export interface LeadTreinamentoItem {
  id?: number | null;
  normaId: number | null;
  outraNorma?: string | null;
  tipoTreinamentoId: number | null;
  outroTipoTreinamento?: string | null;
  totalParticipantes: number;
  formatoId: number;
  dataPrevista: string;
}

export interface LeadTreinamentoDTO {
  id: number;
  leadId?: number | null;
  paraQuem?: number | null;
  ondeNosConheceu?: string | null;
  nomeContato?: string | null;
  cargo?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  participante?: LeadTreinamentoParticipante | null;
  empresa?: LeadTreinamentoEmpresa | null;
  treinamentos?: LeadTreinamentoItem[] | null;
  isAceitaTermos?: boolean | null;
  isAceitaPoliticaPrivacidade?: boolean | null;
}

export type LeadTreinamentoCreateDTO = Omit<LeadTreinamentoDTO, 'id'> & {
  leadId: number;
  paraQuem: EnumParaQuemTreinamento;
  nomeContato: string;
  cargo: string;
  email: string;
  telefone: string;
  isAceitaTermos: boolean;
  isAceitaPoliticaPrivacidade: boolean;
  treinamentos: LeadTreinamentoItem[];
};

export interface LeadTreinamentoUpdateDTO {
  paraQuem: EnumParaQuemTreinamento;
  ondeNosConheceu?: string | null;
  nomeContato?: string | null;
  cargo?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  participante?: LeadTreinamentoParticipante | null;
  empresa?: LeadTreinamentoEmpresa | null;
  treinamentos?: LeadTreinamentoItem[] | null;
  isAceitaTermos?: boolean | null;
  isAceitaPoliticaPrivacidade?: boolean | null;
}

export interface LeadTreinamentoPagedResult {
  items: LeadTreinamentoDTO[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

function toIsoDate(value?: string | null): string | null {
  if (!value) return null;
  const dateOnly = value.includes('/') ? value.split('/').reverse().join('-') : value.slice(0, 10);
  const date = new Date(`${dateOnly}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function dateInputValue(value?: string | null): string {
  return value ? value.slice(0, 10) : '';
}

function dateInputMaskValue(value?: string | null): string {
  if (!value) return '';
  const [year, month, day] = value.slice(0, 10).split('-');
  return year && month && day ? `${day}/${month}/${year}` : '';
}

function mapCompanyToDTO(company?: CertificacaoStep3): LeadTreinamentoEmpresa | null {
  if (!company) return null;
  return {
    cnpj: company.cnpj,
    website: company.website || null,
    razaoSocial: company.razaoSocial,
    setorEmpresa: setorToEnum(company.setorEmpresa),
    emailEmpresa: company.emailEmpresa,
    telefoneEmpresa: company.telefoneEmpresa,
    endereco: company.endereco,
    numero: company.numero,
    complemento: company.complemento || null,
    bairro: company.bairro,
    cep: company.cep,
    cidade: company.cidade,
    estado: company.estado
  };
}

function mapTrainingLineToDTO(line: TreinamentoLinha): LeadTreinamentoItem {
  return {
    normaId: typeof line.normaId === 'number' ? line.normaId : null,
    outraNorma: line.outraNorma || null,
    tipoTreinamentoId: typeof line.tipoTreinamentoId === 'number' ? line.tipoTreinamentoId : null,
    outroTipoTreinamento: line.outroTipoTreinamento || null,
    totalParticipantes: Number(line.totalParticipantes),
    formatoId: Number(line.formatoId),
    dataPrevista: toIsoDate(line.dataPrevista) ?? ''
  };
}

export function mapTreinamentoFormToCreateDTO(leadId: number, form: TreinamentoFormData): LeadTreinamentoCreateDTO {
  return {
    leadId,
    paraQuem: form.paraQuem === 'empresa' ? EnumParaQuemTreinamento.Empresa : EnumParaQuemTreinamento.PessoaFisica,
    ondeNosConheceu: form.ondeNosConheceu || null,
    nomeContato: form.nomeContato,
    cargo: form.cargo,
    email: form.email,
    dataNascimento: toIsoDate(form.dataNascimento),
    telefone: form.telefone,
    whatsapp: form.whatsapp || null,
    ...(form.paraQuem === 'empresa' ? { empresa: mapCompanyToDTO(form.empresa) } : {}),
    ...(form.paraQuem === 'pessoa_fisica' && form.participante
      ? { participante: { ...form.participante, dataNascimento: toIsoDate(form.participante.dataNascimento) ?? '' } }
      : {}),
    treinamentos: form.treinamentos.map(mapTrainingLineToDTO),
    isAceitaTermos: form.aceitaTermos,
    isAceitaPoliticaPrivacidade: form.aceitaPoliticaPrivacidade
  };
}

export function mapTreinamentoFormToLeadForm(form: TreinamentoFormData): LeadFormData {
  const companyName = form.paraQuem === 'empresa' ? form.empresa?.razaoSocial : form.participante?.empresaOndeTrabalha;
  const participantName = form.participante?.nomeCompleto;
  const participantRole = form.participante?.cargo;
  const totalPeople = form.treinamentos.reduce((sum, item) => sum + Number(item.totalParticipantes || 0), 0);

  return {
    tipoProposta: 'treinamento',
    nomeContato: form.nomeContato,
    empresa: companyName || participantName || 'Pessoa Física',
    setor: form.paraQuem === 'empresa' ? (form.empresa?.setorEmpresa ?? 'privado') : 'privado',
    cargo: form.cargo || participantRole || 'Não informado',
    email: form.email,
    telefone: form.telefone,
    whatsapp: form.whatsapp || form.telefone,
    comoPodemosAjudar: `Solicitação de treinamento: ${form.treinamentos.length} treinamento(s) para ${totalPeople} participante(s).`,
    aceitaPoliticaPrivacidade: form.aceitaPoliticaPrivacidade,
    isAtivo: true
  };
}

export function mapLeadTreinamentoToForm(dto: LeadTreinamentoDTO): TreinamentoFormData {
  const company = dto.empresa;
  const participant = dto.participante;
  const toTrainingSector = (value?: number | null): 'privado' | 'publico' => value === EnumSetorEmpresa.Publico ? 'publico' : 'privado';

  return {
    paraQuem: dto.paraQuem === EnumParaQuemTreinamento.PessoaFisica ? 'pessoa_fisica' : 'empresa',
    ondeNosConheceu: dto.ondeNosConheceu ?? '',
    nomeContato: dto.nomeContato ?? '',
    cargo: dto.cargo ?? '',
    email: dto.email ?? '',
    dataNascimento: dateInputMaskValue(dto.dataNascimento),
    telefone: dto.telefone ?? '',
    whatsapp: dto.whatsapp ?? '',
    empresa: company
      ? {
          cnpj: company.cnpj ?? '',
          website: company.website ?? '',
          razaoSocial: company.razaoSocial ?? '',
          setorEmpresa: toTrainingSector(company.setorEmpresa),
          emailEmpresa: company.emailEmpresa ?? '',
          telefoneEmpresa: company.telefoneEmpresa ?? '',
          endereco: company.endereco ?? '',
          numero: company.numero ?? '',
          complemento: company.complemento ?? '',
          bairro: company.bairro ?? '',
          cep: company.cep ?? '',
          cidade: company.cidade ?? '',
          estado: company.estado ?? 'SP'
        }
      : undefined,
    participante: participant
      ? {
          nomeCompleto: participant.nomeCompleto ?? '',
          cpf: participant.cpf ?? '',
          email: participant.email ?? '',
          dataNascimento: dateInputMaskValue(participant.dataNascimento),
          telefone: participant.telefone ?? '',
          whatsapp: participant.whatsapp ?? '',
          endereco: participant.endereco ?? '',
          numero: participant.numero ?? '',
          complemento: participant.complemento ?? '',
          bairro: participant.bairro ?? '',
          cep: participant.cep ?? '',
          cidade: participant.cidade ?? '',
          estado: participant.estado ?? 'SP',
          empresaOndeTrabalha: participant.empresaOndeTrabalha ?? '',
          cargo: participant.cargo ?? ''
        }
      : undefined,
    treinamentos: (dto.treinamentos ?? []).map((item) => ({
      id: item.id ?? undefined,
      normaId: item.normaId ?? 'outra',
      outraNorma: item.outraNorma ?? '',
      tipoTreinamentoId: item.tipoTreinamentoId ?? 'outro',
      outroTipoTreinamento: item.outroTipoTreinamento ?? '',
      totalParticipantes: item.totalParticipantes ?? 1,
      formatoId: item.formatoId ?? 1,
      dataPrevista: dateInputValue(item.dataPrevista)
    })),
    aceitaTermos: dto.isAceitaTermos ?? false,
    aceitaPoliticaPrivacidade: dto.isAceitaPoliticaPrivacidade ?? false
  };
}

export function mapTreinamentoFormToUpdateDTO(form: TreinamentoFormData): LeadTreinamentoUpdateDTO {
  const dto = mapTreinamentoFormToCreateDTO(0, form);
  return {
    paraQuem: dto.paraQuem,
    ondeNosConheceu: dto.ondeNosConheceu,
    nomeContato: dto.nomeContato,
    cargo: dto.cargo,
    email: dto.email,
    dataNascimento: dto.dataNascimento,
    telefone: dto.telefone,
    whatsapp: dto.whatsapp,
    empresa: dto.empresa,
    participante: dto.participante,
    treinamentos: dto.treinamentos.map((item, index) => ({
      ...item,
      ...(form.treinamentos[index]?.id ? { id: form.treinamentos[index].id } : {})
    })),
    isAceitaTermos: dto.isAceitaTermos,
    isAceitaPoliticaPrivacidade: dto.isAceitaPoliticaPrivacidade
  };
}
