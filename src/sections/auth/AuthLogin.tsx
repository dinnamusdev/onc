'use client';

// @next
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useTransition } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { APP_DEFAULT_PATH, AUTH_USER_KEY } from '@/config';
import { login } from '@/utils/api/auth';
import { emailSchema, passwordSchema } from '@/utils/validation-schema/common';

// @icons
import { IconEye, IconEyeOff } from '@tabler/icons-react';

// @types
import { CommonAuthComponentProps } from '@/types/auth';

interface LoginFormInput {
  email: string;
  password: string;
}

/***************************  AUTH - LOGIN  ***************************/

export default function AuthLogin({ inputSx }: CommonAuthComponentProps) {
  const router = useRouter();
  const theme = useTheme();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isProcessing, startTransition] = useTransition();
  const [loginError, setLoginError] = useState('');

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInput>({ defaultValues: { email: '', password: '' } });

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormInput> = (formData) => {
    setLoginError('');

    startTransition(async () => {
      const { data, error } = await login(formData);
      if (error) {
        setLoginError(error || 'Algo deu errado');
        return;
      }

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
      router.replace(APP_DEFAULT_PATH);
    });
  };

  const commonIconProps = { size: 16, color: theme.vars.palette.grey[700] };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <Box>
          <InputLabel>E-mail</InputLabel>
          <OutlinedInput
            {...register('email', emailSchema)}
            placeholder="exemplo@gmail.com"
            fullWidth
            error={Boolean(errors.email)}
            sx={{
  ...inputSx,
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
    WebkitTextFillColor: '#000000 !important',
    caretColor: '#000000',
    transition: 'background-color 5000s ease-in-out 0s !important'
  }
}}
          />
          {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
        </Box>

        <Box>
          <InputLabel>Senha</InputLabel>
          <OutlinedInput
            {...register('password', passwordSchema)}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Digite sua senha"
            fullWidth
            error={Boolean(errors.password)}
            endAdornment={
              <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <IconEye {...commonIconProps} /> : <IconEyeOff {...commonIconProps} />}
              </InputAdornment>
            }
            sx={{
  ...inputSx,
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
    WebkitTextFillColor: '#000000 !important',
    caretColor: '#000000',
    transition: 'background-color 5000s ease-in-out 0s !important'
  }
}}
          />
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: errors.password ? 'space-between' : 'flex-end', width: 1 }}>
            {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
            <Link
              component={NextLink}
              underline="hover"
              variant="caption"
              href="/forgot-password"
              textAlign="right"
              sx={{ '&:hover': { color: 'primary.dark' }, mt: 0.75 }}
            >
              Esqueceu sua senha?
            </Link>
          </Stack>
        </Box>
      </Stack>

      <Button
  type="submit"
  color="primary"
  variant="contained"
  fullWidth
  disabled={isProcessing}
  endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
  sx={{
    mt: { xs: 1, sm: 4 },
    '& .MuiButton-endIcon': { ml: 1 }
  }}
>
  Login
</Button>
      {loginError && (
        <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
          {loginError}
        </Alert>
      )}
    </form>
  );
}