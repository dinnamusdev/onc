// @project
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

// @types
import {
  LeadTreinamentoCreateDTO,
  LeadTreinamentoDTO,
  LeadTreinamentoUpdateDTO
} from '@/types/leadTreinamento';

export async function getLeadTreinamentos() {
  return attempt<LeadTreinamentoDTO[]>(axiosServices.get('/api/lead-treinamento'));
}

export async function getLeadTreinamentoByLeadId(leadId: number | string) {
  return attempt<LeadTreinamentoDTO | null>(axiosServices.get(`/api/lead-treinamento/${leadId}`));
}

export async function createLeadTreinamento(data: LeadTreinamentoCreateDTO) {
  return attempt<LeadTreinamentoDTO>(axiosServices.post('/api/lead-treinamento', data));
}

export async function updateLeadTreinamento(leadId: number | string, data: LeadTreinamentoUpdateDTO) {
  return attempt<LeadTreinamentoDTO>(axiosServices.put(`/api/lead-treinamento/${leadId}`, data));
}
