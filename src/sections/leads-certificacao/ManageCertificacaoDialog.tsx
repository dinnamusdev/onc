'use client';

import { useEffect, useState } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
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
import { Controller, useFieldArray, useForm, SubmitHandler } from 'react-hook-form';
import useSWR from 'swr';

// @icons
import { IconPlus, IconTrash, IconX } from '@tabler/icons-react';

// @project
import { createLeadCertificacao, getLeadCertificacaoByLeadId, getNormas, updateLeadCertificacao } from '@/utils/api/leadCertificacao';
import { formatPhone } from '@/utils/format';
import { openSnackbar } from '@/states/snackbar';

// @types
import {
  LeadCertificacaoFormData,
  emptyLeadCertificacaoFormData,
  mapLeadCertificacaoDTOToFormData,
  mapLeadCertificacaoFormDataToCreateDTO,
  mapLeadCertificacaoFormDataToUpdateDTO
} from '@/types/leadCertificacao';
import { SnackbarProps } from '@/types/snackbar';

/***************************  TYPES  ***************************/

interface ManageCertificacaoDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: number | null;
  leadNomeContato?: string;
  onSaved?: () => void;
}

/***************************  LEAD CERTIFICACAO - MANAGE DIALOG  ***************************/
// Permite criar/editar os dados complementares de certificação (LeadCertificacoes) de uma
// Lead específica. Como o backend não expõe listagem/exclusão desse domínio, o fluxo é:
// buscar por leadId (GetLeadCertificacao) -> se existir, PUT; senão, POST.

