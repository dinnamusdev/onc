// @next
import { NextResponse } from 'next/server';

// @types
import { LeadFormData, mapLeadFormDataToCreateDTO } from '@/types/lead';

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

/***************************  ONC - GET LEADS (list, paginado)  ***************************/
// Backend: GET /auth/api/Lead?page=&pageSize=&orderBy= -> LeadPagedResultServiceResponse { data: LeadPagedResult }

export async function getLeads(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = new URLSearchParams();
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const orderBy = searchParams.get('orderBy');
    if (page) query.append('page', page);
    if (pageSize) query.append('pageSize', pageSize);
    if (orderBy) query.append('orderBy', orderBy);

    const res = await fetch(`${ONC_API}/auth/api/Lead?${query.toString()}`, {
      headers: authHeaders(request)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to fetch leads', errors: erros }, { status: res.status });
    }

    const data = (payload as { data?: unknown })?.data ?? payload;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET LEAD BY ID  ***************************/
// Backend: GET /auth/api/Lead/lead-by-id?id= -> LeadServiceResponse { data: Lead }

export async function getLeadById(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const res = await fetch(`${ONC_API}/auth/api/Lead/lead-by-id?id=${encodeURIComponent(id ?? '')}`, {
      headers: authHeaders(request)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to fetch lead', errors: erros }, { status: res.status });
    }

    const data = (payload as { data?: unknown })?.data ?? payload;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET LEAD BY EMAIL  ***************************/
// Backend: GET /auth/api/Lead/lead-by-email?email= -> LeadServiceResponse { data: Lead }

export async function getLeadByEmail(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const res = await fetch(`${ONC_API}/auth/api/Lead/lead-by-email?email=${encodeURIComponent(email)}`, {
      headers: authHeaders(request)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to fetch lead', errors: erros }, { status: res.status });
    }

    const data = (payload as { data?: unknown })?.data ?? payload;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CREATE LEAD  ***************************/
// Backend: POST /auth/api/Lead (LeadCreateDTO) -> LeadServiceResponse { data: Lead }

export async function createLead(request: Request) {
  try {
    const body: LeadFormData = await request.json();
    const dto = mapLeadFormDataToCreateDTO(body);

    const res = await fetch(`${ONC_API}/auth/api/Lead`, {
      method: 'POST',
      headers: authHeaders(request),
      body: JSON.stringify(dto)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to create lead', errors: erros }, { status: res.status });
    }

    const data = (payload as { data?: unknown })?.data ?? payload;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - UPDATE LEAD  ***************************/
// Backend: PUT /auth/api/Lead?id= (LeadCreateDTO) -> LeadServiceResponse { data: Lead }

export async function updateLead(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body: LeadFormData = await request.json();
    const dto = mapLeadFormDataToCreateDTO(body);

    const res = await fetch(`${ONC_API}/auth/api/Lead?id=${encodeURIComponent(id ?? '')}`, {
      method: 'PUT',
      headers: authHeaders(request),
      body: JSON.stringify(dto)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to update lead', errors: erros }, { status: res.status });
    }

    const data = (payload as { data?: unknown })?.data ?? payload;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - DELETE LEAD  ***************************/
// Backend: DELETE /auth/api/Lead?id= -> StringServiceResponse

export async function deleteLead(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const res = await fetch(`${ONC_API}/auth/api/Lead?id=${encodeURIComponent(id ?? '')}`, {
      method: 'DELETE',
      headers: authHeaders(request)
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to delete lead', errors: erros }, { status: res.status });
    }

    return NextResponse.json({ message: 'Lead deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CHECK EMAIL EXISTS  ***************************/
// Reaproveita GET /auth/api/Lead/lead-by-email para aplicar a regra de negócio descrita em
// DOCUMENTACAO_TELAS_LEAD.md: "hasExistingLead" = contato ATIVO e sem solicitação complementar
// (certificação) preenchida ainda.

export async function checkEmailExists(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const res = await fetch(`${ONC_API}/auth/api/Lead/lead-by-email?email=${encodeURIComponent(email)}`, {
      headers: authHeaders(request)
    });

    if (res.status === 404) {
      return NextResponse.json({ exists: false, hasExistingLead: false }, { status: 200 });
    }

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const { message, erros } = extractErrorPayload(payload);
      return NextResponse.json({ error: message || 'Failed to check email', errors: erros }, { status: res.status });
    }

    const lead = ((payload as { data?: Record<string, unknown> | null })?.data ?? null) as
      | { isAtivo?: boolean; certificacao?: unknown }
      | null;

    const exists = !!lead;
    const hasExistingLead = exists && !!lead?.isAtivo && !lead?.certificacao;

    return NextResponse.json({ exists, hasExistingLead }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CHECK CNPJ EXISTS  ***************************/
// Não há endpoint correspondente no swagger (fora do domínio Lead) — mantido como placeholder
// até o fluxo de Certificação (LeadCertificacoes) ser implementado.

export async function checkCNPJExists(request: Request) {
  try {
    await request.json();
    return NextResponse.json({ exists: false, hasActiveRequest: false, hasExistingRequest: false }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to check CNPJ' }, { status: 500 });
  }
}

// Export as a single object for easy import
const oncLeadApi = {
  getLeads,
  getLeadById,
  getLeadByEmail,
  createLead,
  updateLead,
  deleteLead,
  checkEmailExists,
  checkCNPJExists
};

export default oncLeadApi;
