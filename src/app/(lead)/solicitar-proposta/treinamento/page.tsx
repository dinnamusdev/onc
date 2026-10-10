import { Metadata } from 'next';

// @project
import TreinamentoForm from '@/sections/lead/TreinamentoForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Solicitação de Treinamento',
  description: 'Solicite um treinamento da ONC Certificação'
};

export default async function TreinamentoPage({ searchParams }: { searchParams: Promise<{ leadId?: string }> }) {
  const { leadId } = await searchParams;
  return <TreinamentoForm leadId={leadId} />;
}
