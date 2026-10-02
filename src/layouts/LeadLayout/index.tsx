'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// @types
import { ChildrenProps } from '@/types/root';

const lightTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#660000'
    }
  }
});

/***************************  LEAD LAYOUT  ***************************/

export default function LeadLayout({ children }: ChildrenProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'grey.50',
          py: 2
        }}
      >
        <Container maxWidth="xl">
          {/* Header with Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              component="img"
              src="/assets/images/auth/onc-logo.png"
              alt="ONC Logo"
              sx={{ height: 50, width: 'auto', mb: 1 }}
            />
            <Typography variant="h5" sx={{ color: '#660000', fontWeight: 'bold' }}>
              Organismo Nacional de Certificação
            </Typography>
          </Box>

          {/* Main Content Card */}
          <Box
            sx={{
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              boxShadow: 1,
              maxWidth: 1200,
              mx: 'auto'
            }}
          >
            {children}
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              © 2025 ONC — Política de Privacidade
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
