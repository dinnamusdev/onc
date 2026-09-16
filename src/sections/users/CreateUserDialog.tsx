'use client';

import { ChangeEvent, useEffect, useState, SyntheticEvent } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import useSWR from 'swr';

// @icons
import { IconCamera, IconEye, IconEyeOff, IconPlus, IconX } from '@tabler/icons-react';

// @project
import { emailSchema } from '@/utils/validation-schema/common';
import { createUser, updateUser, getUsers } from '@/utils/api/users';
import { getAddressByCep } from '@/utils/api/cep';
import { formatCPF, formatCEP, formatPhone } from '@/utils/format';
import { getStateOptions } from '@/data/brazilianStates';
import { getMunicipiosByUf } from '@/utils/api/ibge';
import { openSnackbar } from '@/states/snackbar';

// @types
import { SnackbarProps } from '@/types/snackbar';

/***************************  TYPES  ***************************/

// Usuário em edição (subconjunto do UserResponseDTO retornado pelo backend).
export interface EditableUser {
  id: string;
  userName?: string;
  email?: string;
  nomeCompleto?: string;
  cpf?: string;
  whatsapp?: string;
  telefone?: string;
  isAtivo?: boolean;
  fotoURL?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  roles?: string[];
}

interface UserFormInput {
  // Dados básicos (register-account)
  userName: string;
  email: string;
  password: string;
  rePassword: string;
  isAtivo: boolean;
  // Dados cadastrais (PUT /auth/api/Users) — usados apenas na edição
  nomeCompleto: string;
  cpf: string;
  whatsapp: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: unknown) => void;
  onUpdated?: (data: unknown) => void;
  // Quando fornecido, o diálogo entra em modo de edição.
  user?: EditableUser | null;
}

const emptyValues: UserFormInput = {
  userName: '',
  email: '',
  password: '',
  rePassword: '',
  isAtivo: true,
  nomeCompleto: '',
  cpf: '',
  whatsapp: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: ''
};

/***************************  USERS - CREATE / EDIT DIALOG  ***************************/

