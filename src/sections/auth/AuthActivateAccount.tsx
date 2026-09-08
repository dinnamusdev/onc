'use client';

// react
import { useEffect, useState, useRef } from 'react';

// next
import { useRouter, useSearchParams } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @icons
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

// @project
import { activateAccount } from '@/utils/api/auth';

type ActivationStatus = 'loading' | 'success' | 'error';

/***************************  AUTH - ACTIVATE ACCOUNT  ***************************/

export default function AuthActivateAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<ActivationStatus>('loading');
  const [message, setMessage] = useState('');

  // Evita dupla execução do efeito (React StrictMode em dev).
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

    // O backend monta o link como {url_callback}?IdUsuario=...&Token=...
    const idUsuario = searchParams.get('IdUsuario') || searchParams.get('idUsuario') || '';
    const token =
      searchParams.get('Token') ||
      searchParams.get('token') ||
      searchParams.get('CodigoAtivacao') ||
      searchParams.get('codigoAtivacao') ||
      '';

    if (!idUsuario || !token) {
      setStatus('error');
      setMessage('Link de ativação inválido ou incompleto.');
      return;
    }

    (async () => {
      const { error } = await activateAccount(idUsuario, token);

      if (error) {
        setStatus('error');
        setMessage(error || 'Não foi possível ativar sua conta. O link pode ter expirado.');
      } else {
        setStatus('success');
        setMessage('Sua conta foi ativada com sucesso!');
      }
    })();
  }, [searchParams]);

  const handleGoToLogin = () => {
    router.replace('/login');
  };

  return (
    <Stack sx={{ gap: 2.5, alignItems: 'center', textAlign: 'center' }}>
      <Box
        component="img"
        src="/assets/images/auth/onc-logo.png"
        alt="ONC"
        sx={{
          width: 240,
          height: 'auto',
          mb: 0.3
        }}
      />

      <Typography
        sx={{
          fontSize: { xs: 20, sm: 22 },
          fontWeight: 700,
          color: '#B40000',
          lineHeight: 1.1
        }}
      >
        Sistema Operacional
      </Typography>

      {status === 'loading' && (
        <Stack sx={{ gap: 2, alignItems: 'center', mt: 2 }}>
          <CircularProgress sx={{ color: '#B40000' }} />
          <Typography variant="h1" sx={{ fontSize: { xs: 18, sm: 20 }, lineHeight: 1.3 }}>
            Ativando sua conta...
          </Typography>
        </Stack>
      )}

      {status === 'success' && (
        <Stack sx={{ gap: 1.5, alignItems: 'center', mt: 1 }}>
          <IconCircleCheck size={64} stroke={1.5} color="#2e7d32" />
          <Typography variant="h1" sx={{ fontSize: { xs: 20, sm: 22 }, lineHeight: 1.3 }}>
            {message}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Você já pode acessar o sistema com suas credenciais.
          </Typography>
        </Stack>
      )}

      {status === 'error' && (
        <Stack sx={{ gap: 1.5, alignItems: 'center', mt: 1 }}>
          <IconCircleX size={64} stroke={1.5} color="#B40000" />
          <Typography variant="h1" sx={{ fontSize: { xs: 20, sm: 22 }, lineHeight: 1.3 }}>
            Falha na ativação
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {message}
          </Typography>
        </Stack>
      )}

      {status !== 'loading' && (
        <Button
          fullWidth
          variant="contained"
          onClick={handleGoToLogin}
          sx={{
            height: 38,
            mt: 2,
            borderRadius: 1,
            backgroundColor: '#B40000',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',

            '&:hover': {
              backgroundColor: '#980000',
              boxShadow: 'none'
            }
          }}
        >
          Ir para o login
        </Button>
      )}
    </Stack>
  );
}
