'use client';

// react
import { Suspense } from 'react';

// @mui
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

// @project
import AuthActivateAccount from '@/sections/auth/AuthActivateAccount';
import Copyright from '@/sections/auth/Copyright';

/***************************  AUTH - ACTIVATE ACCOUNT  ***************************/

export default function ActivateAccount() {
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
        <Suspense
          fallback={
            <Stack sx={{ alignItems: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#B40000' }} />
            </Stack>
          }
        >
          <AuthActivateAccount />
        </Suspense>
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
