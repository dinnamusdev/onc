'use client';

// @mui
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
import Button from '@mui/material/Button';

// @third-party
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';

// @types
import { CertificacaoStep1, Certificado, CertificacaoStep2, CertificacaoStep3, CertificacaoStep4, CertificacaoStep5, CertificacaoStep6 } from '@/types/lead';

// @project
import { formatPhone, formatDate } from '@/utils/format';

/***************************  STEP 1 - TIPO SOLICITANTE  ***************************/

interface Step1TipoSolicitanteProps {
  register: UseFormRegister<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  errors: FieldErrors<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  watch: UseFormWatch<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  setValue: UseFormSetValue<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  preFilledData?: Partial<CertificacaoStep1>;
}

export default function Step1TipoSolicitante({ register, errors, watch, setValue, preFilledData }: Step1TipoSolicitanteProps) {
  const watchedTipoCertificacao = watch('tipoCertificacao');
  const watchedCertificados = watch('certificados') || [];

  const requiredField = { required: 'Campo obrigatório' };

  // Handle phone mask
  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(event.target.value);
    setValue('telefone', formatted, { shouldDirty: true, shouldValidate: true });
  };

  // Handle whatsapp mask
  const handleWhatsappChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(event.target.value);
    setValue('whatsapp', formatted, { shouldDirty: true, shouldValidate: true });
  };

  // Handle date mask
  const handleDataNascimentoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(event.target.value);
    setValue('dataNascimento', formatted, { shouldDirty: true, shouldValidate: true });
  };

  // Handle date mask for certificate validity
  const handleValidadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(event.target.value);
    setValue(
      'certificados',
      watchedCertificados.map((cert: Certificado, i: number) =>
        i === watchedCertificados.length - 1 ? { ...cert, validade: formatted } : cert
      ),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  // Add certificate
  const handleAddCertificado = () => {
    const currentCertificados = watchedCertificados || [];
    setValue('certificados', [...currentCertificados, { numero: '', validade: '' }]);
  };

  // Remove certificate
  const handleRemoveCertificado = (index: number) => {
    const currentCertificados = watchedCertificados || [];
    setValue(
      'certificados',
      currentCertificados.filter((_: Certificado, i: number) => i !== index)
    );
  };

  // Update certificate field
  const handleCertificadoChange = (index: number, field: 'numero' | 'validade', value: string) => {
    const currentCertificados = watchedCertificados || [];
    const updated = [...currentCertificados];
    updated[index] = { ...updated[index], [field]: value };
    setValue('certificados', updated);
  };

  return (
    <Stack gap={2}>
      {/* TIPO DA SOLICITAÇÃO */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
        TIPO DA SOLICITAÇÃO
      </Typography>

      {/* Tipo de Certificação */}
      <FormControl fullWidth error={Boolean(errors.tipoCertificacao)} size="small">
        <InputLabel shrink>Tipo de Certificação *</InputLabel>
        <Select {...register('tipoCertificacao', requiredField)} label="Tipo de Certificação *" defaultValue="inicial" notched>
          <MenuItem value="inicial">Certificação Inicial</MenuItem>
          <MenuItem value="transferencia">Transferência de Organismo</MenuItem>
        </Select>
        {errors.tipoCertificacao && <FormHelperText>{errors.tipoCertificacao.message}</FormHelperText>}
      </FormControl>

      {/* Campos condicionais para Transferência de Organismo */}
      {watchedTipoCertificacao === 'transferencia' && (
        <Box>
          {watchedCertificados.map((cert: Certificado, index: number) => (
            <Grid container spacing={1.5} key={index} sx={{ mb: 1 }}>
              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  value={cert.numero || ''}
                  onChange={(e) => handleCertificadoChange(index, 'numero', e.target.value)}
                  label="Número do Certificado *"
                  fullWidth
                  size="small"
                  error={Boolean(errors.certificados?.[index]?.numero)}
                  helperText={errors.certificados?.[index]?.numero?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  value={cert.validade || ''}
                  onChange={(e) => handleCertificadoChange(index, 'validade', e.target.value)}
                  label="Validade *"
                  placeholder="DD/MM/AAAA"
                  fullWidth
                  size="small"
                  error={Boolean(errors.certificados?.[index]?.validade)}
                  helperText={errors.certificados?.[index]?.validade?.message}
                  InputLabelProps={{ shrink: true }}
                  onChangeCapture={handleValidadeChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                {index === 0 ? (
                  <Button variant="outlined" size="small" fullWidth onClick={handleAddCertificado} sx={{ height: '40px' }}>
                    + Adicionar
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    fullWidth
                    onClick={() => handleRemoveCertificado(index)}
                    sx={{ height: '40px' }}
                  >
                    Remover
                  </Button>
                )}
              </Grid>
            </Grid>
          ))}
        </Box>
      )}

      {/* Onde nos conheceu */}
      <TextField
        {...register('ondeNosConheceu')}
        label="Conte-nos onde nos conheceu"
        fullWidth
        size="small"
        InputLabelProps={{ shrink: true }}
      />

      {/* DADOS DO SOLICITANTE */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem', mt: 1 }}>
        DADOS DO SOLICITANTE
      </Typography>

      {/* Nome do Contato | Cargo */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('nomeContato', requiredField)}
            label="Nome do Contato *"
            fullWidth
            size="small"
            error={Boolean(errors.nomeContato)}
            helperText={errors.nomeContato?.message}
            InputLabelProps={{ shrink: true }}
            defaultValue={preFilledData?.nomeContato}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('cargo', requiredField)}
            label="Cargo *"
            fullWidth
            size="small"
            error={Boolean(errors.cargo)}
            helperText={errors.cargo?.message}
            InputLabelProps={{ shrink: true }}
            defaultValue={preFilledData?.cargo}
          />
        </Grid>
      </Grid>

      {/* Empresa */}
      <TextField
        {...register('empresa', requiredField)}
        label="Empresa *"
        fullWidth
        size="small"
        error={Boolean(errors.empresa)}
        helperText={errors.empresa?.message}
        InputLabelProps={{ shrink: true }}
        defaultValue={preFilledData?.empresa}
      />

      {/* E-mail | Data de Nascimento */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('email', {
              required: 'Campo obrigatório',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
            })}
            label="E-mail *"
            fullWidth
            size="small"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            InputLabelProps={{ shrink: true }}
            defaultValue={preFilledData?.email}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('dataNascimento')}
            label="Data de Nascimento"
            placeholder="DD/MM/AAAA"
            fullWidth
            size="small"
            error={Boolean(errors.dataNascimento)}
            helperText={errors.dataNascimento?.message}
            InputLabelProps={{ shrink: true }}
            onChangeCapture={handleDataNascimentoChange}
            defaultValue={preFilledData?.dataNascimento}
          />
        </Grid>
      </Grid>

      {/* Telefone | WhatsApp */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
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
            defaultValue={preFilledData?.telefone}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register('whatsapp')}
            label="WhatsApp"
            placeholder="(99) 99999-9999"
            fullWidth
            size="small"
            error={Boolean(errors.whatsapp)}
            helperText={errors.whatsapp?.message}
            InputLabelProps={{ shrink: true }}
            onChange={handleWhatsappChange}
            defaultValue={preFilledData?.whatsapp}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
