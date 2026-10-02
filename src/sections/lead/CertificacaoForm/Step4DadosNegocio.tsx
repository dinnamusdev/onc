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

// @third-party
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';

// @types
import { CertificacaoStep4, CertificacaoStep1, CertificacaoStep2, CertificacaoStep3, CertificacaoStep5, CertificacaoStep6 } from '@/types/lead';

/***************************  STEP 4 - DADOS DO NEGÓCIO  ***************************/

interface Step4DadosNegocioProps {
  register: UseFormRegister<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  errors: FieldErrors<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  watch: UseFormWatch<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  setValue: UseFormSetValue<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
}

export default function Step4DadosNegocio({ register, errors, watch, setValue }: Step4DadosNegocioProps) {
  const watchedJaCertificada = watch('jaCertificada');
  const watchedTerceirizaProcesso = watch('terceirizaProcesso');

  const requiredField = { required: 'Campo obrigatório' };

  return (
    <Stack gap={2}>
      {/* DADOS DO NEGÓCIO */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
        DADOS DO NEGÓCIO
      </Typography>

      {/* Row 1: Produtos e/ou Serviços */}
      <TextField
        {...register('produtosServicos', requiredField)}
        label="Produtos e/ou Serviços *"
        fullWidth
        multiline
        rows={2}
        size="small"
        error={Boolean(errors.produtosServicos)}
        helperText={errors.produtosServicos?.message}
        InputLabelProps={{ shrink: true }}
      />

      {/* Row 2: Principais processos e operações */}
      <TextField
        {...register('principaisProcessos', requiredField)}
        label="Principais processos e operações *"
        fullWidth
        multiline
        rows={2}
        size="small"
        error={Boolean(errors.principaisProcessos)}
        helperText={errors.principaisProcessos?.message}
        InputLabelProps={{ shrink: true }}
      />

      {/* Row 3: Principais obrigações legais */}
      <TextField
        {...register('principaisObrigacoesLegais')}
        label="Principais obrigações legais"
        fullWidth
        multiline
        rows={2}
        size="small"
        error={Boolean(errors.principaisObrigacoesLegais)}
        helperText={errors.principaisObrigacoesLegais?.message}
        InputLabelProps={{ shrink: true }}
      />

      {/* Row 4: 3 selects lado a lado */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={Boolean(errors.jaCertificada)} size="small">
            <InputLabel shrink>Já certificada em outra(s) norma(s)? *</InputLabel>
            <Select
              {...register('jaCertificada', { required: 'Campo obrigatório' })}
              label="Já certificada em outra(s) norma(s)? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.jaCertificada && <FormHelperText>{errors.jaCertificada.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={Boolean(errors.responssavelProjeto)} size="small">
            <InputLabel shrink>Responsável pelo projeto? *</InputLabel>
            <Select
              {...register('responssavelProjeto', { required: 'Campo obrigatório' })}
              label="Responsável pelo projeto? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.responssavelProjeto && <FormHelperText>{errors.responssavelProjeto.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={Boolean(errors.terceirizaProcesso)} size="small">
            <InputLabel shrink>Terceiriza algum processo? *</InputLabel>
            <Select
              {...register('terceirizaProcesso', { required: 'Campo obrigatório' })}
              label="Terceiriza algum processo? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.terceirizaProcesso && <FormHelperText>{errors.terceirizaProcesso.message}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      {/* Campo condicional: Descrição das normas */}
      {watchedJaCertificada === 'true' && (
        <TextField
          {...register('descricaoCertificacoes', requiredField)}
          label="Descreva a(s) norma(s) *"
          fullWidth
          multiline
          rows={2}
          size="small"
          error={Boolean(errors.descricaoCertificacoes)}
          helperText={errors.descricaoCertificacoes?.message}
          InputLabelProps={{ shrink: true }}
        />
      )}

      {/* Campo condicional: Descrição dos processos terceirizados */}
      {watchedTerceirizaProcesso === 'true' && (
        <TextField
          {...register('processosTerceirizados', requiredField)}
          label="Descreva os processos terceirizados *"
          fullWidth
          multiline
          rows={2}
          size="small"
          error={Boolean(errors.processosTerceirizados)}
          helperText={errors.processosTerceirizados?.message}
          InputLabelProps={{ shrink: true }}
        />
      )}
    </Stack>
  );
}
