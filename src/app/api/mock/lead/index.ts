// @next
import { NextResponse } from 'next/server';

// @types
import { LeadFormData } from '@/types/lead';

// In-memory storage for mock operations
const leads: LeadFormData[] = [];

/***************************  MOCK - CREATE LEAD  ***************************/

export async function createLead(request: Request) {
  try {
    const body: LeadFormData = await request.json();

    const newLead = {
      id: (leads.length + 1).toString(),
      ...body,
      createdAt: new Date().toISOString()
    };

    leads.push(newLead);

    return NextResponse.json(newLead, { status: 201 });
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

    return NextResponse.json(
      {
        exists: !!existingLead,
        hasExistingLead: existingLead ? true : false
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - CHECK CNPJ EXISTS  ***************************/

export async function checkCNPJExists(request: Request) {
  try {
    const body = await request.json();
    const { cnpj, normas } = body;

    // Mock implementation - always return false for now
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
  createLead,
  checkEmailExists,
  checkCNPJExists
};

export default mockLeadApi;
