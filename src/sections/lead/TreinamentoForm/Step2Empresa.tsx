'use client';

import { useState, useEffect } from 'react';

// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

// @third-party
import { UseFormRegister, UseFormWatch, FieldErrors, Controller } from 'react-hook-form';

// @utils
import { getMunicipiosByUf } from '@/utils/api/ibge';
import { formatCNPJ, formatCEP, formatPhone } from '@/utils/masks';

// @types
import { TreinamentoFormData } from '@/types/lead';

/***************************  STEP 2A - DADOS DA EMPRESA  ***************************/

interface Step2EmpresaProps {
  register: UseFormRegister<TreinamentoFormData>;
  errors: FieldErrors<TreinamentoFormData>;
  watch: UseFormWatch<TreinamentoFormData>;
  control: any;
}

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function Step2Empresa({ register, errors, watch, control }: Step2EmpresaProps) {
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const watchedEstado = watch('empresa.estado');

  // Carregar cidades quando estado muda
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

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
        DADOS DA EMPRESA
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            CNPJ *
          </Typography>
          <Controller
            name="empresa.cnpj"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field }) => (
              <TextField
                fullWidth
                placeholder="99.999.999/0001-99"
                error={!!errors.empresa?.cnpj}
                helperText={errors.empresa?.cnpj?.message}
                size="small"
                {...field}
                onChange={(e) => {
                  const formatted = formatCNPJ(e.target.value);
                  field.onChange(formatted);
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Website
          </Typography>
          <TextField
            fullWidth
            {...register('empresa.website')}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Razão Social *
          </Typography>
          <TextField
            fullWidth
            {...register('empresa.razaoSocial', { required: 'Campo obrigatório' })}
            error={!!errors.empresa?.razaoSocial}
            helperText={errors.empresa?.razaoSocial?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Setor da Empresa *
          </Typography>
          <TextField
            select
            fullWidth
            defaultValue="privado"
            {...register('empresa.setorEmpresa', { required: 'Campo obrigatório' })}
            error={!!errors.empresa?.setorEmpresa}
            helperText={errors.empresa?.setorEmpresa?.message}
            size="small"
            SelectProps={{ native: true }}
          >
            <option value="privado">Setor Privado</option>
            <option value="publico">Setor Público</option>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            E-mail da Empresa *
          </Typography>
          <TextField
            fullWidth
            type="email"
            {...register('empresa.emailEmpresa', {
              required: 'Campo obrigatório',
              pattern: { value: /.+@.+\..+/, message: 'E-mail inválido' }
            })}
            error={!!errors.empresa?.emailEmpresa}
            helperText={errors.empresa?.emailEmpresa?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Telefone da Empresa *
          </Typography>
          <Controller
            name="empresa.telefoneEmpresa"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field }) => (
              <TextField
                fullWidth
                placeholder="(99) 99999-9999"
                error={!!errors.empresa?.telefoneEmpresa}
                helperText={errors.empresa?.telefoneEmpresa?.message}
                size="small"
                {...field}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  field.onChange(formatted);
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 7 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Endereço *
          </Typography>
          <TextField
            fullWidth
            {...register('empresa.endereco', { required: 'Campo obrigatório' })}
            error={!!errors.empresa?.endereco}
            helperText={errors.empresa?.endereco?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Número *
          </Typography>
          <TextField
            fullWidth
            {...register('empresa.numero', { required: 'Campo obrigatório' })}
            error={!!errors.empresa?.numero}
            helperText={errors.empresa?.numero?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Complemento
          </Typography>
          <TextField
            fullWidth
            {...register('empresa.complemento')}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Bairro *
          </Typography>
          <TextField
            fullWidth
            {...register('empresa.bairro', { required: 'Campo obrigatório' })}
            error={!!errors.empresa?.bairro}
            helperText={errors.empresa?.bairro?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            CEP *
          </Typography>
          <Controller
            name="empresa.cep"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field }) => (
              <TextField
                fullWidth
                placeholder="99999-999"
                error={!!errors.empresa?.cep}
                helperText={errors.empresa?.cep?.message}
                size="small"
                {...field}
                onChange={(e) => {
                  const formatted = formatCEP(e.target.value);
                  field.onChange(formatted);
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Estado *
          </Typography>
          <TextField
            select
            fullWidth
            defaultValue="SP"
            {...register('empresa.estado', { required: 'Campo obrigatório' })}
            error={!!errors.empresa?.estado}
            helperText={errors.empresa?.estado?.message}
            size="small"
            SelectProps={{ native: true }}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Cidade *
          </Typography>
          <Autocomplete
            loading={loadingCidades}
            options={cidades}
            value={watch('empresa.cidade') || ''}
            onChange={(_, value) => {
              // Será preenchido via setValue no componente pai
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...register('empresa.cidade', { required: 'Campo obrigatório' })}
                error={!!errors.empresa?.cidade}
                helperText={errors.empresa?.cidade?.message}
                size="small"
              />
            )}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