export default function ManageCertificacaoDialog({ open, onClose, leadId, leadNomeContato, onSaved }: ManageCertificacaoDialogProps) {
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [existingId, setExistingId] = useState<number | null>(null);

  const { data: normas, isLoading: normasLoading } = useSWR(open ? '/api/lead-certificacao/normas' : null, async () => {
    const { data, error } = await getNormas();
    if (error) throw new Error(error);
    return data ?? [];
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<LeadCertificacaoFormData>({ defaultValues: emptyLeadCertificacaoFormData });

  const { fields, append, remove } = useFieldArray({ control, name: 'certificadosTransferencias' });

  const tipoCertificacao = watch('tipoCertificacao');

  useEffect(() => {
    if (!open || !leadId) return;

    setSubmitError('');
    setExistingId(null);
    reset(emptyLeadCertificacaoFormData);
    setIsLoadingExisting(true);

    getLeadCertificacaoByLeadId(leadId).then(({ data, error }) => {
      setIsLoadingExisting(false);
      if (error) {
        setSubmitError(error);
        return;
      }
      if (data) {
        setExistingId(data.id);
        reset(mapLeadCertificacaoDTOToFormData(data));
      }
    });
  }, [open, leadId, reset]);

  const handleClose = () => {
    setSubmitError('');
    onClose();
  };

  const handleTelefoneChange = (field: 'telefone' | 'whatsapp', value: string, onChange: (value: string) => void) => {
    onChange(formatPhone(value));
  };

  const onSubmit: SubmitHandler<LeadCertificacaoFormData> = async (formData) => {
    if (!leadId) return;

    setSubmitError('');
    setIsSubmitting(true);

    const { error } = existingId
      ? await updateLeadCertificacao(leadId, mapLeadCertificacaoFormDataToUpdateDTO(formData))
      : await createLeadCertificacao(mapLeadCertificacaoFormDataToCreateDTO(leadId, formData));

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error || 'Não foi possível salvar os dados de certificação.');
      return;
    }

    openSnackbar({
      open: true,
      message: 'Dados de certificação salvos com sucesso!',
      variant: 'alert',
      severity: 'success',
      alert: { color: 'success' }
    } as SnackbarProps);

    onSaved?.();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2.5 } }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3, pb: 2.5 }}>
        <Box>
          <DialogTitle sx={{ p: 0, fontSize: 22, lineHeight: 1.3, fontWeight: 600, color: 'text.primary' }}>
            Dados de Certificação
          </DialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
            {leadNomeContato ? `Solicitação complementar de ${leadNomeContato}.` : 'Solicitação complementar de certificação.'}
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

      {isLoadingExisting ? (
        <DialogContent sx={{ px: 3, py: 5, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={28} />
        </DialogContent>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 3, py: 2.5 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Tipo de Certificação *</InputLabel>
                <FormControl fullWidth error={Boolean(errors.tipoCertificacao)}>
                  <Select {...register('tipoCertificacao', { required: 'Campo obrigatório' })} defaultValue="inicial">
                    <MenuItem value="inicial">Certificação Inicial</MenuItem>
                    <MenuItem value="transferencia">Transferência de Certificação</MenuItem>
                  </Select>
                  {errors.tipoCertificacao && <FormHelperText>{errors.tipoCertificacao.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Onde nos conheceu?</InputLabel>
                <TextField {...register('ondeNosConheceu')} fullWidth size="small" />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Normas</InputLabel>
                <Controller
                  name="normasIds"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      size="small"
                      loading={normasLoading}
                      options={normas || []}
                      getOptionLabel={(opt) => opt.sigla}
                      isOptionEqualToValue={(opt, val) => opt.id === val.id}
                      value={(normas || []).filter((norma) => field.value.includes(norma.id))}
                      onChange={(_event, selected) => field.onChange(selected.map((norma) => norma.id))}
                      noOptionsText="Nenhuma norma encontrada"
                      renderInput={(params) => <TextField {...params} placeholder="Selecione as normas" />}
                    />
                  )}
                />
              </Grid>

              {tipoCertificacao === 'inicial' && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Número do Certificado</InputLabel>
                    <TextField {...register('numeroCertificado')} fullWidth size="small" />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Validade do Certificado</InputLabel>
                    <TextField {...register('validadeCertificado')} type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} />
                  </Grid>
                </>
              )}

              {tipoCertificacao === 'transferencia' && (
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <InputLabel sx={{ fontSize: 14 }}>Certificados para Transferência</InputLabel>
                    <Button
                      size="small"
                      startIcon={<IconPlus size={16} />}
                      onClick={() => append({ numeroCertificado: '', validadeCertificado: '' })}
                    >
                      Adicionar certificado
                    </Button>
                  </Stack>

                  <Stack sx={{ gap: 1.5 }}>
                    {fields.map((field, index) => (
                      <Stack key={field.id} direction="row" sx={{ gap: 1.5, alignItems: 'flex-start' }}>
                        <TextField
                          {...register(`certificadosTransferencias.${index}.numeroCertificado`, { required: 'Obrigatório' })}
                          label="Número do Certificado"
                          size="small"
                          fullWidth
                          error={Boolean(errors.certificadosTransferencias?.[index]?.numeroCertificado)}
                        />
                        <TextField
                          {...register(`certificadosTransferencias.${index}.validadeCertificado`, { required: 'Obrigatório' })}
                          label="Validade"
                          type="date"
                          size="small"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.certificadosTransferencias?.[index]?.validadeCertificado)}
                        />
                        <IconButton size="small" color="error" onClick={() => remove(index)} sx={{ mt: 0.5 }}>
                          <IconTrash size={18} />
                        </IconButton>
                      </Stack>
                    ))}

                    {fields.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Nenhum certificado adicionado ainda.
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Dados do solicitante (opcional — preenchidos automaticamente a partir da lead quando disponíveis)
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Nome do Contato</InputLabel>
                <TextField {...register('nomeContato')} fullWidth size="small" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Cargo</InputLabel>
                <TextField {...register('cargo')} fullWidth size="small" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Empresa</InputLabel>
                <TextField {...register('empresa')} fullWidth size="small" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>E-mail</InputLabel>
                <TextField {...register('email')} fullWidth size="small" />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Data de Nascimento</InputLabel>
                <TextField {...register('dataNascimento')} type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>Telefone</InputLabel>
                <Controller
                  name="telefone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="(99) 99999-9999"
                      fullWidth
                      size="small"
                      onChange={(e) => handleTelefoneChange('telefone', e.target.value, field.onChange)}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 0.75, fontSize: 14 }}>WhatsApp</InputLabel>
                <Controller
                  name="whatsapp"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="(99) 99999-9999"
                      fullWidth
                      size="small"
                      onChange={(e) => handleTelefoneChange('whatsapp', e.target.value, field.onChange)}
                    />
                  )}
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
              {existingId ? 'Salvar alterações' : 'Salvar dados de certificação'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
