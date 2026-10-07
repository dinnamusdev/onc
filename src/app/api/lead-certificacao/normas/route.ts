// @next
import { NextRequest } from 'next/server';

// @project
import { leadCertificacaoProvider } from '../leadCertificacaoProvider';

/***************************  API - NORMAS (lista)  ***************************/
// GET /api/lead-certificacao/normas -> lista de normas disponíveis para seleção

export async function GET(request: NextRequest) {
  const provider = await leadCertificacaoProvider();
  return provider.getNormas(request);
}
