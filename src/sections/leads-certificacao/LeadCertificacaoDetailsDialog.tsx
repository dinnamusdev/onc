'use client';

import { ReactNode, useEffect, useState } from 'react';

// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @icons
import { IconX } from '@tabler/icons-react';

// @project
import { getLeadCertificacaoByLeadId } from '@/utils/api/leadCertificacao';

// @types
import { EnumSetorEmpresa } from '@/types/lead';
import { EnumTipoCertificacao, LeadCertificacaoDTO } from '@/types/leadCertificacao';

/***************************  TYPES  ***************************/

export interface LeadCertificacaoDetails {
  id: number;
  nomeContato: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  whatsapp: string;
  comoPodemosAjudar: string;
  setor: EnumSetorEmpresa;
  isAtivo: boolean;
  hasCertificacao: boolean;
}

interface LeadCertificacaoDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  lead: LeadCertificacaoDetails | null;
}

/***************************  HELPERS  ***************************/

const setorLabel: Record<EnumSetorEmpresa, string> = {
  [EnumSetorEmpresa.Privado]: 'Setor Privado',
  [EnumSetorEmpresa.Publico]: 'Setor Público'
};

const tipoCertificacaoLabel: Record<EnumTipoCertificacao, string> = {
  [EnumTipoCertificacao.Inicial]: 'Certificação Inicial',
  [EnumTipoCertificacao.Transferencia]: 'Transferência de Certificação'
};

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

/***************************  LEAD CERTIFICACAO - DETAILS DIALOG  ***************************/

export default function LeadCertificacaoDetailsDialog({ open, onClose, lead }: LeadCertificacaoDetailsDialogProps) {
  const [certificacao, setCertificacao] = useState<LeadCertificacaoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !lead) {
      setCertificacao(null);
      return;
    }

    setIsLoading(true);
    getLeadCertificacaoByLeadId(lead.id).then(({ data }) => {
      setCertificacao(data ?? null);
      setIsLoading(false);
    });
  }, [open, lead]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2.5 } }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3, pb: 2.5 }}>
        <Box>
          <DialogTitle sx={{ p: 0, fontSize: 22, lineHeight: 1.3, fontWeight: 600, color: 'text.primary' }}>
            Detalhes da Lead de Certificação
          </DialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
            Solicitação de proposta de certificação.
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{ width: 44, height: 44, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, flexShrink: 0 }}
        >
          <IconX size={19} />
        </IconButton>
      </Stack>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {lead && (
          <Stack sx={{ gap: 2.5 }}>
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
              <Chip label={lead.isAtivo ? 'Ativo' : 'Inativo'} size="small" color={lead.isAtivo ? 'success' : 'error'} />
              <Chip
                label={lead.hasCertificacao ? 'Dados de certificação enviados' : 'Dados de certificação pendentes'}
                size="small"
                color={lead.hasCertificacao ? 'info' : 'warning'}
                variant="outlined"
              />
            </Stack>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Nome do Contato" value={lead.nomeContato} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Cargo" value={lead.cargo} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Empresa" value={lead.empresa} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Setor" value={setorLabel[lead.setor]} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="E-mail" value={lead.email} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="Telefone" value={lead.telefone} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailField label="WhatsApp" value={lead.whatsapp} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailField label="Como podemos te ajudar?" value={lead.comoPodemosAjudar} />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle2">Dados de Certificação</Typography>

            {isLoading ? (
              <Stack sx={{ alignItems: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Stack>
            ) : certificacao ? (
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Tipo de Certificação" value={tipoCertificacaoLabel[certificacao.tipoCertificacao]} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailField label="Onde nos conheceu" value={certificacao.ondeNosConheceu} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <DetailField label="Normas" value={certificacao.normas?.map((norma) => norma.sigla).join(', ')} />
                </Grid>

                {certificacao.tipoCertificacao === EnumTipoCertificacao.Inicial ? (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DetailField label="Número do Certificado" value={certificacao.numeroCertificado} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DetailField label="Validade do Certificado" value={certificacao.validadeCertificado?.slice(0, 10)} />
                    </Grid>
                  </>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                      Certificados para transferência
                    </Typography>
                    <Stack sx={{ gap: 0.5, mt: 0.5 }}>
                      {(certificacao.certificadosTransferencias ?? []).map((transferencia) => (
                        <Typography key={transferencia.id} variant="body2">
                          {transferencia.numeroCertificado} — validade {transferencia.validadeCertificado?.slice(0, 10) || '—'}
                        </Typography>
                      ))}
                      {(certificacao.certificadosTransferencias ?? []).length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Nenhum certificado informado.
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Esta lead ainda não possui dados complementares de certificação.
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
