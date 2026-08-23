'use client';

// next
import { useRouter } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/***************************  AUTH - PASSWORD RESET SUCCESS  ***************************/

export default function AuthPasswordResetSuccess() {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.replace('/login');
  };

  return (
    <Stack sx={{ gap: 2.5, alignItems: 'center', textAlign: 'center' }}>
      <Box
        component="img"
        src="/assets/images/auth/onc-logo.png"
        alt="ONC"
        sx={{
          width: 240,
          height: 'auto',
          mb: 0.3
        }}
      />

      <Typography
        sx={{
          fontSize: { xs: 20, sm: 22 },
          fontWeight: 700,
          color: '#B40000',
          lineHeight: 1.1
        }}
      >
        Sistema Operacional
      </Typography>

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: 20, sm: 22 },
          lineHeight: 1.3,
          mt: 1
        }}
      >
        Senha redefinida com sucesso.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        onClick={handleGoToLogin}
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
          }
        }}
      >
        Voltar ao login
      </Button>
    </Stack>
  );
}