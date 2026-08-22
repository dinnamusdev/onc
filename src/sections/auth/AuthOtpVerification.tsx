'use client';

// next
import { useRouter, useSearchParams } from 'next/navigation';

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
import { verifyOtp, verifyRecoveryCode, requestCodePasswordReset, resendOtp } from '@/utils/api/auth';

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
  const searchParams = useSearchParams();

  const [isProcessing, startTransition] = useTransition();
  const [otpError, setOtpError] = useState('');

  // Get internal token from URL for recovery verification
  const internalToken = searchParams.get('internalToken') || '';

  // Get recovery code from router state (for validation reference)
  const expectedRecoveryCode = (router.state as any)?.recoveryCode || '';

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
      // Resend recovery code
      const { error, data } = await requestCodePasswordReset({ email });
      if (error) {
        setOtpError(error || 'Algo deu errado ao reenviar código');
        return;
      }
      
      // Update internal token if a new one is returned
      const newInternalToken = data?.internalToken || internalToken;
      if (newInternalToken && newInternalToken !== internalToken) {
        const url = new URL(window.location.href);
        url.searchParams.set('internalToken', newInternalToken);
        window.history.replaceState({}, '', url.toString());
      }
      
      // Update router state with new recovery code (user must type it)
      const newRecoveryCode = data?.recoveryCode || '';
      if (newRecoveryCode) {
        router.push(window.location.pathname + window.location.search, {
          state: { recoveryCode: newRecoveryCode }
        });
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
      // First validate that the code matches what was sent (router state)
      if (expectedRecoveryCode && formData.otp !== expectedRecoveryCode) {
        setOtpError('Código incorreto. Verifique o código enviado para seu email.');
        resetField('otp');
        return;
      }

      // If code matches, then verify with API using internal token
      const payload = {
        email,
        code: formData.otp,
        internalToken
      };

      startTransition(async () => {
        const { error, data } = await verifyRecoveryCode(payload);

        if (error) {
          setOtpError(error || 'Algo deu errado');
          resetField('otp');
          return;
        }

        // Redirect to password recovery with the recovery token from API response
        const recoveryToken = data?.recoveryToken || '';
        router.replace(`/password-recovery?email=${encodeURIComponent(email)}&recoveryToken=${encodeURIComponent(recoveryToken)}`);
      });

      const activeElement = document.activeElement as HTMLElement | null;
      activeElement?.blur();
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