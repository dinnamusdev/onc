// @next
import { NextResponse } from 'next/server';

// @project
import { authProvider } from '@/app/api/auth/authProvider';

export async function GET(request: Request) {
  try {
    const authProviderHandler = await authProvider();

    if (authProviderHandler.activateAccount) {
      return await authProviderHandler.activateAccount(request);
    } else {
      return NextResponse.json({ error: 'Activate account functionality not available' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
