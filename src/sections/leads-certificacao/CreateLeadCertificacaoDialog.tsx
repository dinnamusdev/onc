'use client';

import { useEffect, useState } from 'react';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @icons
import { IconX } from '@tabler/icons-react';

// @project
import { createLead } from '@/utils/api/lead';
import { emailSchema } from '@/utils/validation-schema/common';
import { formatPhone } from '@/utils/format';
import { openSnackbar } from '@/states/snackbar';

// @types
import { LeadFormData } from '@/types/lead';
import { SnackbarProps } from '@/types/snackbar';

/***************************  TYPES  ***************************/

interface CreateLeadCertificacaoDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const emptyValues: LeadFormData = {
  tipoProposta: 'certificacao',
  nomeContato: '',
  empresa: '',
  setor: 'privado',
  cargo: '',
  email: '',
  telefone: '',
  whatsapp: '',
  comoPodemosAjudar: '',
  aceitaPoliticaPrivacidade: true,
  isAtivo: true
};

/***************************  LEAD CERTIFICACAO - CREATE DIALOG  ***************************/
// Cria uma nova Lead já fixada como tipoProposta = "certificacao". Os dados complementares
// de certificação (normas, certificados, etc.) são preenchidos depois, via o botão
// "Gerenciar certificação" na listagem.

export default function CreateLeadCertificacaoDialog({ open, onClose, onCreated }: CreateLeadCertificacaoDialogProps) {
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<LeadFormData>({ defaultValues: emptyValues });

  useEffect(() => {
    if (!open) return;
    setSubmitError('');
    reset(emptyValues);
  }, [open, reset]);

  const requiredField = { required: 'Campo obrigatório' };

  const handleClose = () => {
    setSubmitError('');
    onClose();
  };

  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('telefone', formatPhone(event.target.value), { shouldDirty: true, shouldValidate: true });
  };

  const handleWhatsappChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('whatsapp', formatPhone(event.target.value), { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit: SubmitHandler<LeadFormData> = async (formData) => {
    setSubmitError('');
    setIsSubmitting(true);

    const payload: LeadFormData = { ...formData, tipoProposta: 'certificacao' };
    const { error } = await createLead(payload);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error || 'Não foi possível criar a lead de certificação.');
      return;
    }

    openSnackbar({
      open: true,
      message: 'Lead de certificação criada com sucesso!',
      variant: 'alert',
      severity: 'success',
      alert: { color: 'success' }
    } as SnackbarProps);

    onCreated?.();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2.5 } }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3, pb: 2.5 }}>
        <Box>
          <DialogTitle sx={{ p: 0, fontSize: 22, lineHeight: 1.3, fontWeight: 600, color: 'text.primary' }}>
            Nova Lead de Certificação
          </DialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
            Cadastre manualmente uma solicitação de proposta de certificação.
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ width: 44, height: 44, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, flexShrink: 0 }}
        >
          <IconX size={19} />
        </IconButton>
      </Stack>

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Setor *</InputLabel>
              <FormControl fullWidth error={Boolean(errors.setor)}>
                <Select {...register('setor', requiredField)} defaultValue="privado">
                  <MenuItem value="privado">Setor Privado</MenuItem>
                  <MenuItem value="publico">Setor Público</MenuItem>
                </Select>
                {errors.setor && <FormHelperText>{errors.setor.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Nome do Contato *</InputLabel>
              <TextField
                {...register('nomeContato', requiredField)}
                fullWidth
                size="small"
                error={Boolean(errors.nomeContato)}
                helperText={errors.nomeContato?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Cargo *</InputLabel>
              <TextField
                {...register('cargo', requiredField)}
                fullWidth
                size="small"
                error={Boolean(errors.cargo)}
                helperText={errors.cargo?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Empresa *</InputLabel>
              <TextField
                {...register('empresa', requiredField)}
                fullWidth
                size="small"
                error={Boolean(errors.empresa)}
                helperText={errors.empresa?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>E-mail *</InputLabel>
              <TextField
                {...register('email', emailSchema)}
                fullWidth
                size="small"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Telefone *</InputLabel>
              <TextField
                {...register('telefone', requiredField)}
                placeholder="(99) 99999-9999"
                fullWidth
                size="small"
                error={Boolean(errors.telefone)}
                helperText={errors.telefone?.message}
                onChange={handleTelefoneChange}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>WhatsApp *</InputLabel>
              <TextField
                {...register('whatsapp', requiredField)}
                placeholder="(99) 99999-9999"
                fullWidth
                size="small"
                error={Boolean(errors.whatsapp)}
                helperText={errors.whatsapp?.message}
                onChange={handleWhatsappChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Como podemos te ajudar? *</InputLabel>
              <TextField
                {...register('comoPodemosAjudar', requiredField)}
                fullWidth
                multiline
                rows={3}
                size="small"
                error={Boolean(errors.comoPodemosAjudar)}
                helperText={errors.comoPodemosAjudar?.message}
              />
            </Grid>
          </Grid>

          {submitError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {submitError}
            </Typography>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting} endIcon={isSubmitting && <CircularProgress color="inherit" size={16} />}>
            Criar lead
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
