// @next
import { NextRequest } from 'next/server';

// @project
import { leadProvider } from '../leadProvider';

/***************************  API - LEAD - CHECK EMAIL  ***************************/

export async function GET(request: NextRequest) {
  const provider = await leadProvider();
  return provider.checkEmailExists(request);
}
