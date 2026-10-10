'use client';

import { useEffect, useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

// @tabler
import { IconX } from '@tabler/icons-react';

// @project
import Step1TipoSolicitante from '@/sections/lead/TreinamentoForm/Step1TipoSolicitante';
import Step2Empresa from '@/sections/lead/TreinamentoForm/Step2Empresa';
import Step2Participante from '@/sections/lead/TreinamentoForm/Step2Participante';
import Step3Treinamentos from '@/sections/lead/TreinamentoForm/Step3Treinamentos';
import { createLead, updateLead } from '@/utils/api/lead';
import {
  createLeadTreinamento,
  getLeadTreinamentoByLeadId,
  updateLeadTreinamento
} from '@/utils/api/leadTreinamento';
import { openSnackbar } from '@/states/snackbar';

// @types
import { LeadFormData, TreinamentoFormData } from '@/types/lead';
import {
  mapLeadTreinamentoToForm,
  mapTreinamentoFormToCreateDTO,
  mapTreinamentoFormToLeadForm,
  mapTreinamentoFormToUpdateDTO
} from '@/types/leadTreinamento';
import { EnumSetorEmpresa, enumToSetor } from '@/types/lead';
import { SnackbarProps } from '@/types/snackbar';

interface ManageLeadTreinamentoDialogProps {
  open: boolean;
  onClose: () => void;
  lead?: {
    id: number;
    nomeContato: string;
    empresa: string;
    setor: EnumSetorEmpresa;
    cargo: string;
    email: string;
    telefone: string;
    whatsapp: string;
    isAtivo: boolean;
    isAceitaPoliticaPrivacidade: boolean;
  } | null;
  onSaved?: () => void;
}

const STEPS = ['Solicitante', 'Empresa / Participante', 'Treinamentos e consentimentos'];

function emptyForm(lead?: ManageLeadTreinamentoDialogProps['lead']): TreinamentoFormData {
  return {
    paraQuem: 'empresa',
    ondeNosConheceu: '',
    nomeContato: lead?.nomeContato ?? '',
    cargo: lead?.cargo ?? '',
    email: lead?.email ?? '',
    dataNascimento: '',
    telefone: lead?.telefone ?? '',
    whatsapp: lead?.whatsapp ?? '',
    empresa: {
      cnpj: '',
      website: '',
      razaoSocial: lead?.empresa ?? '',
      setorEmpresa: lead ? enumToSetor(lead.setor) : 'privado',
      emailEmpresa: '',
      telefoneEmpresa: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade: '',
      estado: 'SP'
    },
    participante: {
      nomeCompleto: '',
      cpf: '',
      email: '',
      dataNascimento: '',
      telefone: '',
      whatsapp: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade: '',
      estado: 'SP',
      empresaOndeTrabalha: '',
      cargo: ''
    },
    treinamentos: [{ normaId: 1, tipoTreinamentoId: 1, totalParticipantes: 1, formatoId: 1, dataPrevista: '' }],
    aceitaTermos: false,
    aceitaPoliticaPrivacidade: false
  };
}

function preserveLeadState(form: LeadFormData, lead: NonNullable<ManageLeadTreinamentoDialogProps['lead']>): LeadFormData {
  return {
    ...form,
    aceitaPoliticaPrivacidade: lead.isAceitaPoliticaPrivacidade,
    isAtivo: lead.isAtivo
  };
}

function validateTrainingRows(form: TreinamentoFormData): boolean {
  return (
    form.treinamentos.length > 0 &&
    form.treinamentos.every(
      (item) =>
        item.normaId !== undefined &&
        item.tipoTreinamentoId !== undefined &&
        Number(item.totalParticipantes) >= 1 &&
        Number(item.totalParticipantes) <= 999 &&
        Number(item.formatoId) > 0 &&
        !!item.dataPrevista
    )
  );
}

export default function ManageLeadTreinamentoDialog({
  open,
  onClose,
  lead = null,
  onSaved
}: ManageLeadTreinamentoDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingId, setExistingId] = useState<number | null>(null);
  const [createdLeadId, setCreatedLeadId] = useState<number | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState: { errors }
  } = useForm<TreinamentoFormData>({ defaultValues: emptyForm(lead) });

  const paraQuem = watch('paraQuem');

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    setSubmitError('');
    setExistingId(null);
    setCreatedLeadId(null);
    reset(emptyForm(lead ?? undefined));
    if (!lead) return;

    let cancelled = false;
    setIsLoading(true);
    getLeadTreinamentoByLeadId(lead.id).then(({ data, error }) => {
      if (cancelled) return;
      setIsLoading(false);
      if (error) {
        setSubmitError(error);
        return;
      }
      if (data) {
        setExistingId(data.id);
        reset(mapLeadTreinamentoToForm(data));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, lead, reset]);

  const validateStep = async (step: number) => {
    if (step === 0) {
      return trigger(['paraQuem', 'nomeContato', 'cargo', 'email', 'telefone']);
    }
    if (step === 1) {
      const fields =
        paraQuem === 'empresa'
          ? ([
              'empresa.cnpj',
              'empresa.razaoSocial',
              'empresa.setorEmpresa',
              'empresa.emailEmpresa',
              'empresa.telefoneEmpresa',
              'empresa.endereco',
              'empresa.numero',
              'empresa.bairro',
              'empresa.cep',
              'empresa.cidade',
              'empresa.estado'
            ] as const)
          : ([
              'participante.nomeCompleto',
              'participante.cpf',
              'participante.email',
              'participante.dataNascimento',
              'participante.telefone',
              'participante.endereco',
              'participante.numero',
              'participante.bairro',
              'participante.cep',
              'participante.cidade',
              'participante.estado'
            ] as const);
      return trigger(fields);
    }

    const validRows = validateTrainingRows(watch());
    const consentValid = await trigger(['aceitaTermos', 'aceitaPoliticaPrivacidade']);
    if (!validRows) setSubmitError('Preencha os dados de ao menos um treinamento antes de salvar.');
    else if (!consentValid || !watch('aceitaTermos') || !watch('aceitaPoliticaPrivacidade')) {
      setSubmitError('Confirme os termos e a política de privacidade para salvar.');
    }
    return validRows && consentValid && watch('aceitaTermos') && watch('aceitaPoliticaPrivacidade');
  };

  const handleNext = async () => {
    setSubmitError('');
    if (await validateStep(activeStep)) setActiveStep((step) => Math.min(step + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setSubmitError('');
    setActiveStep((step) => Math.max(step - 1, 0));
  };

  const onSubmit: SubmitHandler<TreinamentoFormData> = async (formData) => {
    setSubmitError('');
    setIsSubmitting(true);

    let targetLeadId = lead?.id ?? createdLeadId;
    if (!targetLeadId) {
      const { data, error } = await createLead(mapTreinamentoFormToLeadForm(formData));
      if (error || !data) {
        setIsSubmitting(false);
        setSubmitError(error || 'Não foi possível criar o lead de treinamento.');
        return;
      }
      targetLeadId = data.id;
      setCreatedLeadId(data.id);
    } else if (lead) {
      const { error } = await updateLead(targetLeadId, preserveLeadState(mapTreinamentoFormToLeadForm(formData), lead));
      if (error) {
        setIsSubmitting(false);
        setSubmitError(error);
        return;
      }
    }

    const { error } = existingId
      ? await updateLeadTreinamento(targetLeadId, mapTreinamentoFormToUpdateDTO(formData))
      : await createLeadTreinamento(mapTreinamentoFormToCreateDTO(targetLeadId, formData));

    setIsSubmitting(false);
    if (error) {
      setSubmitError(error || 'Não foi possível salvar os dados da solicitação de treinamento.');
      return;
    }

    openSnackbar({
      open: true,
      message: 'Solicitação de treinamento salva com sucesso.',
      variant: 'alert',
      severity: 'success',
      alert: { color: 'success' }
    } as SnackbarProps);
    onSaved?.();
    onClose();
  };

  const handleSave = async () => {
    setSubmitError('');
    if (!(await validateStep(2))) return;
    await handleSubmit(onSubmit)();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setSubmitError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2.5 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Stack>
          <Typography variant="h6">{lead ? 'Gerenciar solicitação de treinamento' : 'Novo lead de treinamento'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {lead ? `Lead de ${lead.nomeContato}.` : 'Preencha os dados do lead e da solicitação.'}
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
          <IconX size={19} />
        </IconButton>
      </DialogTitle>

      {isLoading ? (
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </DialogContent>
      ) : (
        <form onSubmit={(event) => event.preventDefault()}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="primary">
                Etapa {activeStep + 1} de {STEPS.length}: {STEPS[activeStep]}
              </Typography>

              {activeStep === 0 && (
                <Step1TipoSolicitante register={register} errors={errors} watch={watch} control={control} />
              )}
              {activeStep === 1 && paraQuem === 'empresa' && (
                <Step2Empresa register={register} errors={errors} watch={watch} control={control} />
              )}
              {activeStep === 1 && paraQuem === 'pessoa_fisica' && (
                <Step2Participante register={register} errors={errors} watch={watch} control={control} />
              )}
              {activeStep === 2 && (
                <>
                  <Step3Treinamentos register={register} errors={errors} watch={watch} control={control} />
                  <Card variant="outlined">
                    <CardContent>
                      <Stack>
                        <Controller
                          name="aceitaTermos"
                          control={control}
                          rules={{ validate: (value) => value || 'É necessário confirmar os termos.' }}
                          render={({ field }) => (
                            <FormControlLabel
                              control={<Checkbox checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
                              label="Declaro que as informações fornecidas são verídicas e atualizadas."
                            />
                          )}
                        />
                        {errors.aceitaTermos && (
                          <Typography variant="caption" color="error">
                            {errors.aceitaTermos.message}
                          </Typography>
                        )}
                        <Controller
                          name="aceitaPoliticaPrivacidade"
                          control={control}
                          rules={{ validate: (value) => value || 'É necessário aceitar a política de privacidade.' }}
                          render={({ field }) => (
                            <FormControlLabel
                              control={<Checkbox checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
                              label="Li e estou de acordo com a Política de Privacidade."
                            />
                          )}
                        />
                        {errors.aceitaPoliticaPrivacidade && (
                          <Typography variant="caption" color="error">
                            {errors.aceitaPoliticaPrivacidade.message}
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </>
              )}

              {submitError && (
                <Typography role="alert" variant="body2" color="error">
                  {submitError}
                </Typography>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
            <Button variant="outlined" onClick={activeStep === 0 ? handleClose : handleBack} disabled={isSubmitting}>
              {activeStep === 0 ? 'Cancelar' : 'Anterior'}
            </Button>
            {activeStep < STEPS.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress color="inherit" size={16} /> : undefined}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar solicitação'}
              </Button>
            )}
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
