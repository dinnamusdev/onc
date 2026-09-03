// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import AuthPasswordRecovery from '@/sections/auth/AuthPasswordRecovery';
import Copyright from '@/sections/auth/Copyright';

/***************************  AUTH - PASSWORD RECOVERY  ***************************/

export default function PasswordRecovery() {
  return (
    <Stack
      sx={{
        height: 1,
        width: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
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
          {/* LOGO */}
          <Box
            component="img"
            src="/assets/images/auth/onc-logo.png"
            alt="ONC"
            sx={{
              width: 240,
              height: 'auto',
              mx: 'auto',
              mb: 0
            }}
          />

          {/* SISTEMA OPERACIONAL */}
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 700,
              color: '#B40000',
              lineHeight: 1.1,
              mt: -1
            }}
          >
            Sistema Operacional
          </Typography>

          {/* TÍTULO */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 24, sm: 28 },
              lineHeight: 1.2,
              mt: 1
            }}
          >
            Recuperar Senha
          </Typography>

          {/* DESCRIÇÃO */}
          <Typography variant="body1" color="text.secondary">
            Redefina sua senha digitando uma nova
          </Typography>
        </Stack>

        {/* FORMULÁRIO */}
        <AuthPasswordRecovery />
      </Box>

      {/* COPYRIGHT */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 24, sm: 40 },
          left: 0,
          right: 0
        }}
      >
        <Copyright />
      </Box>
    </Stack>
  );
}
