'use client';

import { ReactNode } from 'react';

// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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

// @types
import { EnumSetorEmpresa, EnumTipoPropostaLead } from '@/types/lead';

/***************************  TYPES  ***************************/

export interface LeadDetails {
  id: number;
  nomeContato: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  whatsapp: string;
  comoPodemosAjudar: string;
  tipoProposta: EnumTipoPropostaLead;
  setor: EnumSetorEmpresa;
  isAtivo: boolean;
  hasCertificacao: boolean;
}

interface LeadDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  lead: LeadDetails | null;
  showComplementaryStatus?: boolean;
}

/***************************  HELPERS  ***************************/

const tipoPropostaLabel: Record<EnumTipoPropostaLead, string> = {
  [EnumTipoPropostaLead.Certificacao]: 'Certificação',
  [EnumTipoPropostaLead.Treinamento]: 'Treinamento'
};

const setorLabel: Record<EnumSetorEmpresa, string> = {
  [EnumSetorEmpresa.Privado]: 'Setor Privado',
  [EnumSetorEmpresa.Publico]: 'Setor Público'
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

/***************************  LEAD - DETAILS DIALOG  ***************************/

export default function LeadDetailsDialog({ open, onClose, lead, showComplementaryStatus = true }: LeadDetailsDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2.5 }
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: 3,
          pt: 3,
          pb: 2.5
        }}
      >
        <Box>
          <DialogTitle sx={{ p: 0, fontSize: 22, lineHeight: 1.3, fontWeight: 600, color: 'text.primary' }}>
            Detalhes do Lead
          </DialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
            Solicitação de proposta enviada pelo formulário público.
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
              <Chip
                label={lead.isAtivo ? 'Ativo' : 'Inativo'}
                size="small"
                color={lead.isAtivo ? 'success' : 'error'}
              />
              <Chip label={tipoPropostaLabel[lead.tipoProposta]} size="small" color="primary" variant="outlined" />
              {showComplementaryStatus && (
                <Chip
                  label={lead.hasCertificacao ? 'Solicitação complementar enviada' : 'Solicitação complementar pendente'}
                  size="small"
                  color={lead.hasCertificacao ? 'info' : 'warning'}
                  variant="outlined"
                />
              )}
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
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
