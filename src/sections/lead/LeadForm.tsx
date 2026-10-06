'use client';

// @next
import { useRouter } from 'next/navigation';

import { useState, useTransition } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { createLead, checkEmailExists } from '@/utils/api/lead';
import { emailSchema } from '@/utils/validation-schema/common';
import { formatPhone } from '@/utils/format';

// @types
import { LeadFormData } from '@/types/lead';

/***************************  LEAD FORM  ***************************/

export default function LeadForm() {
  const router = useRouter();

  const [isProcessing, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState('');
  const [emailAlert, setEmailAlert] = useState<{ show: boolean; hasExistingLead: boolean }>({ show: false, hasExistingLead: false });

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<LeadFormData>({
    defaultValues: {
      tipoProposta: 'certificacao',
      nomeContato: '',
      empresa: '',
      setor: 'privado',
      cargo: '',
      email: '',
      telefone: '',
      whatsapp: '',
      comoPodemosAjudar: '',
      aceitaPoliticaPrivacidade: false
    }
  });

  const requiredField = { required: 'Campo obrigatório' };

  // Handle phone mask
  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(event.target.value);
    setValue('telefone', formatted, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  // Handle whatsapp mask
  const handleWhatsappChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(event.target.value);
    setValue('whatsapp', formatted, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const watchedEmail = watch('email');

  // Check email existence when email changes
  const handleEmailBlur = async () => {
    if (watchedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail)) {
      const { data, error } = await checkEmailExists(watchedEmail);
      if (!error && data?.exists) {
        setEmailAlert({ show: true, hasExistingLead: data.hasExistingLead || false });
      }
    }
  };

  // Handle form submission
  const onSubmit: SubmitHandler<LeadFormData> = (formData) => {
    setSubmitError('');
    setEmailAlert({ show: false, hasExistingLead: false });

    startTransition(async () => {
      const { error } = await createLead(formData);
      if (error) {
        setSubmitError(error || 'Algo deu errado ao enviar a solicitação');
        return;
      }

      // Redirect to thank you page
      router.push('/solicitar-proposta/obrigado');
    });
  };

  const handleAlertAction = (action: 'new' | 'commercial') => {
    if (action === 'new') {
      setEmailAlert({ show: false, hasExistingLead: false });
    } else {
      // Contact commercial - redirect to thank you page with commercial flag
      router.push('/solicitar-proposta/obrigado?commercial=true');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 1 }}>
          Solicitação de Proposta
        </Typography>

        {/* DADOS DO CONTATO */}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
          DADOS DO CONTATO
        </Typography>

        {/* Row 1: Tipo de Proposta | Nome do Contato */}
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={Boolean(errors.tipoProposta)} size="small">
              <InputLabel shrink>Tipo de Proposta *</InputLabel>
              <Select
                {...register('tipoProposta', requiredField)}
                label="Tipo de Proposta *"
                defaultValue="certificacao"
                notched
              >
                <MenuItem value="certificacao">Certificação</MenuItem>
                <MenuItem value="treinamento">Treinamento</MenuItem>
              </Select>
              {errors.tipoProposta && <FormHelperText>{errors.tipoProposta.message}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('nomeContato', requiredField)}
              label="Nome do Contato *"
              fullWidth
              size="small"
              error={Boolean(errors.nomeContato)}
              helperText={errors.nomeContato?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Row 2: Empresa | Setor | Cargo */}
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              {...register('empresa', requiredField)}
              label="Empresa *"
              fullWidth
              size="small"
              error={Boolean(errors.empresa)}
              helperText={errors.empresa?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth error={Boolean(errors.setor)} size="small">
              <InputLabel shrink>Setor *</InputLabel>
              <Select
                {...register('setor', requiredField)}
                label="Setor *"
                defaultValue="privado"
                notched
              >
                <MenuItem value="privado">Setor Privado</MenuItem>
                <MenuItem value="publico">Setor Público</MenuItem>
              </Select>
              {errors.setor && <FormHelperText>{errors.setor.message}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              {...register('cargo', requiredField)}
              label="Cargo *"
              fullWidth
              size="small"
              error={Boolean(errors.cargo)}
              helperText={errors.cargo?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Row 3: E-mail | Telefone | WhatsApp */}
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              {...register('email', emailSchema)}
              label="E-mail *"
              fullWidth
              size="small"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              onBlur={handleEmailBlur}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              {...register('telefone', requiredField)}
              label="Telefone *"
              placeholder="(99) 99999-9999"
              fullWidth
              size="small"
              error={Boolean(errors.telefone)}
              helperText={errors.telefone?.message}
              InputLabelProps={{ shrink: true }}
              onChange={handleTelefoneChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              {...register('whatsapp', requiredField)}
              label="WhatsApp *"
              placeholder="(99) 99999-9999"
              fullWidth
              size="small"
              error={Boolean(errors.whatsapp)}
              helperText={errors.whatsapp?.message}
              InputLabelProps={{ shrink: true }}
              onChange={handleWhatsappChange}
            />
          </Grid>
        </Grid>

        {/* Row 3: Como podemos te ajudar */}
        <Box>
          <TextField
            {...register('comoPodemosAjudar', requiredField)}
            label="Como podemos te ajudar? *"
            placeholder="Descreva em poucas palavras a sua solicitação"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.comoPodemosAjudar)}
            helperText={errors.comoPodemosAjudar?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Email Alert */}
        {emailAlert.show && (
          <Alert severity="warning" variant="filled">
            Você já possui um cadastro no ONC.
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button size="small" variant="outlined" color="inherit" onClick={() => handleAlertAction('new')}>
                Iniciar nova solicitação
              </Button>
              <Button size="small" variant="outlined" color="inherit" onClick={() => handleAlertAction('commercial')}>
                Solicitar contato do Comercial
              </Button>
            </Stack>
          </Alert>
        )}

        {/* reCAPTCHA placeholder e Privacy Policy Checkbox */}
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <input
                type="checkbox"
                {...register('aceitaPoliticaPrivacidade', { required: 'Você deve aceitar a política de privacidade' })}
                style={{ marginTop: 4 }}
              />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                Li e estou de acordo com a{' '}
                <Link href="https://www.onccertificacao.com.br/politica-de-privacidade/" target="_blank" rel="noopener">
                  Política de Privacidade
                </Link>
              </Typography>
            </Box>
            {errors.aceitaPoliticaPrivacidade && (
              <FormHelperText error>{errors.aceitaPoliticaPrivacidade.message}</FormHelperText>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                [reCAPTCHA — Não sou um robô]
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              disabled={isProcessing}
              endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
              sx={{ mt: 1, py: 1 }}
              size="small"
            >
              Enviar Solicitação
            </Button>
          </Grid>
        </Grid>

        {/* Submit Error */}
        {submitError && (
          <Alert sx={{ mt: 1 }} severity="error" variant="filled" icon={false}>
            {submitError}
          </Alert>
        )}
      </Stack>
    </form>
  );
}
