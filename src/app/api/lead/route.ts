// @next
import { NextRequest } from 'next/server';

// @project
import { leadProvider } from './leadProvider';

/***************************  API - LEAD  ***************************/

export async function GET(request: NextRequest) {
  const provider = await leadProvider();
  return provider.getLeads(request);
}

export async function POST(request: NextRequest) {
  const provider = await leadProvider();
  return provider.createLead(request);
}
