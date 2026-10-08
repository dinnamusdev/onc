'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';

// @types
import { ChildrenProps } from '@/types/root';

// @project
import { LeadFormHeaderProvider, useLeadFormHeader } from '@/contexts/LeadFormHeaderContext';

const lightTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#660000'
    }
  }
});

/***************************  LEAD LAYOUT - CONTENT  ***************************/
// Lê o LeadFormHeaderContext para exibir, dentro do cabeçalho fixo (sticky), o título,
// a frase de aviso e o Stepper publicados pelo formulário multi-step atual (quando houver).

function LeadLayoutContent({ children }: ChildrenProps) {
  const { header, notice, dismissNotice } = useLeadFormHeader();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'grey.50',
        py: 1
      }}
    >
      <Container maxWidth="xl">
        {/* Header fixo: Logo + Nome + (opcional) Título/Frase/Stepper do formulário atual */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'grey.50',
            pt: 1,
            pb: 1.5,
            textAlign: 'center'
          }}
        >
          <Box component="img" src="/assets/images/auth/onc-logo.png" alt="ONC Logo" sx={{ height: 40, width: 'auto', mb: 0.5 }} />
          <Typography variant="subtitle1" sx={{ color: '#660000', fontWeight: 'bold', lineHeight: 1.3 }}>
            Organismo Nacional de Certificação
          </Typography>

          {header.title && (
            <Typography variant="h6" sx={{ mt: 1, lineHeight: 1.3 }}>
              {header.title}
            </Typography>
          )}

          {header.subtitle && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.25, maxWidth: 560, mx: 'auto' }}>
              {header.subtitle}
            </Typography>
          )}

          {header.steps && header.steps.length > 0 && (
            <Stepper activeStep={header.activeStep ?? 0} alternativeLabel sx={{ mt: 1.5, maxWidth: 900, mx: 'auto' }}>
              {header.steps.map((label, index) => (
                <Step key={label}>
                  <StepButton onClick={() => header.onStepClick?.(index)} disabled={!header.onStepClick}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          )}

          {notice && (
            <Alert
              key={notice.id}
              severity="error"
              onClose={dismissNotice}
              sx={{ mt: 1.5, maxWidth: 900, mx: 'auto', textAlign: 'left' }}
            >
              {notice.message}
            </Alert>
          )}
        </Box>

        {/* Main Content Card */}
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
            maxWidth: 1200,
            mx: 'auto'
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © 2025 ONC — Política de Privacidade
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

/***************************  LEAD LAYOUT  ***************************/

export default function LeadLayout({ children }: ChildrenProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <LeadFormHeaderProvider>
        <LeadLayoutContent>{children}</LeadLayoutContent>
      </LeadFormHeaderProvider>
    </ThemeProvider>
  );
}
