// @next
import dynamic from 'next/dynamic';

// @project
const LeadsCertificacaoPage = dynamic(() => import('@/views/admin/leads-certificacao'));

/***************************  LEADS DE CERTIFICACAO PAGE  ***************************/

export default function LeadsCertificacao() {
  return <LeadsCertificacaoPage />;
}
