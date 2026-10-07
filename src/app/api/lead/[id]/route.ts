// @next
import { NextRequest } from 'next/server';

// @project
import { leadProvider } from '../leadProvider';

/***************************  API - LEAD BY ID  ***************************/
// As implementações (mock/ONC) leem o id de `searchParams.get('id')`. Como esta é uma rota
// dinâmica ([id]), o id chega em `params` (path param), então injetamos o id na query antes
// de repassar ao provider.

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const url = new URL(request.url);
  url.searchParams.set('id', id);

  const newRequest = new NextRequest(url, {
    method: 'GET',
    headers: request.headers
  });

  const provider = await leadProvider();
  return provider.getLeadById(newRequest);
}

export async function PUT(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const url = new URL(request.url);
  url.searchParams.set('id', id);

  const bodyText = await request.text();
  const newRequest = new NextRequest(url, {
    method: 'PUT',
    headers: request.headers,
    body: bodyText
  });

  const provider = await leadProvider();
  return provider.updateLead(newRequest);
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const url = new URL(request.url);
  url.searchParams.set('id', id);

  const newRequest = new NextRequest(url, {
    method: 'DELETE',
    headers: request.headers
  });

  const provider = await leadProvider();
  return provider.deleteLead(newRequest);
}
