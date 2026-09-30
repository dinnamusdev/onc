// @project
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

// @types
import { LeadFormData, CertificacaoFormData, TreinamentoFormData } from '@/types/lead';

/***************************  LEAD API FUNCTIONS  ***************************/

export async function createLead(data: LeadFormData) {
  return attempt(axiosServices.post('/api/lead', data));
}

export async function createCertificacao(data: CertificacaoFormData) {
  return attempt(axiosServices.post('/api/lead/certificacao', data));
}

export async function createTreinamento(data: TreinamentoFormData) {
  return attempt(axiosServices.post('/api/lead/treinamento', data));
}

export async function checkEmailExists(email: string) {
  return attempt(axiosServices.get(`/api/lead/check-email?email=${encodeURIComponent(email)}`));
}

export async function checkCNPJExists(cnpj: string, normas: number[]) {
  return attempt(axiosServices.post('/api/lead/check-cnpj', { cnpj, normas }));
}
