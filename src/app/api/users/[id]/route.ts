import { usersProvider } from '@/app/api/users/usersProvider';
import { NextRequest } from 'next/server';

// As implementações (mock/ONC) leem o id de `searchParams.get('id')`.
// Como esta é uma rota dinâmica ([id]), o id chega em `params` (path param),
// então injetamos o id na query antes de repassar ao provider.

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const url = new URL(request.url);
  url.searchParams.set('id', id);

  const newRequest = new NextRequest(url, {
    method: 'GET',
    headers: request.headers
  });

  const provider = await usersProvider();
  return provider.getUserById(newRequest);
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

  const provider = await usersProvider();
  return provider.updateUser(newRequest);
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const url = new URL(request.url);
  url.searchParams.set('id', id);

  const newRequest = new NextRequest(url, {
    method: 'DELETE',
    headers: request.headers
  });

  const provider = await usersProvider();
  return provider.deleteUser(newRequest);
}
