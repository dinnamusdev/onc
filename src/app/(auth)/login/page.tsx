// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import AuthLogin from '@/sections/auth/AuthLogin';
import Copyright from '@/sections/auth/Copyright';

/***************************  AUTH - LOGIN  ***************************/

export default function Login() {
  return (
    <Stack sx={{ height: 1, width: 1, position: 'relative', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          px: { xs: 3, sm: 2 }
        }}
      >
        <Stack sx={{ gap: { xs: 1, sm: 1.5 }, textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Box
            component="img"
            src="/assets/images/auth/onc-logo.png"
            alt="ONC"
            sx={{
              width: 240,
              height: 'auto',
              mx: 'auto',
              mb: 0.5
            }}
          />

          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: '#B40000',
              lineHeight: 1.1,
              mb: 2
            }}
          >
            Sistema Operacional
          </Typography>

          <Typography
            sx={{
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.2,
              color: '#222',
              mb: 1
            }}
          >
            Login
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Bem-vindo de volta!
          </Typography>
        </Stack>

        <AuthLogin />
      </Box>

      <Box sx={{ position: 'absolute', bottom: { xs: 24, sm: 40 }, left: 0, right: 0 }}>
        <Copyright />
      </Box>
    </Stack>
  );
}
