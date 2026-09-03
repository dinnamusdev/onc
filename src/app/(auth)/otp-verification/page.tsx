'use client';

// @next
import { useSearchParams } from 'next/navigation';

// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import AuthOtpVerification from '@/sections/auth/AuthOtpVerification';
import Copyright from '@/sections/auth/Copyright';

/***************************  AUTH - OTP VERIFICATION  ***************************/

export default function OtpVerification() {
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const verify = searchParams.get('verify') || 'signup';

  return (
    <Stack
      sx={{
        minHeight: 1,
        width: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 3, sm: 4 }
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 640,
          px: { xs: 3, sm: 2 }
        }}
      >
        <Stack
          sx={{
            gap: { xs: 1, sm: 1.5 },
            textAlign: 'center',
            mb: { xs: 2, sm: 3 }
          }}
        >
          <Box
            component="img"
            src="/assets/images/auth/onc-logo.png"
            alt="ONC"
            sx={{
              width: 240,
              height: 'auto',
              mx: 'auto',
              mb: 0.3
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 20, sm: 22 },
              fontWeight: 700,
              color: '#B40000',
              lineHeight: 1.1,
              mb: 1
            }}
          >
            Sistema Operacional
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 24, sm: 28 },
              lineHeight: 1.2
            }}
          >
            Verifique sua caixa de entrada
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Digite o código enviado para <strong>{email}</strong>
          </Typography>
        </Stack>

        <AuthOtpVerification email={email} verify={verify} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 16, sm: 24 },
          left: 0,
          right: 0
        }}
      >
        <Copyright />
      </Box>
    </Stack>
  );
}
