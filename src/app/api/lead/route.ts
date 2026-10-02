// @next
import { NextRequest } from 'next/server';

// @project
import { leadProvider } from './leadProvider';

/***************************  API - LEAD  ***************************/

export async function POST(request: NextRequest) {
  const provider = await leadProvider();
  return provider.createLead(request);
}
