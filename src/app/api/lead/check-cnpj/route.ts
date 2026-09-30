// @next
import { NextRequest } from 'next/server';

// @project
import { leadProvider } from '../leadProvider';

/***************************  API - LEAD - CHECK CNPJ  ***************************/

export async function POST(request: NextRequest) {
  const provider = await leadProvider();
  return provider.checkCNPJExists(request);
}
