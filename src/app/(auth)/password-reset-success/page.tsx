'use client';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// @project
import AuthPasswordResetSuccess from '@/sections/auth/AuthPasswordResetSuccess';
import Copyright from '@/sections/auth/Copyright';

/***************************  AUTH - PASSWORD RESET SUCCESS  ***************************/

export default function PasswordResetSuccess() {
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
        <AuthPasswordResetSuccess />
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