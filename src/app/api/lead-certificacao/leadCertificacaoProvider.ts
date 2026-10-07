// @project
import { LEAD_CERTIFICACAO_PROVIDER } from '@/config';

interface LeadCertificacaoProvider {
  getLeadCertificacao: (request: Request) => Promise<Response>;
  createLeadCertificacao: (request: Request) => Promise<Response>;
  updateLeadCertificacao: (request: Request) => Promise<Response>;
  getNormas: (request: Request) => Promise<Response>;
}

const leadCertificacaoProviderMapping: Record<string, () => Promise<LeadCertificacaoProvider>> = {
  mock: () => import('@/app/api/mock/lead-certificacao').then((mod) => mod.default as LeadCertificacaoProvider),
  onc: () => import('@/app/api/onc/lead-certificacao').then((mod) => mod.default as LeadCertificacaoProvider)
};

export async function leadCertificacaoProvider() {
  return await leadCertificacaoProviderMapping[LEAD_CERTIFICACAO_PROVIDER]();
}
