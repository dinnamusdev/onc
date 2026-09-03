// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import AuthForgotPassword from '@/sections/auth/AuthForgotPassword';
import Copyright from '@/sections/auth/Copyright';

/***************************  AUTH - FORGOT PASSWORD  ***************************/

export default function ForgotPassword() {
  return (
    <Stack sx={{ height: 1, position: 'relative', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
      <Box sx={{ width: 1, maxWidth: 560, px: { xs: 3, sm: 2 } }}>
        <Stack sx={{ gap: { xs: 1, sm: 1.5 }, textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
          <Box component="img" src="/assets/images/auth/onc-logo.png" alt="ONC" sx={{ width: 240, height: 'auto', mx: 'auto', mb: 1 }} />
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
          <Typography variant="h1" sx={{ fontSize: { xs: 24, sm: 28 } }}>
            Esqueceu a Senha
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Informe seu e-mail para recuperar sua senha.
          </Typography>
        </Stack>

        <AuthForgotPassword redirectTo="/otp-verification" doRedirect attachEmail />
      </Box>

      <Box sx={{ position: 'absolute', bottom: { xs: 24, sm: 40 }, left: 0, right: 0 }}>
        <Copyright />
      </Box>
    </Stack>
  );
}
