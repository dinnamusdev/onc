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
    <Stack sx={{ height: 1, width: 1, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 560, px: { xs: 3, sm: 2 } }}>
        <Stack sx={{ gap: { xs: 1, sm: 1.5 }, textAlign: 'center', mb: { xs: 3, sm: 8 } }}>
          <Box component="img" src="/assets/images/auth/onc-logo.png" alt="ONC" sx={{ width: 250, height: 'auto', mx: 'auto', mb: 1 }} />
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
          <Typography variant="h1" sx={{ fontSize: { xs: 28, sm: 34 } }}>
            Login
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bem-vindo de volta!
          </Typography>
        </Stack>

        {/* Login form */}
        <AuthLogin />
      </Box>

      {/* Copyright section*/}
      <Box sx={{ mb: { xs: 3, sm: 5 } }}>
        <Copyright />
      </Box>
    </Stack>
  );
}
