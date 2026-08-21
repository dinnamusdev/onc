// @next
import { NextResponse } from 'next/server';

// @project
import { authProvider } from '@/app/api/auth/authProvider';

export async function POST(request: Request) {
  try {
    const authProviderHandler = await authProvider();

    // Check if `requestCodePasswordReset` is defined and is a function
    if (authProviderHandler.requestCodePasswordReset) {
      return await authProviderHandler.requestCodePasswordReset(request);
    } else {
      return NextResponse.json({ error: 'Request code password reset functionality not available' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
