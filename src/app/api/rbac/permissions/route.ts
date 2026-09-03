import { rbacProvider } from '@/app/api/rbac/rbacProvider';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.getPermissions(request);
}

export async function POST(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.assignPermission(request);
}

export async function DELETE(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.removePermission(request);
}
