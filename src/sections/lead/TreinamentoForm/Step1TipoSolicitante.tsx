'use client';

// @mui
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { Controller, UseFormRegister, UseFormWatch, FieldErrors, Control } from 'react-hook-form';

// @types
import { TreinamentoFormData } from '@/types/lead';

// @utils
import { formatPhone, formatWhatsApp } from '@/utils/masks';

/***************************  STEP 1 - TIPO E SOLICITANTE  ***************************/

interface Step1TipoSolicitanteProps {
  register: UseFormRegister<TreinamentoFormData>;
  errors: FieldErrors<TreinamentoFormData>;
  watch: UseFormWatch<TreinamentoFormData>;
  control: Control<TreinamentoFormData>;
}

export default function Step1TipoSolicitante({ register, errors, watch, control }: Step1TipoSolicitanteProps) {
  const telefoneField = register('telefone', { required: 'Campo obrigatório' });
  const whatsappField = register('whatsapp');

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
        TIPO DA SOLICITAÇÃO
      </Typography>

      <Box>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
          Para quem será o treinamento? *
        </Typography>
        <Controller
          name="paraQuem"
          control={control}
          rules={{ required: 'Selecione uma opção' }}
          render={({ field }) => (
            <RadioGroup {...field}>
              <FormControlLabel value="empresa" control={<Radio />} label="Para uma Empresa" />
              <FormControlLabel value="pessoa_fisica" control={<Radio />} label="Para uma Pessoa Física" />
            </RadioGroup>
          )}
        />
        {errors.paraQuem && <FormHelperText error>{errors.paraQuem.message}</FormHelperText>}
      </Box>

      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
          Conte-nos onde nos conheceu
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Campo texto livre (opcional)"
          {...register('ondeNosConheceu')}
          size="small"
        />
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem', mt: 2 }}>
        DADOS DO SOLICITANTE
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Nome do Contato *
          </Typography>
          <TextField
            fullWidth
            {...register('nomeContato', { required: 'Campo obrigatório' })}
            error={!!errors.nomeContato}
            helperText={errors.nomeContato?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Cargo *
          </Typography>
          <TextField
            fullWidth
            {...register('cargo', { required: 'Campo obrigatório' })}
            error={!!errors.cargo}
            helperText={errors.cargo?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            E-mail *
          </Typography>
          <TextField
            fullWidth
            type="email"
            {...register('email', {
              required: 'Campo obrigatório',
              pattern: { value: /.+@.+\..+/, message: 'E-mail inválido' }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Data de Nascimento
          </Typography>
          <TextField
            fullWidth
            placeholder="99/99/9999"
            {...register('dataNascimento')}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Telefone *
          </Typography>
          <TextField
            fullWidth
            placeholder="(99) 99999-9999"
            error={!!errors.telefone}
            helperText={errors.telefone?.message}
            size="small"
            {...telefoneField}
            onChange={(e) => {
              e.target.value = formatPhone(e.target.value);
              void telefoneField.onChange(e);
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            WhatsApp
          </Typography>
          <TextField
            fullWidth
            placeholder="(99) 99999-9999"
            size="small"
            {...whatsappField}
            onChange={(e) => {
              e.target.value = formatWhatsApp(e.target.value);
              void whatsappField.onChange(e);
            }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
