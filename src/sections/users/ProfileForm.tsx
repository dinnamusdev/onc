'use client';

import { ChangeEvent, useEffect, useState } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
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
import { IconCamera } from '@tabler/icons-react';

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

/***************************  USER - PROFILE FORM  ***************************/

export default function ProfileForm() {
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

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedPhoto(event.target.files?.[0] ?? null);
  };

  const onSubmit: SubmitHandler<ProfileFormInput> = async (formData) => {
    if (!userId) {
      notify('ID do usuário indisponível.', 'error');
      return;
    }

    setIsSaving(true);

    const userFields = {
      id: userId,
      userName: userData?.userName ?? formData.email,
      email: formData.email,
      nomeCompleto: formData.nomeCompleto,
      whatsapp: formData.whatsapp,
      telefone: formData.telefone,
      cpf: formData.cpf,
      cep: formData.cep,
      logradouro: formData.logradouro,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado
    };

    const updatePayload = selectedPhoto
      ? (() => {
          const payload = new FormData();
          payload.append('id', userId);
          payload.append('UserName', userFields.userName);
          payload.append('Email', userFields.email);
          payload.append('NomeCompleto', userFields.nomeCompleto);
          payload.append('Whatsapp', userFields.whatsapp);
          payload.append('Telefone', userFields.telefone);
          payload.append('Cpf', userFields.cpf);
          payload.append('CEP', userFields.cep);
          payload.append('Logradouro', userFields.logradouro);
          payload.append('Numero', userFields.numero);
          payload.append('Complemento', userFields.complemento);
          payload.append('Bairro', userFields.bairro);
          payload.append('Cidade', userFields.cidade);
          payload.append('Estado', userFields.estado);
          payload.append('isAlteraFoto', 'true');
          payload.append('FotoFile', selectedPhoto);
          return payload;
        })()
      : userFields;

    const { data, error } = await updateUser(updatePayload);

    setIsSaving(false);

    if (error) {
      notify(error, 'error');
      return;
    }

    let updatedProfile = data as User | null;
    if (selectedPhoto) {
      const refreshed = await getUsers({ email: formData.email });
      updatedProfile = (Array.isArray(refreshed.data) ? refreshed.data[0] : refreshed.data) as User | null;
      if (refreshed.error) {
        notify('Perfil salvo, mas não foi possível atualizar a imagem na tela.', 'warning');
      }
    }

    updateAuthUser({
      ...userFields,
      fotoURL: updatedProfile?.fotoURL ?? currentPhotoUrl
    });
    setCurrentPhotoUrl(updatedProfile?.fotoURL ?? currentPhotoUrl);
    setSelectedPhoto(null);
    notify('Perfil atualizado com sucesso!', 'success');
  };

  if (loading) {
    return (
      <MainCard>
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 240, gap: 2 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Carregando perfil...
          </Typography>
        </Stack>
      </MainCard>
    );
  }

  if (loadError) {
    return (
      <MainCard>
        <Alert severity="error">{loadError}</Alert>
      </MainCard>
    );
  }

  return (
    <MainCard>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Meu Perfil</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Complete seus dados pessoais e de contato.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar src={photoPreview ?? (currentPhotoUrl || undefined)} sx={{ width: 72, height: 72 }}>
          <IconCamera size={28} />
        </Avatar>
        <Stack sx={{ gap: 0.75 }}>
          <Typography variant="subtitle1">Foto de perfil</Typography>
          <Button component="label" variant="outlined" size="small" startIcon={<IconCamera size={16} />}>
            Escolher imagem
            <input hidden type="file" accept="image/*" onChange={handlePhotoChange} />
          </Button>
          {selectedPhoto && <Typography variant="caption">{selectedPhoto.name}</Typography>}
        </Stack>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ gap: 2.5 }}>
          <Typography variant="subtitle1">Dados Pessoais</Typography>

          <Box>
            <InputLabel>Nome Completo</InputLabel>
            <OutlinedInput {...register('nomeCompleto')} placeholder="Nome completo" fullWidth />
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel>E-mail</InputLabel>
              <OutlinedInput {...register('email')} placeholder="exemplo@gmail.com" fullWidth readOnly />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel>CPF</InputLabel>
              <OutlinedInput {...register('cpf')} placeholder="000.000.000-00" fullWidth />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel>WhatsApp</InputLabel>
              <OutlinedInput {...register('whatsapp')} placeholder="(00) 00000-0000" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <InputLabel>Telefone</InputLabel>
              <OutlinedInput {...register('telefone')} placeholder="(00) 0000-0000" fullWidth />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1">Endereço</Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <InputLabel>CEP</InputLabel>
              <OutlinedInput {...register('cep')} placeholder="00000-000" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <InputLabel>Logradouro</InputLabel>
              <OutlinedInput {...register('logradouro')} placeholder="Rua, avenida..." fullWidth />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <InputLabel>Número</InputLabel>
              <OutlinedInput {...register('numero')} placeholder="123" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <InputLabel>Complemento</InputLabel>
              <OutlinedInput {...register('complemento')} placeholder="Apto, bloco..." fullWidth />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <InputLabel>Bairro</InputLabel>
              <OutlinedInput {...register('bairro')} placeholder="Bairro" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <InputLabel>Cidade</InputLabel>
              <OutlinedInput {...register('cidade')} placeholder="Cidade" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <InputLabel>UF</InputLabel>
              <OutlinedInput {...register('estado')} placeholder="UF" fullWidth error={Boolean(errors.estado)} />
              {errors.estado?.message && <FormHelperText error>{errors.estado.message}</FormHelperText>}
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </MainCard>
  );
}
