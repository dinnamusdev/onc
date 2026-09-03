'use client';

import { useState } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @icons
import { IconX } from '@tabler/icons-react';

// @project
import { emailSchema } from '@/utils/validation-schema/common';
import { createUser } from '@/utils/api/users';

/***************************  OPÇÕES  ***************************/

/***************************  TYPES  ***************************/

interface CreateUserFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
}

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: unknown) => void;
}

/***************************  USERS - CREATE DIALOG  ***************************/

export default function CreateUserDialog({ open, onClose, onCreate }: CreateUserDialogProps) {
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<CreateUserFormInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      rePassword: ''
    }
  });

  const handleClose = () => {
    reset();
    setSubmitError('');
    onClose();
  };

  const onSubmit: SubmitHandler<CreateUserFormInput> = async (data) => {
    setSubmitError('');

    // Backend (ONC) exige rePassword e valida a igualdade das senhas.
    if (data.password !== data.rePassword) {
      setSubmitError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);

    // Cadastro básico. O backend enviará e-mail de ativação; os dados
    // complementares são preenchidos pelo próprio usuário em "Meu Perfil".
    const { data: response, error } = await createUser({
      userName: `${data.firstName}${data.lastName}`.trim() || data.email,
      email: data.email,
      password: data.password,
      rePassword: data.rePassword
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error || 'Não foi possível criar o usuário.');
      return;
    }

    onCreate?.(response ?? data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3 }}>
        <Box>
          <DialogTitle sx={{ p: 0, fontSize: 18, fontWeight: 600 }}>Adicionar Novo Usuário</DialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Cadastro básico. O usuário receberá um e-mail para ativar a conta e completar o perfil.
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <IconX size={18} />
        </IconButton>
      </Stack>

      <Divider sx={{ mt: 2 }} />

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {/* Campos falsos para impedir o autofill do navegador de preencher os reais */}
        <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
        <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />
        <DialogContent>
          <Stack sx={{ gap: 2.5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Nome</InputLabel>
                <OutlinedInput {...register('firstName')} placeholder="ex. John" fullWidth autoComplete="off" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Sobrenome</InputLabel>
                <OutlinedInput {...register('lastName')} placeholder="ex. Doe" fullWidth autoComplete="off" />
              </Grid>
            </Grid>

            <Box>
              <InputLabel>E-mail *</InputLabel>
              <OutlinedInput
                {...register('email', emailSchema)}
                placeholder="exemplo@gmail.com"
                fullWidth
                autoComplete="off"
                error={Boolean(errors.email)}
              />
              {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Senha *</InputLabel>
                <OutlinedInput
                  {...register('password', { required: 'A senha é obrigatória' })}
                  type="password"
                  placeholder="Senha"
                  fullWidth
                  autoComplete="new-password"
                  error={Boolean(errors.password)}
                />
                {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Confirmar Senha *</InputLabel>
                <OutlinedInput
                  {...register('rePassword', { required: 'A confirmação de senha é obrigatória' })}
                  type="password"
                  placeholder="Confirmar Senha"
                  fullWidth
                  autoComplete="new-password"
                  error={Boolean(errors.rePassword)}
                />
                {errors.rePassword?.message && <FormHelperText error>{errors.rePassword.message}</FormHelperText>}
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, flexDirection: 'column', alignItems: 'stretch', gap: 1.5 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          <Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleClose} color="secondary" variant="outlined" disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSubmitting ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
