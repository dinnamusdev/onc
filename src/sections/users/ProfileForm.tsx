'use client';

import { ChangeEvent, useEffect, useState } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import MainCard from '@/components/MainCard';
import useCurrentUser from '@/hooks/useCurrentUser';
import { getUsers, updateUser } from '@/utils/api/users';
import { openSnackbar } from '@/states/snackbar';

// @types
import { User } from '@/types/users';
import { SnackbarProps } from '@/types/snackbar';
import { IconCamera, IconX } from '@tabler/icons-react';

/***************************  TYPES  ***************************/

interface ProfileFormInput {
  nomeCompleto: string;
  email: string;
  whatsapp: string;
  telefone: string;
  cpf: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const emptyForm: ProfileFormInput = {
  nomeCompleto: '',
  email: '',
  whatsapp: '',
  telefone: '',
  cpf: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: ''
};

interface ProfileFormProps {
  /** Quando fornecido, o formulário renderiza no modo dialog (sem MainCard).
   *  Chamado ao clicar em "Cancelar" ou após salvar com sucesso. */
  onClose?: () => void;
}

/***************************  USER - PROFILE FORM  ***************************/

export default function ProfileForm({ onClose }: ProfileFormProps = {}) {
  const { userData, updateUser: updateAuthUser } = useCurrentUser();

  const notify = (message: string, severity: SnackbarProps['severity']) => {
    openSnackbar({
      open: true,
      message,
      variant: 'alert',
      severity,
      alert: { color: severity }
    } as SnackbarProps);
  };

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<{ message: string; errors?: string[] } | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormInput>({ defaultValues: emptyForm });

  // Carrega o perfil do usuário logado:
  // 1) pega o e-mail das claims do JWT (disponível no AuthContext),
  // 2) busca /api/users?email={email} para obter o registro completo,
  // 3) extrai o `id` e pré-preenche o formulário.
  useEffect(() => {
    const email = userData?.email;
    if (!email) return;

    let active = true;

    (async () => {
      setLoading(true);
      setLoadError('');

      const { data, error } = await getUsers({ email });

      if (!active) return;

      if (error) {
        setLoadError(error || 'Não foi possível carregar o perfil.');
        setLoading(false);
        return;
      }

      const profile: User | undefined = Array.isArray(data) ? data[0] : data;

      if (!profile?.id) {
        setLoadError('Perfil não encontrado para o usuário logado.');
        setLoading(false);
        return;
      }

      setUserId(profile.id);
      setCurrentPhotoUrl(profile.fotoURL ?? '');
      reset({
        nomeCompleto: profile.nomeCompleto ?? '',
        email: profile.email ?? email,
        whatsapp: profile.whatsapp ?? '',
        telefone: profile.telefone ?? '',
        cpf: profile.cpf ?? '',
        cep: profile.cep ?? '',
        logradouro: profile.logradouro ?? '',
        numero: profile.numero ?? '',
        complemento: profile.complemento ?? '',
        bairro: profile.bairro ?? '',
        cidade: profile.cidade ?? '',
        estado: profile.estado ?? ''
      });
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [userData?.email, reset]);

  useEffect(() => {
    if (!selectedPhoto) {
      setPhotoPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedPhoto);
    setPhotoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPhoto]);

  const ACCEPTED_PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
  const MAX_PHOTO_SIZE_BYTES = 256 * 1024; // 256 KB

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    // Limpa o valor para permitir reselecionar o mesmo arquivo após erro
    event.target.value = '';

    if (!file) {
      setPhotoError('');
      setSelectedPhoto(null);
      return;
    }

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError('Formato inválido. Use PNG, JPG ou GIF.');
      setSelectedPhoto(null);
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setPhotoError(`Imagem muito grande (${(file.size / 1024).toFixed(1)} KB). O limite é 256 KB.`);
      setSelectedPhoto(null);
      return;
    }

    setPhotoError('');
    setSelectedPhoto(file);
  };

  const onSubmit: SubmitHandler<ProfileFormInput> = async (formData) => {
    if (!userId) {
      notify('ID do usuário indisponível.', 'error');
      return;
    }

    setSubmitError(null);
    setIsSaving(true);

    // Indica se uma nova imagem foi selecionada pelo usuário nesta sessão de edição.
    // isAlteraFoto só deve ser 'true' quando o usuário escolheu um arquivo novo.
    const photoChanged = selectedPhoto != null;

    const payload = new FormData();
    payload.append('id', userId);
    payload.append('UserName', userData?.userName ?? formData.email);
    payload.append('Email', formData.email);
    payload.append('NomeCompleto', formData.nomeCompleto);
    payload.append('Whatsapp', formData.whatsapp);
    payload.append('Telefone', formData.telefone);
    payload.append('Cpf', formData.cpf);
    payload.append('CEP', formData.cep);
    payload.append('Logradouro', formData.logradouro);
    payload.append('Numero', formData.numero);
    payload.append('Complemento', formData.complemento);
    payload.append('Bairro', formData.bairro);
    payload.append('Cidade', formData.cidade);
    payload.append('Estado', formData.estado);

    // Flag de alteração de foto: somente 'true' quando uma nova imagem foi selecionada.
    payload.append('isAlteraFoto', photoChanged ? 'true' : 'false');
    if (photoChanged) {
      payload.append('FotoFile', selectedPhoto);
    }

    const { data, error, errors } = await updateUser(payload);

    setIsSaving(false);

    if (error) {
      // Se há lista de detalhes, exibe no Alert inline para melhor legibilidade.
      // O snackbar ainda aparece para notificar brevemente.
      if (errors && errors.length > 0) {
        setSubmitError({ message: error, errors });
      } else {
        notify(error, 'error');
      }
      return;
    }

    let updatedProfile = data as User | null;
    if (photoChanged) {
      // Recarrega o perfil para obter a URL atualizada da foto
      const refreshed = await getUsers({ email: formData.email });
      updatedProfile = (Array.isArray(refreshed.data) ? refreshed.data[0] : refreshed.data) as User | null;
      if (refreshed.error) {
        notify('Perfil salvo, mas não foi possível atualizar a imagem na tela.', 'warning');
      }
    }

    updateAuthUser({
      id: userId,
      userName: userData?.userName ?? formData.email,
      email: formData.email,
      nomeCompleto: formData.nomeCompleto,
      whatsapp: formData.whatsapp,
      telefone: formData.telefone,
      cpf: formData.cpf,
      fotoURL: updatedProfile?.fotoURL ?? currentPhotoUrl
    });
    setCurrentPhotoUrl(updatedProfile?.fotoURL ?? currentPhotoUrl);
    setSelectedPhoto(null);
    notify('Perfil atualizado com sucesso!', 'success');
    onClose?.();
  };

  // --- Conteúdo de loading ---
  const loadingContent = (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 240, gap: 2 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Carregando perfil...
      </Typography>
    </Stack>
  );

  if (loading) {
    return onClose ? <DialogContent>{loadingContent}</DialogContent> : <MainCard>{loadingContent}</MainCard>;
  }

  if (loadError) {
    return onClose ? (
      <DialogContent>
        <Alert severity="error">{loadError}</Alert>
      </DialogContent>
    ) : (
      <MainCard>
        <Alert severity="error">{loadError}</Alert>
      </MainCard>
    );
  }

  // --- Seção de foto (compartilhada) ---
  const photoSection = (
    <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 2, mb: 3 }}>
      <Avatar src={photoPreview ?? (currentPhotoUrl || undefined)} sx={{ width: 72, height: 72, flexShrink: 0 }}>
        <IconCamera size={28} />
      </Avatar>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="subtitle1">Foto de perfil</Typography>
        <Button component="label" variant="outlined" size="small" startIcon={<IconCamera size={16} />} sx={{ alignSelf: 'flex-start' }}>
          Escolher imagem
          <input hidden type="file" accept=".png,.jpg,.jpeg,.gif" onChange={handlePhotoChange} />
        </Button>
        <Typography variant="caption" color="text.secondary">
          PNG, JPG ou GIF · máx. 256 KB
        </Typography>
        {selectedPhoto && (
          <Typography variant="caption" color="success.main">
            {selectedPhoto.name}
          </Typography>
        )}
        {photoError && (
          <Typography variant="caption" color="error">
            {photoError}
          </Typography>
        )}
      </Stack>
    </Stack>
  );

