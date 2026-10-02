'use client';

// @next
import { useSearchParams } from 'next/navigation';

// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/***************************  PAGE - OBRIGADO  ***************************/

export default function ObrigadoPage() {
  const searchParams = useSearchParams();
  const isCommercial = searchParams.get('commercial') === 'true';

  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        py: 4,
        px: 2
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', maxWidth: 600 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            mb: 2
          }}
        >
          Obrigado por seu interesse nos serviços do ONC!
        </Typography>

        {isCommercial ? (
          <Typography variant="h6" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            Sua solicitação foi enviada com sucesso. Em breve nosso departamento comercial entrará em contato.
          </Typography>
        ) : (
          <Typography variant="h6" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            Em breve receberá um e-mail para completar a sua solicitação.
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          href="https://www.onccertificacao.com.br"
          target="_blank"
          rel="noopener"
          sx={{ mt: 3 }}
          size="large"
        >
          Ir para o site ONC
        </Button>
      </Stack>
    </Box>
  );
}
