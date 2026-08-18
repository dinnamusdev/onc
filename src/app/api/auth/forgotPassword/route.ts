// @next
import { NextResponse } from 'next/server';

// @project
import { authProvider } from '@/app/api/auth/authProvider';

export async function POST(request: Request) {
  try {
    const authProviderHandler = await authProvider();

    // Check if `forgotPassword` is defined and is a function
    if (authProviderHandler.forgotPassword) {
      return await authProviderHandler.forgotPassword(request);
    } else {
      return NextResponse.json({ error: 'Forgot password functionality not available' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
