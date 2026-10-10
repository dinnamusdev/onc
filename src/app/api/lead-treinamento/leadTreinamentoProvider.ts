// @project
import { LEAD_TREINAMENTO_PROVIDER } from '@/config';

interface LeadTreinamentoProvider {
  getLeadTreinamentos: (request: Request) => Promise<Response>;
  getLeadTreinamento: (request: Request) => Promise<Response>;
  createLeadTreinamento: (request: Request) => Promise<Response>;
  updateLeadTreinamento: (request: Request) => Promise<Response>;
}

const leadTreinamentoProviderMapping: Record<string, () => Promise<LeadTreinamentoProvider>> = {
  mock: () => import('@/app/api/mock/lead-treinamento').then((mod) => mod.default as LeadTreinamentoProvider),
  onc: () => import('@/app/api/onc/lead-treinamento').then((mod) => mod.default as LeadTreinamentoProvider)
};

export async function leadTreinamentoProvider() {
  return leadTreinamentoProviderMapping[LEAD_TREINAMENTO_PROVIDER]();
}
