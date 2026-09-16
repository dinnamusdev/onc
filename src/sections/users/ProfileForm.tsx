'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { getAddressByCep } from '@/utils/api/cep';
import { formatCPF, formatCEP, formatPhone } from '@/utils/format';
import { getStateOptions } from '@/data/brazilianStates';
import { getMunicipiosByUf } from '@/utils/api/ibge';

// @mui
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
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
import TextField from '@mui/material/TextField';
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
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [cepError, setCepError] = useState('');
  const [cepMessage, setCepMessage] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
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
    watch,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormInput>({ defaultValues: emptyForm });

const handleCepChange = async (event: ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  const cleanCep = value.replace(/\D/g, '');
  const formatted = formatCEP(value);

  setValue('cep', formatted, {
    shouldDirty: true,
    shouldValidate: true
  });

  setCepError('');
  setCepMessage('');

  if (cleanCep.length !== 8) {
    if (cleanCep.length > 0) {
      setCepMessage('CEP incompleto');
    }
    return;
  }

  try {
    setLoadingCep(true);
    setCepMessage('Procurando endereço...');

    const address = await getAddressByCep(cleanCep);

    setValue('logradouro', address.logradouro || '', {
      shouldDirty: true
    });

    setValue('bairro', address.bairro || '', {
      shouldDirty: true
    });

    setValue('cidade', address.localidade || '', {
      shouldDirty: true
    });

    setValue('estado', address.uf || '', {
      shouldDirty: true
    });

    setCepMessage('');
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao consultar CEP';
    setCepError(errorMessage);
  } finally {
    setLoadingCep(false);
  }
};

const handleCpfChange = (event: ChangeEvent<HTMLInputElement>) => {
  const formatted = formatCPF(event.target.value);
  setValue('cpf', formatted, {
    shouldDirty: true,
    shouldValidate: true
  });
};

const handleWhatsappChange = (event: ChangeEvent<HTMLInputElement>) => {
  const formatted = formatPhone(event.target.value);
  setValue('whatsapp', formatted, {
    shouldDirty: true,
    shouldValidate: true
  });
};

const handleTelefoneChange = (event: ChangeEvent<HTMLInputElement>) => {
  const formatted = formatPhone(event.target.value);
  setValue('telefone', formatted, {
    shouldDirty: true,
    shouldValidate: true
  });
};

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

  // Sincroniza selectedState com o valor do campo "estado" do form
  useEffect(() => {
    const estadoValue = watch('estado');
    setSelectedState(estadoValue || '');
  }, [watch('estado'), watch]);

  // Carrega cidades quando UF muda
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        setLoadingCities(true);
        const municipios = await getMunicipiosByUf(selectedState);
        setCities(municipios);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedState]);

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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputLabel>Nome Completo</InputLabel>
          <OutlinedInput {...register('nomeCompleto')} placeholder="Nome completo" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputLabel>CPF</InputLabel>
          <OutlinedInput {...register('cpf')} placeholder="000.000.000-00" fullWidth onChange={handleCpfChange} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InputLabel>E-mail</InputLabel>
          <OutlinedInput {...register('email')} placeholder="exemplo@gmail.com" fullWidth readOnly />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InputLabel>WhatsApp</InputLabel>
          <OutlinedInput {...register('whatsapp')} placeholder="(00) 00000-0000" fullWidth onChange={handleWhatsappChange} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <InputLabel>Telefone</InputLabel>
          <OutlinedInput {...register('telefone')} placeholder="(00) 0000-0000" fullWidth onChange={handleTelefoneChange} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
 <Grid size={{ xs: 12, sm: 2 }}>
  <InputLabel>CEP</InputLabel>
  <OutlinedInput
  {...register('cep')}
  placeholder="00000-000"
  fullWidth
  onChange={handleCepChange}
  endAdornment={loadingCep ? <CircularProgress size={18} /> : undefined}
  error={Boolean(cepError)}
/>
  {cepError && <FormHelperText error>{cepError}</FormHelperText>}
  {cepMessage && <FormHelperText>{cepMessage}</FormHelperText>}
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
          <Autocomplete
            options={getStateOptions()}
            value={getStateOptions().find((opt) => opt.value === selectedState) || null}
            onChange={(_, option) => {
              const newState = option?.value || '';
              setSelectedState(newState);
              setValue('estado', newState);
              setValue('cidade', '');
            }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option) => option.label}
            inputValue={selectedState}
            onInputChange={() => {}} // Prevent free input
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="UF"
                error={Boolean(errors.estado)}
              />
            )}
            fullWidth
          />
          {errors.estado?.message && <FormHelperText error>{errors.estado.message}</FormHelperText>}
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }}>
          <InputLabel>Cidade</InputLabel>
          <Autocomplete
            options={cities.map((city) => ({ label: city, value: city }))}
            value={cities.map((city) => ({ label: city, value: city })).find((opt) => opt.value === watch('cidade')) || null}
            onChange={(_, option) => {
              setValue('cidade', option?.value || '');
            }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Cidade"
              />
            )}
            fullWidth
            disabled={!selectedState}
            loading={loadingCities}
          />
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
          </Box>
          <IconButton onClick={onClose} size="small">
            <IconX size={18} />
          </IconButton>
        </Stack>

        <Divider />

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              px: 3,
              py: 2.5,
              overflowY: 'hidden',
              overflowX: 'hidden'
            }}
          >
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
