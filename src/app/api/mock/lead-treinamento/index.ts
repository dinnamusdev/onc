// @next
import { NextResponse } from 'next/server';

// @types
import {
  LeadTreinamentoCreateDTO,
  LeadTreinamentoDTO,
  LeadTreinamentoUpdateDTO
} from '@/types/leadTreinamento';

let nextId = 1;
const leadTreinamentos: LeadTreinamentoDTO[] = [];

export async function getLeadTreinamentos() {
  return NextResponse.json(leadTreinamentos, { status: 200 });
}

export async function getLeadTreinamento(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = Number(searchParams.get('leadId'));
  const id = Number(searchParams.get('leadTreinamentoId'));
  const email = searchParams.get('email');
  const found = leadTreinamentos.find(
    (item) => (leadId > 0 && item.leadId === leadId) || (id > 0 && item.id === id) || (!!email && item.email === email)
  );
  return NextResponse.json(found ?? null, { status: 200 });
}

export async function createLeadTreinamento(request: Request) {
  const dto: LeadTreinamentoCreateDTO = await request.json();
  if (leadTreinamentos.some((item) => item.leadId === dto.leadId)) {
    return NextResponse.json({ error: 'Já existem dados de treinamento para este lead.' }, { status: 409 });
  }
  const created: LeadTreinamentoDTO = { ...dto, id: nextId++ };
  leadTreinamentos.push(created);
  return NextResponse.json(created, { status: 201 });
}

export async function updateLeadTreinamento(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = Number(searchParams.get('leadId'));
  const index = leadTreinamentos.findIndex((item) => item.leadId === leadId);
  if (index < 0) return NextResponse.json({ error: 'Dados de treinamento não encontrados.' }, { status: 404 });

  const dto: LeadTreinamentoUpdateDTO = await request.json();
  leadTreinamentos[index] = { ...leadTreinamentos[index], ...dto };
  return NextResponse.json(leadTreinamentos[index], { status: 200 });
}

const mockLeadTreinamentoApi = {
  getLeadTreinamentos,
  getLeadTreinamento,
  createLeadTreinamento,
  updateLeadTreinamento
};

export default mockLeadTreinamentoApi;
