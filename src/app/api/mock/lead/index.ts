// @next
import { NextResponse } from 'next/server';

// @types
import { LeadFormData, LeadDTO, LeadCreateDTO, mapLeadFormDataToCreateDTO } from '@/types/lead';

// In-memory storage for mock operations
let nextId = 1;
const leads: LeadDTO[] = [];

function createDTOToLeadDTO(dto: LeadCreateDTO, id: number): LeadDTO {
  return {
    id,
    tipoProposta: dto.tipoProposta,
    nomeContato: dto.nomeContato,
    empresa: dto.empresa,
    setor: dto.setor,
    cargo: dto.cargo,
    email: dto.email,
    telefone: dto.telefone,
    whatsapp: dto.whatsapp,
    comoPodemosAjudar: dto.comoPodemosAjudar,
    isAceitaPoliticaPrivacidade: dto.isAceitaPoliticaPrivacidade ?? false,
    isAtivo: dto.isAtivo ?? true,
    certificacao: null
  };
}

/***************************  MOCK - GET LEADS (list, paginado)  ***************************/

export async function getLeads(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1') || 1;
    const pageSize = Number(searchParams.get('pageSize') ?? '10') || 10;

    const start = (page - 1) * pageSize;
    const items = leads.slice(start, start + pageSize);

    return NextResponse.json(
      {
        items,
        page,
        pageSize,
        totalItems: leads.length,
        totalPages: Math.max(1, Math.ceil(leads.length / pageSize))
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - GET LEAD BY ID  ***************************/

export async function getLeadById(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    const lead = leads.find((l) => l.id === id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - GET LEAD BY EMAIL  ***************************/

export async function getLeadByEmail(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const lead = leads.find((l) => l.email === email);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - CREATE LEAD  ***************************/

export async function createLead(request: Request) {
  try {
    const body: LeadFormData = await request.json();
    const dto = mapLeadFormDataToCreateDTO(body);

    const newLead = createDTOToLeadDTO(dto, nextId++);
    leads.push(newLead);

    return NextResponse.json(newLead, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - UPDATE LEAD  ***************************/

export async function updateLead(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const body: LeadFormData = await request.json();
    const dto = mapLeadFormDataToCreateDTO(body);

    leads[index] = createDTOToLeadDTO(dto, id);

    return NextResponse.json(leads[index], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - DELETE LEAD  ***************************/

export async function deleteLead(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    leads.splice(index, 1);

    return NextResponse.json({ message: 'Lead deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - CHECK EMAIL EXISTS  ***************************/

export async function checkEmailExists(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const existingLead = leads.find((l) => l.email === email);
    // Regra de negócio (DOCUMENTACAO_TELAS_LEAD.md): alerta aparece quando o contato
    // está ATIVO e ainda não preencheu a solicitação complementar (certificação).
    const hasExistingLead = !!existingLead && existingLead.isAtivo && !existingLead.certificacao;

    return NextResponse.json(
      {
        exists: !!existingLead,
        hasExistingLead
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - CHECK CNPJ EXISTS  ***************************/
// Sem endpoint correspondente no backend (não faz parte do domínio Lead) — mantido como
// placeholder para o fluxo de Certificação, fora do escopo atual.

export async function checkCNPJExists(request: Request) {
  try {
    await request.json();

    return NextResponse.json(
      {
        exists: false,
        hasActiveRequest: false,
        hasExistingRequest: false
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Export as a single object for easy import
const mockLeadApi = {
  getLeads,
  getLeadById,
  getLeadByEmail,
  createLead,
  updateLead,
  deleteLead,
  checkEmailExists,
  checkCNPJExists
};

export default mockLeadApi;
