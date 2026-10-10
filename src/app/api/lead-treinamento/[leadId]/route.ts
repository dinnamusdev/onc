// @next
import { NextRequest } from 'next/server';

// @project
import { leadTreinamentoProvider } from '../leadTreinamentoProvider';

type Context = { params: Promise<{ leadId: string }> };

function requestWithLeadId(request: NextRequest, leadId: string, method: string, body?: string) {
  const url = new URL(request.url);
  url.searchParams.set('leadId', leadId);
  return new NextRequest(url, {
    method,
    headers: request.headers,
    ...(body !== undefined ? { body } : {})
  });
}

export async function GET(request: NextRequest, { params }: Context) {
  const { leadId } = await params;
  const provider = await leadTreinamentoProvider();
  return provider.getLeadTreinamento(requestWithLeadId(request, leadId, 'GET'));
}

export async function PUT(request: NextRequest, { params }: Context) {
  const { leadId } = await params;
  const body = await request.text();
  const provider = await leadTreinamentoProvider();
  return provider.updateLeadTreinamento(requestWithLeadId(request, leadId, 'PUT', body));
}
