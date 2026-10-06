// @next
import { NextRequest } from 'next/server';

// @project
import { leadProvider } from '../leadProvider';

/***************************  API - LEAD BY EMAIL  ***************************/

export async function GET(request: NextRequest) {
  const provider = await leadProvider();
  return provider.getLeadByEmail(request);
}
