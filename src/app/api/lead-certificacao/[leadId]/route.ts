// @next
import { NextRequest } from 'next/server';

// @project
import { leadCertificacaoProvider } from '../leadCertificacaoProvider';

/***************************  API - LEAD CERTIFICACAO BY LEAD ID  ***************************/
// Backend: PUT /auth/api/LeadCertificacoes?leadId= — o leadId chega em `params` (path param),
// então injetamos o id na query antes de repassar ao provider (mesmo padrão de src/app/api/lead/[id]/route.ts).

type Context = { params: Promise<{ leadId: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const { leadId } = await params;
  const url = new URL(request.url);
  url.searchParams.set('leadId', leadId);

  const newRequest = new NextRequest(url, {
    method: 'GET',
    headers: request.headers
  });

  const provider = await leadCertificacaoProvider();
  return provider.getLeadCertificacao(newRequest);
}

export async function PUT(request: NextRequest, { params }: Context) {
  const { leadId } = await params;
  const url = new URL(request.url);
  url.searchParams.set('leadId', leadId);

  const bodyText = await request.text();
  const newRequest = new NextRequest(url, {
    method: 'PUT',
    headers: request.headers,
    body: bodyText
  });

  const provider = await leadCertificacaoProvider();
  return provider.updateLeadCertificacao(newRequest);
}
