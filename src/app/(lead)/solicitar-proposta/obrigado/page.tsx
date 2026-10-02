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
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Obrigado por seu interesse nos serviços do ONC!
        </Typography>

        {isCommercial ? (
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500 }}>
            Sua solicitação foi enviada com sucesso. Em breve nosso departamento comercial entrará em contato.
          </Typography>
        ) : (
          <>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500 }}>
              Em breve receberá um e-mail para completar a sua solicitação.
            </Typography>
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          href="https://www.onccertificacao.com.br"
          target="_blank"
          rel="noopener"
          sx={{ mt: 2 }}
        >
          Ir para o site ONC
        </Button>
      </Stack>
    </Box>
  );
}
