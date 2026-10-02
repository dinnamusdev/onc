'use client';

import { useState, useEffect } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
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

// @third-party
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';

// @project
import { formatCNPJ, formatPhone, formatCEP } from '@/utils/format';
import { getMunicipiosByUf } from '@/utils/api/ibge';
import { getAddressByCep } from '@/utils/api/cep';

// @types
import { CertificacaoStep3, CertificacaoStep1, CertificacaoStep2, CertificacaoStep4, CertificacaoStep5, CertificacaoStep6 } from '@/types/lead';

// @data
import { brazilianStates } from '@/data/brazilianStates';

/***************************  STEP 3 - DADOS DA EMPRESA  ***************************/

interface Step3DadosEmpresaProps {
  register: UseFormRegister<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  errors: FieldErrors<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  watch: UseFormWatch<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  setValue: UseFormSetValue<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
}

export default function Step3DadosEmpresa({ register, errors, watch, setValue }: Step3DadosEmpresaProps) {
  const watchedCNPJ = watch('cnpj');
  const watchedNormas = watch('normasSelecionadas') || [];
  const watchedEstado = watch('estado');
  const watchedCidade = watch('cidade');
  const watchedCEP = watch('cep');
  const [cnpjAlert, setCnpjAlert] = useState<{ show: boolean; message: string; type: 'active' | 'existing' | 'none' }>({
    show: false,
    message: '',
    type: 'none'
  });
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);

  const requiredField = { required: 'Campo obrigatório' };

  // Carregar cidades quando estado mudar
  useEffect(() => {
    if (watchedEstado && watchedEstado.length === 2) {
      setLoadingCidades(true);
      getMunicipiosByUf(watchedEstado)
        .then((municipios) => {
          setCidades(municipios);
          setLoadingCidades(false);
        })
        .catch(() => {
          setCidades([]);
          setLoadingCidades(false);
        });
    }
  }, [watchedEstado]);

  // Autofill endereço quando CEP é inserido
  useEffect(() => {
    const cleanCep = watchedCEP?.replace(/\D/g, '') || '';
    if (cleanCep.length === 8) {
      setLoadingCEP(true);
      getAddressByCep(watchedCEP || '')
        .then((data) => {
          if (!data.erro) {
            setValue('endereco', data.logradouro, { shouldDirty: true, shouldValidate: true });
            setValue('bairro', data.bairro, { shouldDirty: true, shouldValidate: true });
            setValue('complemento', data.complemento, { shouldDirty: true });
            setValue('estado', data.uf, { shouldDirty: true, shouldValidate: true });
            // Cidade será carregada automaticamente pelo estado via useEffect acima
            setValue('cidade', data.localidade, { shouldDirty: true, shouldValidate: true });
          }
          setLoadingCEP(false);
        })
        .catch(() => {
          setLoadingCEP(false);
        });
    }
  }, [watchedCEP, setValue]);

  // Handle CNPJ mask
  const handleCNPJChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(event.target.value);
    setValue('cnpj', formatted, { shouldDirty: true, shouldValidate: true });
  };

  // Handle phone mask
  const handleTelefoneEmpresaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(event.target.value);
    setValue('telefoneEmpresa', formatted, { shouldDirty: true, shouldValidate: true });
  };

  // Handle CEP mask
  const handleCEPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(event.target.value);
    setValue('cep', formatted, { shouldDirty: true, shouldValidate: true });
  };

  // Check CNPJ existence (placeholder - will integrate with backend later)
  const handleCNPJBlur = async () => {
    if (watchedCNPJ && watchedCNPJ.length === 18) {
      // TODO: Integrate with backend to check CNPJ duplicates
      // For now, just a placeholder
      console.log('Checking CNPJ:', watchedCNPJ);
    }
  };

  const handleCnpjAlertAction = (action: 'continue' | 'commercial') => {
    if (action === 'continue') {
      setCnpjAlert({ show: false, message: '', type: 'none' });
    } else {
      // Redirect to thank you page with commercial flag
      // TODO: Implement redirect
      console.log('Contact commercial');
    }
  };

  return (
    <Stack gap={2}>
      {/* DADOS DA EMPRESA */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
        DADOS DA EMPRESA
      </Typography>

      {/* Row 1: CNPJ | Website | Razão Social | Setor */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            {...register('cnpj', requiredField)}
            label="CNPJ *"
            placeholder="99.999.999/9999-99"
            fullWidth
            size="small"
            error={Boolean(errors.cnpj)}
            helperText={errors.cnpj?.message}
            InputLabelProps={{ shrink: true }}
            onChange={handleCNPJChange}
            onBlur={handleCNPJBlur}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            {...register('website')}
            label="Website"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('razaoSocial', requiredField)}
            label="Razão Social *"
            fullWidth
            size="small"
            error={Boolean(errors.razaoSocial)}
            helperText={errors.razaoSocial?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <FormControl fullWidth error={Boolean(errors.setorEmpresa)} size="small">
            <InputLabel shrink>Setor *</InputLabel>
            <Select
              {...register('setorEmpresa', requiredField)}
              label="Setor *"
              defaultValue="privado"
              notched
            >
              <MenuItem value="privado">Privado</MenuItem>
              <MenuItem value="publico">Público</MenuItem>
            </Select>
            {errors.setorEmpresa && <FormHelperText>{errors.setorEmpresa.message}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      {/* Row 2: Email | Telefone | Endereço */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('emailEmpresa', {
              required: 'Campo obrigatório',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' }
            })}
            label="E-mail da Empresa *"
            fullWidth
            size="small"
            error={Boolean(errors.emailEmpresa)}
            helperText={errors.emailEmpresa?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('telefoneEmpresa', requiredField)}
            label="Telefone da Empresa *"
            placeholder="(99) 99999-9999"
            fullWidth
            size="small"
            error={Boolean(errors.telefoneEmpresa)}
            helperText={errors.telefoneEmpresa?.message}
            InputLabelProps={{ shrink: true }}
            onChange={handleTelefoneEmpresaChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('endereco', requiredField)}
            label="Endereço *"
            fullWidth
            size="small"
            error={Boolean(errors.endereco)}
            helperText={errors.endereco?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Row 3: Número | Complemento | Bairro */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('numero', requiredField)}
            label="Número *"
            fullWidth
            size="small"
            error={Boolean(errors.numero)}
            helperText={errors.numero?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('complemento')}
            label="Complemento"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('bairro', requiredField)}
            label="Bairro *"
            fullWidth
            size="small"
            error={Boolean(errors.bairro)}
            helperText={errors.bairro?.message}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Row 4: CEP | Cidade | Estado */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            {...register('cep', requiredField)}
            label="CEP *"
            placeholder="99999-999"
            fullWidth
            size="small"
            error={Boolean(errors.cep)}
            helperText={errors.cep?.message || (loadingCEP ? 'Buscando endereço...' : '')}
            InputLabelProps={{ shrink: true }}
            onChange={handleCEPChange}
            disabled={loadingCEP}
            InputProps={{
              endAdornment: loadingCEP ? <CircularProgress color="inherit" size={20} /> : null,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            options={cidades}
            value={watchedCidade || null}
            loading={loadingCidades}
            disabled={!watchedEstado || loadingCidades}
            size="small"
            onInputChange={(_, value, reason) => {
              if (reason === 'clear' || reason === 'input') {
                setValue('cidade', value || '', { shouldDirty: true });
              }
            }}
            onChange={(_, value) => {
              setValue('cidade', value || '', { shouldDirty: true, shouldValidate: true });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cidade *"
                error={Boolean(errors.cidade)}
                helperText={errors.cidade?.message || (loadingCidades ? 'Carregando cidades...' : 'Selecione o estado primeiro')}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingCidades ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={Boolean(errors.estado)} size="small">
            <InputLabel shrink>Estado *</InputLabel>
            <Select {...register('estado', requiredField)} label="Estado *" defaultValue="SP" notched>
              {brazilianStates.map((state) => (
                <MenuItem key={state.code} value={state.code}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
            {errors.estado && <FormHelperText>{errors.estado.message}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      {/* CNPJ Alert (placeholder) */}
      {cnpjAlert.show && (
        <Alert severity="warning" variant="filled">
          {cnpjAlert.message}
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button size="small" variant="outlined" color="inherit" onClick={() => handleCnpjAlertAction('continue')}>
              Seguir com nova solicitação
            </Button>
            <Button size="small" variant="outlined" color="inherit" onClick={() => handleCnpjAlertAction('commercial')}>
              Solicitar contato do Comercial
            </Button>
          </Stack>
        </Alert>
      )}
    </Stack>
  );
}
