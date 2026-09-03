import { usersProvider } from '@/app/api/users/usersProvider';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const provider = await usersProvider();
  return provider.getUsers(request);
}

export async function POST(request: NextRequest) {
  const provider = await usersProvider();
  return provider.createUser(request);
}
