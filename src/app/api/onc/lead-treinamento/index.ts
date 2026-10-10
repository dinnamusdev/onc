// @next
import { NextResponse } from 'next/server';

// @types
import { LeadTreinamentoCreateDTO, LeadTreinamentoUpdateDTO } from '@/types/leadTreinamento';

const ONC_API = process.env.ONC_API_BASE_URL || 'http://env-0887520.sp1.br.saveincloud.net.br';

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function extractErrorPayload(payload: unknown): { message?: string; errors?: string[] } {
  const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const message = (record.message as string) || (record.title as string) || undefined;
  const rawErrors = record.erros ?? record.errors;
  return { message, errors: Array.isArray(rawErrors) ? (rawErrors as string[]) : undefined };
}

function authHeaders(request: Request): Record<string, string> {
  const authorization = request.headers.get('Authorization');
  return {
    'Content-Type': 'application/json',
    ...(authorization ? { Authorization: authorization } : {})
  };
}

async function forwardResponse(response: Response, successStatus = 200) {
  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    const { message, errors } = extractErrorPayload(payload);
    return NextResponse.json({ error: message || 'Falha na API de treinamento', errors }, { status: response.status });
  }
  const data = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;
  return NextResponse.json(data ?? null, { status: successStatus });
}

export async function getLeadTreinamentos(request: Request) {
  const response = await fetch(`${ONC_API}/auth/api/LeadTreinamentos`, { headers: authHeaders(request) });
  return forwardResponse(response);
}

export async function getLeadTreinamento(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams();
  for (const key of ['leadTreinamentoId', 'leadId', 'email']) {
    const value = searchParams.get(key);
    if (value) query.set(key, value);
  }
  const response = await fetch(`${ONC_API}/auth/api/LeadTreinamentos/GetLeadTreinamento?${query}`, {
    headers: authHeaders(request)
  });
  if (response.status === 404) return NextResponse.json(null, { status: 200 });
  return forwardResponse(response);
}

export async function createLeadTreinamento(request: Request) {
  const dto: LeadTreinamentoCreateDTO = await request.json();
  const response = await fetch(`${ONC_API}/auth/api/LeadTreinamentos`, {
    method: 'POST',
    headers: authHeaders(request),
    body: JSON.stringify(dto)
  });
  return forwardResponse(response, 201);
}

export async function updateLeadTreinamento(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('leadId');
  const dto: LeadTreinamentoUpdateDTO = await request.json();
  const response = await fetch(`${ONC_API}/auth/api/LeadTreinamentos?leadId=${encodeURIComponent(leadId ?? '')}`, {
    method: 'PUT',
    headers: authHeaders(request),
    body: JSON.stringify(dto)
  });
  return forwardResponse(response);
}

const oncLeadTreinamentoApi = {
  getLeadTreinamentos,
  getLeadTreinamento,
  createLeadTreinamento,
  updateLeadTreinamento
};

export default oncLeadTreinamentoApi;
