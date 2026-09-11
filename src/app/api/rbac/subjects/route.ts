import { rbacProvider } from '@/app/api/rbac/rbacProvider';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.getSubjects(request);
}

export async function POST(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.createSubject(request);
}

export async function PUT(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.updateSubject(request);
}

export async function DELETE(request: NextRequest) {
  const provider = await rbacProvider();
  return provider.deleteSubject(request);
}
