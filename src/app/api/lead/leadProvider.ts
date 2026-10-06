// @project
import { LEAD_PROVIDER } from '@/config';

interface LeadProvider {
  getLeads: (request: Request) => Promise<Response>;
  getLeadById: (request: Request) => Promise<Response>;
  getLeadByEmail: (request: Request) => Promise<Response>;
  createLead: (request: Request) => Promise<Response>;
  updateLead: (request: Request) => Promise<Response>;
  deleteLead: (request: Request) => Promise<Response>;
  checkEmailExists: (request: Request) => Promise<Response>;
  checkCNPJExists: (request: Request) => Promise<Response>;
}

const leadProviderMapping: Record<string, () => Promise<LeadProvider>> = {
  mock: () => import('@/app/api/mock/lead').then((mod) => mod.default as LeadProvider),
  onc: () => import('@/app/api/onc/lead').then((mod) => mod.default as LeadProvider)
};

export async function leadProvider() {
  return await leadProviderMapping[LEAD_PROVIDER]();
}