  // --- Campos do formulário (compartilhados) ---
  const formFields = (
    <Stack sx={{ gap: 2.5 }}>
      {photoSection}

      <Typography variant="subtitle1">Dados Pessoais</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputLabel>Nome Completo</InputLabel>
          <OutlinedInput {...register('nomeCompleto')} placeholder="Nome completo" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputLabel>CPF</InputLabel>
          <OutlinedInput {...register('cpf')} placeholder="000.000.000-00" fullWidth />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InputLabel>E-mail</InputLabel>
          <OutlinedInput {...register('email')} placeholder="exemplo@gmail.com" fullWidth readOnly />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InputLabel>WhatsApp</InputLabel>
          <OutlinedInput {...register('whatsapp')} placeholder="(00) 00000-0000" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InputLabel>Telefone</InputLabel>
          <OutlinedInput {...register('telefone')} placeholder="(00) 0000-0000" fullWidth />
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle1">Endereço</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 2 }}>
          <InputLabel>CEP</InputLabel>
          <OutlinedInput {...register('cep')} placeholder="00000-000" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InputLabel>Logradouro</InputLabel>
          <OutlinedInput {...register('logradouro')} placeholder="Rua, avenida..." fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <InputLabel>Número</InputLabel>
          <OutlinedInput {...register('numero')} placeholder="123" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InputLabel>Complemento</InputLabel>
          <OutlinedInput {...register('complemento')} placeholder="Apto, bloco..." fullWidth />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5 }}>
          <InputLabel>Bairro</InputLabel>
          <OutlinedInput {...register('bairro')} placeholder="Bairro" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <InputLabel>UF</InputLabel>
          <OutlinedInput {...register('estado')} placeholder="UF" fullWidth error={Boolean(errors.estado)} />
          {errors.estado?.message && <FormHelperText error>{errors.estado.message}</FormHelperText>}
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }}>
          <InputLabel>Cidade</InputLabel>
          <OutlinedInput {...register('cidade')} placeholder="Cidade" fullWidth />
        </Grid>
      </Grid>
    </Stack>
  );

  // --- Alert de erros de submissão (compartilhado) ---
  const submitErrorAlert = submitError && (
    <Alert severity="error" onClose={() => setSubmitError(null)}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {submitError.message}
      </Typography>
      {submitError.errors && submitError.errors.length > 0 && (
        <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
          {submitError.errors.map((msg, i) => (
            <li key={i}>
              <Typography variant="caption">{msg}</Typography>
            </li>
          ))}
        </Box>
      )}
    </Alert>
  );

  // --- Botão de salvar (compartilhado) ---
  const saveButton = (
    <Button
      type="submit"
      variant="contained"
      disabled={isSaving}
      startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
    >
      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
    </Button>
  );

  // === Modo Dialog ===
  if (onClose) {
    return (
      <>
        <Stack
          direction="row"
          sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3 }}
        >
          <Box>
            <DialogTitle sx={{ p: 0, fontSize: 18, fontWeight: 600 }}>Meu Perfil</DialogTitle>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Complete seus dados pessoais e de contato.
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <IconX size={18} />
          </IconButton>
        </Stack>

        <Divider />

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {formFields}
            {submitErrorAlert && <Box sx={{ mt: 2 }}>{submitErrorAlert}</Box>}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} variant="outlined" color="secondary" disabled={isSaving}>
              Cancelar
            </Button>
            {saveButton}
          </DialogActions>
        </form>
      </>
    );
  }

  // === Modo standalone (página /profile) ===
  return (
    <MainCard>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Meu Perfil</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Complete seus dados pessoais e de contato.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ gap: 2.5 }}>
          {formFields}

          {submitErrorAlert}

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            {saveButton}
          </Stack>
        </Stack>
      </form>
    </MainCard>
  );
}
