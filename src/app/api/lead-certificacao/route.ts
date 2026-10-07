// @next
import { NextRequest } from 'next/server';

// @project
import { leadCertificacaoProvider } from './leadCertificacaoProvider';

/***************************  API - LEAD CERTIFICACAO  ***************************/
// GET /api/lead-certificacao?leadId=&leadCertificacaoId=&email= -> busca dados complementares
// POST /api/lead-certificacao -> cria dados complementares para um lead

export async function GET(request: NextRequest) {
  const provider = await leadCertificacaoProvider();
  return provider.getLeadCertificacao(request);
}

export async function POST(request: NextRequest) {
  const provider = await leadCertificacaoProvider();
  return provider.createLeadCertificacao(request);
}
