// @project
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

// @types
import {
  LeadFormData,
  CertificacaoFormData,
  TreinamentoFormData,
  LeadDTO,
  LeadPagedResult,
  LeadListParams,
  CheckEmailExistsResult,
  CheckCNPJExistsResult
} from '@/types/lead';

/***************************  LEAD API FUNCTIONS  ***************************/

export async function getLeads(params?: LeadListParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.pageSize) queryParams.append('pageSize', String(params.pageSize));
  if (params?.orderBy !== undefined) queryParams.append('orderBy', String(params.orderBy));

  const url = queryParams.toString() ? `/api/lead?${queryParams.toString()}` : '/api/lead';
  return attempt<LeadPagedResult>(axiosServices.get(url));
}

export async function getLeadById(id: number | string) {
  return attempt<LeadDTO>(axiosServices.get(`/api/lead/${id}`));
}

export async function getLeadByEmail(email: string) {
  return attempt<LeadDTO>(axiosServices.get(`/api/lead/by-email?email=${encodeURIComponent(email)}`));
}

export async function createLead(data: LeadFormData) {
  return attempt<LeadDTO>(axiosServices.post('/api/lead', data));
}

export async function updateLead(id: number | string, data: LeadFormData) {
  return attempt<LeadDTO>(axiosServices.put(`/api/lead/${id}`, data));
}

export async function deleteLead(id: number | string) {
  return attempt(axiosServices.delete(`/api/lead/${id}`));
}

export async function createCertificacao(data: CertificacaoFormData) {
  return attempt(axiosServices.post('/api/lead/certificacao', data));
}

export async function createTreinamento(data: TreinamentoFormData) {
  return attempt(axiosServices.post('/api/lead/treinamento', data));
}

export async function checkEmailExists(email: string) {
  return attempt<CheckEmailExistsResult>(axiosServices.get(`/api/lead/check-email?email=${encodeURIComponent(email)}`));
}

export async function checkCNPJExists(cnpj: string, normas: number[]) {
  return attempt<CheckCNPJExistsResult>(axiosServices.post('/api/lead/check-cnpj', { cnpj, normas }));
}
