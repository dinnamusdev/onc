'use client';

// @mui
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// @third-party
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';

// @types
import { CertificacaoStep2, CertificacaoStep1, CertificacaoStep3, CertificacaoStep4, CertificacaoStep5, CertificacaoStep6 } from '@/types/lead';

/***************************  STEP 2 - NORMAS  ***************************/

interface Step2NormasProps {
  register: UseFormRegister<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  errors: FieldErrors<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  watch: UseFormWatch<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  setValue: UseFormSetValue<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
}

const normasList = [
  'ISO 9001',
  'ISO 14001',
  'ISO 45001',
  'ISO/IEC 27001',
  'ISO/IEC 20000-1',
  'ISO 37001',
  'ISO 50001',
  'ISO 22000',
  'ISO/IEC 27701',
  'ISO 37301',
  'PRÓ-GESTÃO RPPS',
  'SELO ONC',
  'Lixo Zero',
  'Outra'
];

export default function Step2Normas({ register, errors, watch, setValue }: Step2NormasProps) {
  const watchedNormas = watch('normasSelecionadas') || [];
  const watchedOutra = watch('outraNorma');

  const isOutraSelected = watchedNormas.includes('Outra');

  const handleNormaChange = (norma: string, checked: boolean) => {
    const currentNormas = watchedNormas || [];
    if (checked) {
      const newNormas = [...currentNormas, norma];
      setValue('normasSelecionadas', newNormas, { shouldValidate: true });
    } else {
      const newNormas = currentNormas.filter((n) => n !== norma);
      setValue('normasSelecionadas', newNormas, { shouldValidate: true });
      if (norma === 'Outra') {
        setValue('outraNorma', '');
      }
    }
  };

  return (
    <Stack gap={2}>
      {/* NORMAS */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
        NORMAS
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        Selecione a(s) norma(s) para certificação: *
      </Typography>

      {/* Checkboxes em 3 colunas */}
      <Grid container spacing={1}>
        {normasList.map((norma) => (
          <Grid size={{ xs: 12, sm: 4 }} key={norma}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={watchedNormas.includes(norma)}
                  onChange={(e) => handleNormaChange(norma, e.target.checked)}
                />
              }
              label={norma}
            />
          </Grid>
        ))}
      </Grid>

      {errors.normasSelecionadas && (
        <FormHelperText error>{errors.normasSelecionadas.message}</FormHelperText>
      )}

      {/* Validação oculta para garantir mínimo de 1 norma */}
      <input
        type="hidden"
        {...register('normasSelecionadas', {
          validate: (value) => (value && value.length > 0) || 'Selecione pelo menos uma norma'
        })}
      />

      {/* Campo condicional para "Outra" */}
      {isOutraSelected && (
        <TextField
          {...register('outraNorma', {
            required: 'Descreva a norma',
            maxLength: {
              value: 100,
              message: 'Máximo de 100 caracteres'
            }
          })}
          label="Descreva a norma (máx. 100 caracteres)"
          fullWidth
          size="small"
          error={Boolean(errors.outraNorma)}
          helperText={errors.outraNorma?.message}
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 100 }}
        />
      )}
    </Stack>
  );
}
