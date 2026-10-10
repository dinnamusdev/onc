// @next
import { NextRequest } from 'next/server';

// @project
import { leadTreinamentoProvider } from './leadTreinamentoProvider';

export async function GET(request: NextRequest) {
  const provider = await leadTreinamentoProvider();
  return provider.getLeadTreinamentos(request);
}

export async function POST(request: NextRequest) {
  const provider = await leadTreinamentoProvider();
  return provider.createLeadTreinamento(request);
}
