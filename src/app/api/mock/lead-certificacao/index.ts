// @next
import { NextResponse } from 'next/server';

// @types
import { LeadCertificacaoCreateDTO, LeadCertificacaoDTO, LeadCertificacaoUpdateDTO, Norma } from '@/types/leadCertificacao';

// In-memory storage for mock operations
let nextId = 1;
const leadCertificacoes: LeadCertificacaoDTO[] = [];

const mockNormas: Norma[] = [
  { id: 1, sigla: 'ISO 9001' },
  { id: 2, sigla: 'ISO 14001' },
  { id: 3, sigla: 'ISO 45001' },
  { id: 4, sigla: 'ISO/IEC 27001' },
  { id: 5, sigla: 'ISO 50001' },
  { id: 6, sigla: 'ISO 22000' },
  { id: 7, sigla: 'ISO 37001' }
];

function normasFromIds(ids?: number[] | null): Norma[] {
  if (!ids) return [];
  return mockNormas.filter((norma) => ids.includes(norma.id));
}

/***************************  MOCK - GET LEAD CERTIFICACAO  ***************************/

export async function getLeadCertificacao(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = Number(searchParams.get('leadId'));
    const leadCertificacaoId = Number(searchParams.get('leadCertificacaoId'));
    const email = searchParams.get('email');

    const found =
      leadCertificacoes.find((item) => (leadId && item.leadId === leadId) || (leadCertificacaoId && item.id === leadCertificacaoId)) ??
      (email ? leadCertificacoes.find((item) => item.email === email) : undefined);

    return NextResponse.json(found ?? null, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - CREATE LEAD CERTIFICACAO  ***************************/

export async function createLeadCertificacao(request: Request) {
  try {
    const dto: LeadCertificacaoCreateDTO = await request.json();

    const newItem: LeadCertificacaoDTO = {
      id: nextId++,
      leadId: dto.leadId,
      tipoCertificacao: dto.tipoCertificacao,
      numeroCertificado: dto.numeroCertificado ?? null,
      validadeCertificado: dto.validadeCertificado ?? null,
      ondeNosConheceu: dto.ondeNosConheceu ?? null,
      nomeContato: dto.nomeContato ?? null,
      cargo: dto.cargo ?? null,
      empresa: dto.empresa ?? null,
      email: dto.email ?? null,
      dataNascimento: dto.dataNascimento ?? null,
      telefone: dto.telefone ?? null,
      whatsapp: dto.whatsapp ?? null,
      certificadosTransferencias: (dto.certificadosTransferencias ?? []).map((transferencia, index) => ({
        id: index + 1,
        leadCertificacaoId: nextId,
        numeroCertificado: transferencia.numeroCertificado,
        validadeCertificado: transferencia.validadeCertificado
      })),
      normas: normasFromIds(dto.normasIds)
    };

    leadCertificacoes.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - UPDATE LEAD CERTIFICACAO  ***************************/

export async function updateLeadCertificacao(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = Number(searchParams.get('leadId'));

    const index = leadCertificacoes.findIndex((item) => item.leadId === leadId);
    if (index === -1) {
      return NextResponse.json({ error: 'Lead certificacao not found' }, { status: 404 });
    }

    const dto: LeadCertificacaoUpdateDTO = await request.json();
    const current = leadCertificacoes[index];

    leadCertificacoes[index] = {
      ...current,
      tipoCertificacao: dto.tipoCertificacao,
      numeroCertificado: dto.numeroCertificado ?? null,
      validadeCertificado: dto.validadeCertificado ?? null,
      ondeNosConheceu: dto.ondeNosConheceu ?? null,
      nomeContato: dto.nomeContato ?? null,
      cargo: dto.cargo ?? null,
      empresa: dto.empresa ?? null,
      email: dto.email ?? null,
      dataNascimento: dto.dataNascimento ?? null,
      telefone: dto.telefone ?? null,
      whatsapp: dto.whatsapp ?? null,
      certificadosTransferencias: (dto.certificadosTransferencias ?? []).map((transferencia, idx) => ({
        id: transferencia.id ?? idx + 1,
        leadCertificacaoId: current.id,
        numeroCertificado: transferencia.numeroCertificado,
        validadeCertificado: transferencia.validadeCertificado
      })),
      normas: normasFromIds(dto.normasIds)
    };

    return NextResponse.json(leadCertificacoes[index], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - GET NORMAS (lista)  ***************************/

export async function getNormas() {
  return NextResponse.json(mockNormas, { status: 200 });
}

// Export as a single object for easy import
const mockLeadCertificacaoApi = {
  getLeadCertificacao,
  createLeadCertificacao,
  updateLeadCertificacao,
  getNormas
};

export default mockLeadCertificacaoApi;
