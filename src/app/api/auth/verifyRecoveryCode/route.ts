// @next
import { NextResponse } from 'next/server';

// @project
import { authProvider } from '@/app/api/auth/authProvider';

export async function POST(request: Request) {
  try {
    const authProviderHandler = await authProvider();

    // Check if `verifyRecoveryCode` is defined and is a function
    if (authProviderHandler.verifyRecoveryCode) {
      return await authProviderHandler.verifyRecoveryCode(request);
    } else {
      return NextResponse.json({ error: 'Verify recovery code functionality not available' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
