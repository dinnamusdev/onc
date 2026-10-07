// @project
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

// @types
import { LeadCertificacaoCreateDTO, LeadCertificacaoDTO, LeadCertificacaoUpdateDTO, Norma } from '@/types/leadCertificacao';

/***************************  LEAD CERTIFICACAO API FUNCTIONS  ***************************/

export async function getLeadCertificacaoByLeadId(leadId: number | string) {
  return attempt<LeadCertificacaoDTO | null>(axiosServices.get(`/api/lead-certificacao/${leadId}`));
}

export async function createLeadCertificacao(data: LeadCertificacaoCreateDTO) {
  return attempt<LeadCertificacaoDTO>(axiosServices.post('/api/lead-certificacao', data));
}

export async function updateLeadCertificacao(leadId: number | string, data: LeadCertificacaoUpdateDTO) {
  return attempt<LeadCertificacaoDTO>(axiosServices.put(`/api/lead-certificacao/${leadId}`, data));
}

export async function getNormas() {
  return attempt<Norma[]>(axiosServices.get('/api/lead-certificacao/normas'));
}
