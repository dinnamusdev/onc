'use client';

import { useState, useEffect } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { UseFormRegister, UseFormWatch, FieldErrors, Controller } from 'react-hook-form';

// @utils
import { getMunicipiosByUf } from '@/utils/api/ibge';
import { formatCPF, formatCEP, formatPhone, formatWhatsApp, formatDate } from '@/utils/masks';

// @types
import { TreinamentoFormData } from '@/types/lead';

/***************************  STEP 2B - DADOS DO PARTICIPANTE  ***************************/

interface Step2ParticipanteProps {
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

export default function Step2Participante({ register, errors, watch, control }: Step2ParticipanteProps) {
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const watchedEstado = watch('participante.estado');

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
        DADOS DO PARTICIPANTE
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Nome Completo *
          </Typography>
          <TextField
            fullWidth
            {...register('participante.nomeCompleto', { required: 'Campo obrigatório' })}
            error={!!errors.participante?.nomeCompleto}
            helperText={errors.participante?.nomeCompleto?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            CPF *
          </Typography>
          <Controller
            name="participante.cpf"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field }) => (
              <TextField
                fullWidth
                placeholder="999.999.999-99"
                error={!!errors.participante?.cpf}
                helperText={errors.participante?.cpf?.message}
                size="small"
                {...field}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  field.onChange(formatted);
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            E-mail *
          </Typography>
          <TextField
            fullWidth
            type="email"
            {...register('participante.email', {
              required: 'Campo obrigatório',
              pattern: { value: /.+@.+\..+/, message: 'E-mail inválido' }
            })}
            error={!!errors.participante?.email}
            helperText={errors.participante?.email?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Data de Nascimento *
          </Typography>
          <Controller
            name="participante.dataNascimento"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field }) => (
              <TextField
                fullWidth
                placeholder="99/99/9999"
                error={!!errors.participante?.dataNascimento}
                helperText={errors.participante?.dataNascimento?.message}
                size="small"
                {...field}
                onChange={(e) => {
                  const formatted = formatDate(e.target.value);
                  field.onChange(formatted);
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Telefone *
          </Typography>
          <Controller
            name="participante.telefone"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field }) => (
              <TextField
                fullWidth
                placeholder="(99) 99999-9999"
                error={!!errors.participante?.telefone}
                helperText={errors.participante?.telefone?.message}
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            WhatsApp
          </Typography>
          <Controller
            name="participante.whatsapp"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                placeholder="(99) 99999-9999"
                size="small"
                {...field}
                onChange={(e) => {
                  const formatted = formatWhatsApp(e.target.value);
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
            {...register('participante.endereco', { required: 'Campo obrigatório' })}
            error={!!errors.participante?.endereco}
            helperText={errors.participante?.endereco?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Número *
          </Typography>
          <TextField
            fullWidth
            {...register('participante.numero', { required: 'Campo obrigatório' })}
            error={!!errors.participante?.numero}
            helperText={errors.participante?.numero?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Complemento
          </Typography>
          <TextField
            fullWidth
            {...register('participante.complemento')}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Bairro *
          </Typography>
          <TextField
            fullWidth
            {...register('participante.bairro', { required: 'Campo obrigatório' })}
            error={!!errors.participante?.bairro}
            helperText={errors.participante?.bairro?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            CEP *
          </Typography>
          <Controller
            name="participante.cep"
            control={control}
            rules={{ required: 'Campo obrigatório' }}
            render={({ field }) => (
              <TextField
                fullWidth
                placeholder="99999-999"
                error={!!errors.participante?.cep}
                helperText={errors.participante?.cep?.message}
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Estado *
          </Typography>
          <TextField
            select
            fullWidth
            defaultValue="SP"
            {...register('participante.estado', { required: 'Campo obrigatório' })}
            error={!!errors.participante?.estado}
            helperText={errors.participante?.estado?.message}
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Cidade *
          </Typography>
          <Autocomplete
            loading={loadingCidades}
            options={cidades}
            value={watch('participante.cidade') || ''}
            onChange={(_, value) => {
              // Será preenchido via setValue no componente pai
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...register('participante.cidade', { required: 'Campo obrigatório' })}
                error={!!errors.participante?.cidade}
                helperText={errors.participante?.cidade?.message}
                size="small"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Em qual empresa trabalha?
          </Typography>
          <TextField
            fullWidth
            {...register('participante.empresaOndeTrabalha')}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Qual o seu cargo?
          </Typography>
          <TextField
            fullWidth
            {...register('participante.cargo')}
            size="small"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
