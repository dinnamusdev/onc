import { rbacProvider } from '@/app/api/rbac/rbacProvider';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.createPermission(request);
}

export async function PUT(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.updatePermission(request);
}

export async function DELETE(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.deletePermission(request);
}
