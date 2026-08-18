// @next
import { NextResponse } from 'next/server';

// @project
import { authProvider } from '@/app/api/auth/authProvider';

export async function POST(request: Request) {
  try {
    const authProviderHandler = await authProvider();

    if (authProviderHandler.getUserProfile) {
      return await authProviderHandler.getUserProfile(request);
    } else {
      return NextResponse.json({ error: 'Get user profile functionality not available' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