export default function CreateUserDialog({ open, onClose, onCreate, onUpdated, user }: CreateUserDialogProps) {
  const isEditMode = Boolean(user?.id);

  const [tab, setTab] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // Estados de foto — somente relevantes no modo edição
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Estados de CEP — autofill com mensagens
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepMessage, setCepMessage] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<UserFormInput>({ defaultValues: emptyValues });

  // Preenche o formulário ao abrir (edição) ou limpa (criação).
  useEffect(() => {
    if (!open) return;
    setTab(0);
    setSubmitError('');
    setSelectedPhoto(null);
    setPhotoPreview(null);

    if (user?.id) {
      setCurrentPhotoUrl(user.fotoURL ?? '');
      reset({
        ...emptyValues,
        userName: user.userName ?? '',
        email: user.email ?? '',
        isAtivo: user.isAtivo ?? true,
        nomeCompleto: user.nomeCompleto ?? '',
        cpf: user.cpf ?? '',
        whatsapp: user.whatsapp ?? '',
        telefone: user.telefone ?? '',
        cep: user.cep ?? '',
        logradouro: user.logradouro ?? '',
        numero: user.numero ?? '',
        complemento: user.complemento ?? '',
        bairro: user.bairro ?? '',
        cidade: user.cidade ?? '',
        estado: user.estado ?? ''
      });
    } else {
      setCurrentPhotoUrl('');
      reset(emptyValues);
    }
    setCepError('');
    setCepMessage('');
    setLoadingCep(false);
  }, [open, user, reset]);

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

  // Gera/revoga URL de preview a cada vez que um novo arquivo é escolhido.
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

  const handleClose = () => {
    reset(emptyValues);
    setSubmitError('');
    setTab(0);
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setCepError('');
    setCepMessage('');
    setLoadingCep(false);
    onClose();
  };

  const handleTabChange = (_event: SyntheticEvent, value: number) => setTab(value);

  const onSubmit: SubmitHandler<UserFormInput> = async (data) => {
    setSubmitError('');

    if (isEditMode && user?.id) {
      // ------- EDIÇÃO: PUT /auth/api/Users (multipart/form-data) -------
      setIsSubmitting(true);

      // isAlteraFoto somente 'true' quando o usuário escolheu uma nova imagem.
      const photoChanged = selectedPhoto != null;

      const fd = new FormData();
      fd.append('id', user.id);
      fd.append('UserName', data.userName.trim() || user.userName || data.email);
      fd.append('Email', data.email);
      fd.append('NomeCompleto', data.nomeCompleto.trim());
      fd.append('Cpf', data.cpf);
      fd.append('Whatsapp', data.whatsapp);
      fd.append('Telefone', data.telefone);
      fd.append('CEP', data.cep);
      fd.append('Logradouro', data.logradouro);
      fd.append('Numero', data.numero);
      fd.append('Complemento', data.complemento);
      fd.append('Bairro', data.bairro);
      fd.append('Cidade', data.cidade);
      fd.append('Estado', data.estado);
      fd.append('IsAtivo', String(data.isAtivo));
      fd.append('isAlteraFoto', photoChanged ? 'true' : 'false');
      if (photoChanged) {
        fd.append('FotoFile', selectedPhoto);
      }

      const { data: response, error } = await updateUser(fd);

      setIsSubmitting(false);

      if (error) {
        setSubmitError(error || 'Não foi possível atualizar o usuário.');
        return;
      }

      // Mensagem de sucesso
      openSnackbar({
        open: true,
        message: 'Usuário atualizado com sucesso!',
        variant: 'alert',
        severity: 'success',
        alert: { color: 'success' }
      } as SnackbarProps);

      // Atualiza a URL da foto exibida se uma nova imagem foi salva
      if (photoChanged) {
        const refreshed = await getUsers({ email: data.email });
        const refreshedUser = (Array.isArray(refreshed.data) ? refreshed.data[0] : refreshed.data) as { fotoURL?: string } | null;
        setCurrentPhotoUrl(refreshedUser?.fotoURL ?? currentPhotoUrl);
        setSelectedPhoto(null);
      }

      onUpdated?.(response ?? data);
      handleClose();
      return;
    }

    // ------- CRIAÇÃO: POST /auth/api/Register/register-account -------
    if (data.password !== data.rePassword) {
      setSubmitError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);

    const { data: response, error } = await createUser({
      userName: data.userName.trim() || data.email,
      email: data.email,
      password: data.password,
      rePassword: data.rePassword
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error || 'Não foi possível criar o usuário.');
      return;
    }

    // Mensagem de sucesso
    openSnackbar({
      open: true,
      message: 'Usuário criado com sucesso!',
      variant: 'alert',
      severity: 'success',
      alert: { color: 'success' }
    } as SnackbarProps);

    onCreate?.(response ?? data);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'unset'
        }
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: 3,
          pt: 3,
          pb: 2.5
        }}
      >
        <Box>
          <DialogTitle
            sx={{
              p: 0,
              fontSize: 22,
              lineHeight: 1.3,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            {isEditMode ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
          </DialogTitle>

          {isEditMode && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 14
              }}
            >
              Atualize os dados básicos e as informações cadastrais do usuário.
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            width: 44,
            height: 44,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            flexShrink: 0
          }}
        >
          <IconX size={19} />
        </IconButton>
      </Stack>

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {/* Campos falsos para impedir o autofill do navegador de preencher os reais */}
        <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
        <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />

        {/* ABAS — padrão do form de papéis e permissões */}
        <Tabs value={tab} onChange={handleTabChange} sx={{ px: 3, pt: 2 }}>
          <Tab label="Dados Básicos" />
          {isEditMode && <Tab label="Dados Cadastrais" />}
        </Tabs>

        <DialogContent
          sx={{
            px: 3,
            py: 2.5,
            overflowY: 'hidden',
            overflowX: 'hidden'
          }}
        >
          {/* ===================== ABA 1: DADOS BÁSICOS ===================== */}
          <Stack sx={{ gap: 2.5, display: tab === 0 ? 'flex' : 'none' }}>
            <Box>
              <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Nome de usuário *</InputLabel>
              <OutlinedInput
                {...register('userName', { required: 'O nome de usuário é obrigatório' })}
                placeholder="ex. john.doe"
                fullWidth
                autoComplete="off"
                error={Boolean(errors.userName)}
                sx={{
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: 'background.paper'
                }}
              />
              {errors.userName?.message && <FormHelperText error>{errors.userName.message}</FormHelperText>}
            </Box>

            <Box>
              <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>E-mail *</InputLabel>
              <OutlinedInput
                {...register('email', emailSchema)}
                placeholder="exemplo@gmail.com"
                fullWidth
                autoComplete="off"
                error={Boolean(errors.email)}
                sx={{
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: 'background.paper'
                }}
              />
              {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </Box>

            {/* Status (Ativo/Bloqueado) */}
            <Box>
              <InputLabel sx={{ mb: 1, fontSize: 14, color: 'text.primary' }}>Status</InputLabel>
              <RadioGroup
                row
                value={watch('isAtivo') ? 'ativo' : 'bloqueado'}
                onChange={(event) => setValue('isAtivo', event.target.value === 'ativo')}
                sx={{ gap: 2, flexWrap: 'wrap' }}
              >
                <FormControlLabel value="ativo" control={<Radio size="small" />} label="Ativo" />
                <FormControlLabel value="bloqueado" control={<Radio size="small" />} label="Bloqueado" />
              </RadioGroup>
            </Box>

            {/* Senha — apenas na criação (register-account) */}
            {!isEditMode && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Senha *</InputLabel>
                  <OutlinedInput
                    {...register('password', { required: !isEditMode ? 'A senha é obrigatória' : false })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    fullWidth
                    autoComplete="new-password"
                    error={Boolean(errors.password)}
                    endAdornment={
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </IconButton>
                    }
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper',
                      pr: 0.5
                    }}
                  />
                  {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Confirmar Senha *</InputLabel>
                  <OutlinedInput
                    {...register('rePassword', { required: !isEditMode ? 'A confirmação de senha é obrigatória' : false })}
                    type={showRePassword ? 'text' : 'password'}
                    placeholder="Confirmar Senha"
                    fullWidth
                    autoComplete="new-password"
                    error={Boolean(errors.rePassword)}
                    endAdornment={
                      <IconButton
                        onClick={() => setShowRePassword(!showRePassword)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showRePassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </IconButton>
                    }
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper',
                      pr: 0.5
                    }}
                  />
                  {errors.rePassword?.message && <FormHelperText error>{errors.rePassword.message}</FormHelperText>}
                </Grid>
              </Grid>
            )}
          </Stack>

          {/* ===================== ABA 2: DADOS CADASTRAIS (edição) ===================== */}
          {isEditMode && (
            <Stack sx={{ gap: 2.5, display: tab === 1 ? 'flex' : 'none' }}>
              {/* Foto de perfil */}
              <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  src={photoPreview ?? (currentPhotoUrl || undefined)}
                  sx={{ width: 72, height: 72, flexShrink: 0 }}
                >
                  <IconCamera size={28} />
                </Avatar>
                <Stack sx={{ gap: 0.5 }}>
                  <Typography variant="subtitle1">Foto de perfil</Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<IconCamera size={16} />}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Escolher imagem
                    <input hidden type="file" accept="image/*" onChange={handlePhotoChange} />
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG ou GIF · máx. 256 KB
                  </Typography>
                  {selectedPhoto && (
                    <Typography variant="caption" color="success.main">
                      {selectedPhoto.name}
                    </Typography>
                  )}
                </Stack>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Nome Completo</InputLabel>
                  <OutlinedInput
                    {...register('nomeCompleto')}
                    placeholder="Nome completo"
                    fullWidth
                    autoComplete="off"
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>CPF</InputLabel>
                  <OutlinedInput
                    {...register('cpf')}
                    placeholder="000.000.000-00"
                    fullWidth
                    autoComplete="off"
                    onChange={handleCpfChange}
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>E-mail</InputLabel>
                  <OutlinedInput
                    {...register('email')}
                    placeholder="exemplo@gmail.com"
                    fullWidth
                    autoComplete="off"
                    readOnly
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>WhatsApp</InputLabel>
                  <OutlinedInput
                    {...register('whatsapp')}
                    placeholder="(00) 00000-0000"
                    fullWidth
                    autoComplete="off"
                    onChange={handleWhatsappChange}
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Telefone</InputLabel>
                  <OutlinedInput
                    {...register('telefone')}
                    placeholder="(00) 0000-0000"
                    fullWidth
                    autoComplete="off"
                    onChange={handleTelefoneChange}
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>CEP</InputLabel>
                  <OutlinedInput
                    {...register('cep')}
                    placeholder="00000-000"
                    fullWidth
                    onChange={handleCepChange}
                    autoComplete="off"
                    error={Boolean(cepError)}
                    endAdornment={loadingCep ? <CircularProgress size={18} /> : undefined}
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                  {cepError && <FormHelperText error>{cepError}</FormHelperText>}
                  {cepMessage && <FormHelperText>{cepMessage}</FormHelperText>}
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Logradouro</InputLabel>
                  <OutlinedInput
                    {...register('logradouro')}
                    placeholder="Rua, avenida..."
                    fullWidth
                    autoComplete="off"
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Número</InputLabel>
                  <OutlinedInput
                    {...register('numero')}
                    placeholder="123"
                    fullWidth
                    autoComplete="off"
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Complemento</InputLabel>
                  <OutlinedInput
                    {...register('complemento')}
                    placeholder="Apto, bloco..."
                    fullWidth
                    autoComplete="off"
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Bairro</InputLabel>
                  <OutlinedInput
                    {...register('bairro')}
                    placeholder="Bairro"
                    fullWidth
                    autoComplete="off"
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'background.paper'
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>UF</InputLabel>
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
                        autoComplete="off"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 40,
                            borderRadius: 1.5,
                            backgroundColor: 'background.paper'
                          }
                        }}
                      />
                    )}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <InputLabel sx={{ mb: 0.75, fontSize: 14, color: 'text.primary' }}>Cidade</InputLabel>
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
                        autoComplete="off"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 40,
                            borderRadius: 1.5,
                            backgroundColor: 'background.paper'
                          }
                        }}
                      />
                    )}
                    fullWidth
                    disabled={!selectedState}
                    loading={loadingCities}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 1.5
          }}
        >
          {submitError && <Alert severity="error">{submitError}</Alert>}

          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
            <Button
              onClick={handleClose}
              color="secondary"
              variant="outlined"
              disabled={isSubmitting}
              sx={{
                minWidth: 108,
                height: 44,
                borderRadius: 1.5
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{
                minWidth: 170,
                height: 44,
                borderRadius: 1.5
              }}
            >
              {isSubmitting ? (isEditMode ? 'Salvando...' : 'Criando...') : isEditMode ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
