'use client';

import { useRef, useState } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { Controller, useForm, SubmitHandler } from 'react-hook-form';

// @icons
import { IconCamera, IconPlus, IconX } from '@tabler/icons-react';

// @project
import { emailSchema, contactSchema } from '@/utils/validation-schema/common';

/***************************  MOCK - OPÇÕES  ***************************/
// TODO: substituir por dados vindos da API (GET /api/authz/roles)

const roleOptions = ['Atendente', 'Gerente', 'Gestor', 'Admin'];

const countryCodes = [
  { value: 'BR', label: 'BR +55' },
  { value: 'US', label: 'US +1' },
  { value: 'PT', label: 'PT +351' }
];

const statusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'denunciado', label: 'Denunciado' },
  { value: 'bloqueado', label: 'Bloqueado' }
];

/***************************  TYPES  ***************************/

interface CreateUserFormInput {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  contact: string;
  admissionDate: string; // formato YYYY-MM-DD (input nativo type="date")
  zipCode: string;
  address: string;
  status: string;
  roles: string[];
}

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: CreateUserFormInput) => void;
}

const todayISO = () => new Date().toISOString().split('T')[0];

/***************************  USERS - CREATE DIALOG  ***************************/

export default function CreateUserDialog({ open, onClose, onCreate }: CreateUserDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<CreateUserFormInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: 'BR',
      contact: '',
      admissionDate: todayISO(),
      zipCode: '',
      address: '',
      status: 'pendente',
      roles: []
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    reset();
    setAvatarPreview(null);
    onClose();
  };

  const onSubmit: SubmitHandler<CreateUserFormInput> = (data) => {
    // TODO: enviar para API (POST /api/users)
    onCreate?.(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3 }}>
        <Box>
          <DialogTitle sx={{ p: 0, fontSize: 18, fontWeight: 600 }}>Adicionar Novo Usuário</DialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configurações e permissões personalizadas para usuários novos ou existentes.
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <IconX size={18} />
        </IconButton>
      </Stack>

      <Divider sx={{ mt: 2 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack sx={{ gap: 2.5 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Dados Pessoais
              </Typography>

              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              <Box sx={{ position: 'relative', width: 64, height: 64 }}>
                <Avatar src={avatarPreview ?? undefined} sx={{ width: 64, height: 64 }} />
                <IconButton
                  onClick={handleAvatarClick}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <IconCamera size={14} />
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Nome</InputLabel>
                <OutlinedInput {...register('firstName')} placeholder="ex. John" fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Sobrenome</InputLabel>
                <OutlinedInput {...register('lastName')} placeholder="ex. Doe" fullWidth />
              </Grid>
            </Grid>

            <Box>
              <InputLabel>E-mail *</InputLabel>
              <OutlinedInput
                {...register('email', emailSchema)}
                placeholder="exemplo@gmail.com"
                fullWidth
                error={Boolean(errors.email)}
              />
              {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Contato *</InputLabel>
                <Stack direction="row" sx={{ gap: 1 }}>
                  <Controller
                    name="countryCode"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="small" sx={{ minWidth: 92 }}>
                        {countryCodes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <OutlinedInput
                    {...register('contact', contactSchema)}
                    placeholder="ex. 9876x xxxxx"
                    fullWidth
                    error={Boolean(errors.contact)}
                  />
                </Stack>
                {errors.contact?.message && <FormHelperText error>{errors.contact.message}</FormHelperText>}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Data de Admissão *</InputLabel>
                <OutlinedInput
                  {...register('admissionDate', { required: 'A data de admissão é obrigatória' })}
                  type="date"
                  fullWidth
                  error={Boolean(errors.admissionDate)}
                />
                {errors.admissionDate?.message && <FormHelperText error>{errors.admissionDate.message}</FormHelperText>}
              </Grid>
            </Grid>

            <Box>
              <InputLabel>CEP</InputLabel>
              <OutlinedInput {...register('zipCode')} placeholder="00000-000" fullWidth />
            </Box>

            <Box>
              <InputLabel>Endereço</InputLabel>
              <TextField {...register('address')} placeholder="Insira um endereço..." fullWidth multiline minRows={2} />
            </Box>

            <Box>
              <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row sx={{ gap: 2 }}>
                    {statusOptions.map((option) => (
                      <FormControlLabel key={option.value} value={option.value} control={<Radio size="small" />} label={option.label} />
                    ))}
                  </RadioGroup>
                )}
              />
            </Box>

            <Box>
              <InputLabel sx={{ mb: 1 }}>Papéis (Opcional)</InputLabel>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={roleOptions}
                    value={field.value}
                    onChange={(_event, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={field.value.length ? '' : '+ Atribuir Papéis'}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: field.value.length === 0 ? <IconPlus size={16} style={{ marginLeft: 8 }} /> : params.InputProps.startAdornment
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="error">
            Criar Usuário
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
