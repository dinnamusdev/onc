// @next
import dynamic from 'next/dynamic';

// @types
import { EnumTipoPropostaLead } from '@/types/lead';

// @project
const LeadsPage = dynamic(() => import('@/views/admin/leads'));

export default function LeadsTreinamento() {
  return <LeadsPage tipoProposta={EnumTipoPropostaLead.Treinamento} />;
}
