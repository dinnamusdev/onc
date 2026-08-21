'use client';

// @next
import { useRouter, useSearchParams } from 'next/navigation';

import { useState, useRef, useEffect, useTransition } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { resetPassword } from '@/utils/api/auth';
import { passwordSchema } from '@/utils/validation-schema/common';

// @icons
import { IconEye, IconEyeOff } from '@tabler/icons-react';

// @types
import { CommonAuthComponentProps } from '@/types/auth';

interface PasswordRecoveryFormInput {
  password: string;
  confirmPassword: string;
}

/***************************  AUTH - PASSWORD RECOVERY  ***************************/

export default function AuthPasswordRecovery({ inputSx }: CommonAuthComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isProcessing, startTransition] = useTransition();
  const [passwordRecoveryError, setPasswordRecoveryError] = useState('');

  const iconCommonProps = { size: 16, color: theme.vars.palette.grey[700] };

  // Token de recuperação guardado durante a etapa de solicitação (App Router não tem navigation state)
  const [recoveryToken, setRecoveryToken] = useState('');

  useEffect(() => {
    setRecoveryToken(sessionStorage.getItem('recovery_token') || searchParams.get('recoveryToken') || '');
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<PasswordRecoveryFormInput>();

  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit: SubmitHandler<PasswordRecoveryFormInput> = (formData) => {
    const email = searchParams.get('email');

    if (!email || !recoveryToken) {
      setPasswordRecoveryError('Sessão de recuperação inválida');
      return;
    }

    setPasswordRecoveryError('');

    const payload = {
      email,
      token: recoveryToken,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    startTransition(async () => {
      const { error } = await resetPassword(payload);
      if (error) {
        setPasswordRecoveryError(error || 'Algo deu errado');
        return;
      }

      reset();
      sessionStorage.removeItem('recovery_token');
      sessionStorage.removeItem('recovery_code');
      router.replace('/login');
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Stack gap={2}>
        <Box>
          <InputLabel>Nova Senha</InputLabel>
          <OutlinedInput
            {...register('password', passwordSchema)}
            type={isOpen ? 'text' : 'password'}
            placeholder="Digite uma nova senha"
            fullWidth
            autoComplete="new-password"
            error={Boolean(errors.password)}
            endAdornment={
              <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <IconEye {...iconCommonProps} /> : <IconEyeOff {...iconCommonProps} />}
              </InputAdornment>
            }
            sx={inputSx}
          />
          {errors.password?.message && <FormHelperText error>{errors.password?.message}</FormHelperText>}
        </Box>
        <Box>
          <InputLabel>Confirme a Senha</InputLabel>
          <OutlinedInput
            {...register('confirmPassword', { validate: (value) => value === password.current || 'As senhas não coincidem' })}
            type={isConfirmOpen ? 'text' : 'password'}
            placeholder="Digite a confirmação de senha"
            fullWidth
            error={Boolean(errors.confirmPassword)}
            endAdornment={
              <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsConfirmOpen(!isConfirmOpen)}>
                {isConfirmOpen ? <IconEye {...iconCommonProps} /> : <IconEyeOff {...iconCommonProps} />}
              </InputAdornment>
            }
            sx={inputSx}
          />
          {errors.confirmPassword?.message && <FormHelperText error>{errors.confirmPassword?.message}</FormHelperText>}
        </Box>
      </Stack>

      <Button
        type="submit"
        color="primary"
        variant="contained"
        fullWidth
        disabled={isProcessing}
        endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
        sx={{ minWidth: 120, mt: { xs: 2, sm: 4 }, '& .MuiButton-endIcon': { ml: 1 } }}
      >
        Redefinir Senha
      </Button>
      {passwordRecoveryError && (
        <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
          {passwordRecoveryError}
        </Alert>
      )}
    </form>
  );
}