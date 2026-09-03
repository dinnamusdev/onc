import { rbacProvider } from '@/app/api/rbac/rbacProvider';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.getRoles(request);
}

export async function POST(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.createRole(request);
}
