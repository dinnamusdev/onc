'use client';

import { useState, useTransition } from 'react';

// @next
import { useRouter } from 'next/navigation';

// @mui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { forgotPassword } from '@/utils/api/auth';
import { emailSchema } from '@/utils/validation-schema/common';

// @types
import { CommonAuthComponentProps } from '@/types/auth';

interface ForgotPasswordFormInput {
  email: string;
}

interface ForgotPasswordProps extends CommonAuthComponentProps {
  redirectTo?: string;
  doRedirect?: boolean;
  attachEmail?: boolean;
}

/***************************  AUTH - FORGOT PASSWORD  ***************************/

export default function AuthForgotPassword({ inputSx, redirectTo, doRedirect = false, attachEmail = false }: ForgotPasswordProps) {
  const router = useRouter();

  const [isProcessing, startTransition] = useTransition();
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ForgotPasswordFormInput>();

  const onSubmit: SubmitHandler<ForgotPasswordFormInput> = (formData) => {
    setForgotPasswordError('');

    const payload: Record<string, string> = { email: formData.email };
    const redirectUrl =
      redirectTo && attachEmail
        ? `${redirectTo}?email=${encodeURIComponent(formData.email)}&verify=recovery`
        : redirectTo;

    if (redirectUrl) {
      payload.redirectTo = redirectUrl;
    }

    startTransition(async () => {
      const { error } = await forgotPassword(payload);
      if (error) {
        setForgotPasswordError(error || 'Algo deu errado');
        return;
      }

      reset();

      if (redirectUrl && doRedirect) {
        router.push(redirectUrl);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <InputLabel>E-mail</InputLabel>
      <OutlinedInput
        {...register('email', emailSchema)}
        placeholder="exemplo@gmail.com"
        fullWidth
        error={Boolean(errors.email)}
        sx={{ ...inputSx }}
      />
      {errors.email?.message && <FormHelperText error>{errors.email?.message}</FormHelperText>}

      <Button
        type="submit"
        color="primary"
        variant="contained"
        fullWidth
        disabled={isProcessing}
        endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
        sx={{ minWidth: 120, mt: { xs: 2, sm: 4 }, '& .MuiButton-endIcon': { ml: 1 } }}
      >
        Solicitar Código de Recuperação
      </Button>
      {forgotPasswordError && (
        <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
          {forgotPasswordError}
        </Alert>
      )}
    </form>
  );
}