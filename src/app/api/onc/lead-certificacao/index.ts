// @next
import { NextResponse } from 'next/server';

// @types
import { LeadCertificacaoCreateDTO, LeadCertificacaoUpdateDTO } from '@/types/leadCertificacao';

const ONC_API = process.env.ONC_API_BASE_URL || 'http://env-0887520.sp1.br.saveincloud.net.br';

/***************************  HELPERS  ***************************/

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function extractErrorPayload(payload: unknown): { message?: string; erros?: string[] } {
  const record = (payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {}) as Record<string, unknown>;
  const message = (record.message as string) || (record.title as string) || undefined;
  const raw = record.erros ?? record.errors;
  const erros = Array.isArray(raw) ? (raw as string[]) : undefined;
  return { message, erros };
}

function authHeaders(request: Request): Record<string, string> {
  const authHeader = request.headers.get('Authorization');
  return {
    'Content-Type': 'application/json',
    ...(authHeader ? { Authorization: authHeader } : {})
  };
}

/***************************  ONC - GET LEAD CERTIFICACAO  ***************************/
// Backend: GET /auth/api/LeadCertificacoes/GetLeadCertificacao?leadId=&leadCertificacaoId=&email=
// -> LeadCertificacaoServiceResponse { data: LeadCertificacao | null }

export async function getLeadCertificacao(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = new URLSearchParams();
    const leadId = searchParams.get('leadId');
    const leadCertificacaoId = searchParams.get('leadCertificacaoId');
    const email = searchParams.get('email');
    if (leadId) query.append('leadId', leadId);
    if (leadCertificacaoId) query.append('leadCertificacaoId', leadCertificacaoId);
    if (email) query.append('email', email);

    const res = await fetch(`${ONC_API}/auth/api/LeadCertificacoes/GetLeadCertificacao?${query.toString()}`, {
      headers: authHeaders(request)
    });

    if (res.status === 404) {
      return NextResponse.json(null, { status: 200 });
    }

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to fetch lead certificacao', errors: erros }, { status: res.status });
    }

    const data = (payload as { data?: unknown })?.data ?? null;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CREATE LEAD CERTIFICACAO  ***************************/
// Backend: POST /auth/api/LeadCertificacoes (LeadCertificacaoCreateDTO) -> LeadCertificacaoServiceResponse { data }

export async function createLeadCertificacao(request: Request) {
  try {
    const dto: LeadCertificacaoCreateDTO = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/LeadCertificacoes`, {
      method: 'POST',
      headers: authHeaders(request),
      body: JSON.stringify(dto)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to create lead certificacao', errors: erros }, { status: res.status });
    }

    const data = (payload as { data?: unknown })?.data ?? payload;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - UPDATE LEAD CERTIFICACAO  ***************************/
// Backend: PUT /auth/api/LeadCertificacoes?leadId= (LeadCertificacaoUpdateRequestDTO) -> LeadCertificacaoServiceResponse { data }

export async function updateLeadCertificacao(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const dto: LeadCertificacaoUpdateDTO = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/LeadCertificacoes?leadId=${encodeURIComponent(leadId ?? '')}`, {
      method: 'PUT',
      headers: authHeaders(request),
      body: JSON.stringify(dto)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to update lead certificacao', errors: erros }, { status: res.status });
    }

    const data = (payload as { data?: unknown })?.data ?? payload;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET NORMAS (lista)  ***************************/
// Backend: GET /auth/api/Norma -> Norma[]

export async function getNormas(request: Request) {
  try {
    const res = await fetch(`${ONC_API}/auth/api/Norma`, {
      headers: authHeaders(request)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to fetch normas', errors: erros }, { status: res.status });
    }

    return NextResponse.json(payload ?? [], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Export as a single object for easy import
const oncLeadCertificacaoApi = {
  getLeadCertificacao,
  createLeadCertificacao,
  updateLeadCertificacao,
  getNormas
};

export default oncLeadCertificacaoApi;
