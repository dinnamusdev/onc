// @next
import { NextResponse } from 'next/server';

// @project
import axiosServices from '@/utils/axios';

// @types
import { LeadFormData } from '@/types/lead';

/***************************  ONC - CREATE LEAD  ***************************/

export async function createLead(request: Request) {
  try {
    const body: LeadFormData = await request.json();

    // TODO: Replace with actual ONC endpoint when available
    // const response = await axiosServices.post('/auth/api/Lead/create', body);

    // Placeholder implementation
    return NextResponse.json({ message: 'Lead created successfully', data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

/***************************  ONC - CHECK EMAIL EXISTS  ***************************/

export async function checkEmailExists(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // TODO: Replace with actual ONC endpoint when available
    // const response = await axiosServices.get(`/auth/api/Lead/check-email?email=${encodeURIComponent(email)}`);

    // Placeholder implementation
    return NextResponse.json({ exists: false, hasExistingLead: false }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check email' }, { status: 500 });
  }
}

/***************************  ONC - CHECK CNPJ EXISTS  ***************************/

export async function checkCNPJExists(request: Request) {
  try {
    const body = await request.json();
    const { cnpj, normas } = body;

    // TODO: Replace with actual ONC endpoint when available
    // const response = await axiosServices.post('/auth/api/Lead/check-cnpj', { cnpj, normas });

    // Placeholder implementation
    return NextResponse.json({ exists: false, hasActiveRequest: false, hasExistingRequest: false }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check CNPJ' }, { status: 500 });
  }
}

// Export as a single object for easy import
const oncLeadApi = {
  createLead,
  checkEmailExists,
  checkCNPJExists
};

export default oncLeadApi;
