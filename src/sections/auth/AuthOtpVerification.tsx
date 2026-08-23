'use client';

// next
import { useRouter } from 'next/navigation';

import { useEffect, useState, useTransition } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import CodeVerification from '@/components/CodeVerification';
import {
  verifyOtp,
  requestCodePasswordReset,
  resendOtp
} from '@/utils/api/auth';

// @types
import { OtpVerificationProps } from '@/types/auth';

interface OtpFormInput {
  otp: string;
}


const verificationTypes: Record<string, string> = {
  signup: 'signup',
  email_change: 'email_change'
};

/***************************  AUTH - OTP VERIFICATION  ***************************/

export default function AuthOtpVerification({
  email,
  verify
}: OtpVerificationProps) {
  const router = useRouter();

  const [isProcessing, startTransition] = useTransition();
  const [otpError, setOtpError] = useState('');

  // Código de recuperação guardado na etapa de solicitação (App Router não tem navigation state)
  const [expectedRecoveryCode, setExpectedRecoveryCode] = useState('');

  useEffect(() => {
    setExpectedRecoveryCode(sessionStorage.getItem('recovery_code') || '');
  }, []);

  // Form starts empty - user must type the code
   const {
    handleSubmit,
    control,
    resetField,
    formState: { errors }
  } = useForm<OtpFormInput>({
    defaultValues: { otp: '' }
  });

  // Contador para reenvio do código
  const [seconds, setSeconds] = useState(46);

  /*************************** CONTADOR ***************************/

    useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  /*************************** LIMPAR ERRO AUTOMATICAMENTE ***************************/

  useEffect(() => {
    if (!otpError) {
      return;
    }

    const timer = setTimeout(() => {
      setOtpError('');
    }, 5000); // mensagem some após 5 segundos

    return () => clearTimeout(timer);
  }, [otpError]);

  /*************************** REENVIO DO CÓDIGO ***************************/

  const handleResendCode = async () => {
    setSeconds(46); // Reset timer
    setOtpError('');

    if (verify === 'recovery') {
      // Reenvia o código de recuperação
      const { error, data } = await requestCodePasswordReset({ email });
      if (error) {
        setOtpError(error || 'Algo deu errado ao reenviar código');
        return;
      }

      // ONC retorna { data: { token, code } } — atualiza sessionStorage
      const newToken = data?.data?.token || '';
      const newCode = data?.data?.code || '';
      if (newToken) {
        sessionStorage.setItem('recovery_token', newToken);
      }
      if (newCode) {
        sessionStorage.setItem('recovery_code', newCode);
        setExpectedRecoveryCode(newCode);
      }
    } else {
      // Resend OTP for other verification types
      const type = verificationTypes[verify] ?? verificationTypes.signup;
      const { error } = await resendOtp({ email, type });
      if (error) {
        setOtpError(error || 'Algo deu errado ao reenviar código');
      }
    }
  };

  /*************************** VERIFICAR CÓDIGO ***************************/

  const onSubmit: SubmitHandler<OtpFormInput> = (formData) => {
    setOtpError('');

    if (verify === 'recovery') {
      const savedRecoveryCode = sessionStorage.getItem('recovery_code') || '';

      if (!savedRecoveryCode || formData.otp !== savedRecoveryCode) {
        setOtpError('Código incorreto. Verifique o código enviado para seu email.');
        resetField('otp');
        return;
      }

      router.replace(`/password-recovery?email=${encodeURIComponent(email)}`);
      return;
    }

    const type =
      verificationTypes[verify] ?? verificationTypes.signup;

    const payload = {
      email,
      otp: formData.otp,
      type
    };

    startTransition(async () => {
      const { error } = await verifyOtp(payload);

      if (error) {
        setOtpError(error || 'Algo deu errado');
        resetField('otp');
        return;
      }

      router.replace('/login');
    });

    const activeElement =
      document.activeElement as HTMLElement | null;

    activeElement?.blur();
  };

  /*************************** RENDER ***************************/

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      {/* CÓDIGO DE VERIFICAÇÃO */}

      <InputLabel
        sx={{
          fontSize: 11,
          color: '#333',
          mb: 0.5
        }}
      >
        Código de Verificação
      </InputLabel>

      <CodeVerification control={control} />

      {errors.otp?.message && (
        <FormHelperText error>
          {errors.otp.message}
        </FormHelperText>
      )}

      {/* BOTÃO VERIFICAR */}

      <Button
        type="submit"
        color="primary"
        variant="contained"
        fullWidth
        disabled={isProcessing}
        endIcon={
          isProcessing && (
            <CircularProgress
              color="inherit"
              size={15}
            />
          )
        }
        sx={{
          height: 38,
          mt: 2,
          borderRadius: 1,
          backgroundColor: '#B40000',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',

          '&:hover': {
            backgroundColor: '#980000',
            boxShadow: 'none'
          },

          '& .MuiButton-endIcon': {
            ml: 1
          }
        }}
      >
        Verificar Código
      </Button>

      {/* ERRO */}

      {otpError && (
        <Alert
          sx={{
            mt: 1.5,
            fontSize: 11
          }}
          severity="error"
          variant="filled"
          icon={false}
        >
          {otpError}
        </Alert>
      )}

      {/* REENVIO DO CÓDIGO */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 2.5,
          gap: 0.5
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: 10,
            color: '#777'
          }}
        >
          Não recebeu um código?
        </Typography>

        {seconds > 0 ? (
          <Typography
            component="span"
            sx={{
              fontSize: 10,
              color: '#999'
            }}
          >
            Reenviar código em{' '}
            <Box
              component="span"
              sx={{
                color: '#B40000',
                fontWeight: 600
              }}
            >
              {seconds} seg
            </Box>
          </Typography>
        ) : (
          <Link
            component="button"
            type="button"
            underline="none"
            onClick={handleResendCode}
            sx={{
              border: 0,
              background: 'transparent',
              padding: 0,
              fontSize: 10,
              color: '#B40000',
              fontWeight: 600,
              cursor: 'pointer',

              '&:hover': {
                color: '#980000'
              }
            }}
          >
            Reenviar código
          </Link>
        )}
      </Box>
    </form>
  );
}