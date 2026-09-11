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
import { IconCamera, IconPlus, IconX } from '@tabler/icons-react';

// @project
import { emailSchema } from '@/utils/validation-schema/common';
import { createUser, updateUser, getUsers } from '@/utils/api/users';
import { getRoles, assignRolesToUser } from '@/utils/api/rbac';

/***************************  TYPES  ***************************/

// Opção de perfil (papel) exibida no Autocomplete.
interface RoleOption {
  id: string;
  label: string;
}

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
  roles: string[];
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
  roles: [],
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

  // Estados de foto — somente relevantes no modo edição
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<UserFormInput>({ defaultValues: emptyValues });

  // Carrega a lista de papéis para o Autocomplete de perfis.
  const { data: roleOptions, isLoading: rolesLoading } = useSWR<RoleOption[]>('/api/rbac/roles', async () => {
    const { data, error } = await getRoles();
    if (error) throw new Error(error);
    const list = (Array.isArray(data) ? data : []) as Array<Record<string, unknown>>;
    return list.map((r) => ({
      id: String(r.id ?? ''),
      label: String(r.name || r.roleName || r.nome || r.id || '')
    }));
  });

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
        roles: user.roles ?? [],
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
  }, [open, user, reset]);

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

  const handleClose = () => {
    reset(emptyValues);
    setSubmitError('');
    setTab(0);
    setSelectedPhoto(null);
    setPhotoPreview(null);
    onClose();
  };

  const handleTabChange = (_event: SyntheticEvent, value: number) => setTab(value);

  // Resolve os ids dos papéis selecionados (Autocomplete guarda os rótulos).
  const resolveSelectedRoleIds = (labels: string[]) => (roleOptions ?? []).filter((r) => labels.includes(r.label)).map((r) => r.id);

  const onSubmit: SubmitHandler<UserFormInput> = async (data) => {
    setSubmitError('');
    const selectedRoleIds = resolveSelectedRoleIds(data.roles);

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

      if (!error && selectedRoleIds.length > 0) {
        await assignRolesToUser({ userId: user.id, roles: selectedRoleIds });
      }

      setIsSubmitting(false);

      if (error) {
        setSubmitError(error || 'Não foi possível atualizar o usuário.');
        return;
      }

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

    // Para vincular os perfis, precisamos do id do usuário recém-criado.
    // O register-account retorna apenas uma mensagem, então buscamos por e-mail.
    if (!error && selectedRoleIds.length > 0) {
      const { data: usersData } = await getUsers({ email: data.email });
      const created = Array.isArray(usersData) ? (usersData[0] as Record<string, unknown> | undefined) : undefined;
      const newUserId = created?.id ? String(created.id) : '';
      if (newUserId) {
        await assignRolesToUser({ userId: newUserId, roles: selectedRoleIds });
      }
    }

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error || 'Não foi possível criar o usuário.');
      return;
    }

    onCreate?.(response ?? data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Stack
        direction="row"
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: 3,
          pt: 3
        }}
      >
        <Box>
          <DialogTitle sx={{ p: 0, fontSize: 18, fontWeight: 600 }}>{isEditMode ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {isEditMode
              ? 'Atualize os dados básicos e as informações cadastrais do usuário.'
              : 'Cadastro básico. O usuário receberá um e-mail para ativar a conta e completar o perfil.'}
          </Typography>
        </Box>

        <IconButton onClick={handleClose} size="small">
          <IconX size={18} />
        </IconButton>
      </Stack>

      {/* ABAS — padrão do form de papéis e permissões */}
      <Tabs value={tab} onChange={handleTabChange} sx={{ px: 3, mt: 1 }}>
        <Tab label="Dados Básicos" />
        {isEditMode && <Tab label="Dados Cadastrais" />}
      </Tabs>

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {/* Campos falsos para impedir o autofill do navegador de preencher os reais */}
        <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
        <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />

        <DialogContent>
          {/* ===================== ABA 1: DADOS BÁSICOS ===================== */}
          <Stack sx={{ gap: 2.5, display: tab === 0 ? 'flex' : 'none' }}>
            <Box>
              <InputLabel>Nome de usuário *</InputLabel>
              <OutlinedInput
                {...register('userName', { required: 'O nome de usuário é obrigatório' })}
                placeholder="ex. john.doe"
                fullWidth
                autoComplete="off"
                error={Boolean(errors.userName)}
              />
              {errors.userName?.message && <FormHelperText error>{errors.userName.message}</FormHelperText>}
            </Box>

            <Box>
              <InputLabel>E-mail *</InputLabel>
              <OutlinedInput
                {...register('email', emailSchema)}
                placeholder="exemplo@gmail.com"
                fullWidth
                autoComplete="off"
                error={Boolean(errors.email)}
              />
              {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </Box>

            {/* Perfis (papéis) que o usuário vai pertencer */}
            <Box>
              <InputLabel sx={{ mb: 1 }}>Perfis</InputLabel>
              {rolesLoading ? (
                <CircularProgress size={20} />
              ) : (
                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={(roleOptions ?? []).map((r) => r.label)}
                      value={field.value}
                      onChange={(_event, value) => field.onChange(value)}
                      noOptionsText="Nenhum perfil encontrado"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={field.value.length ? '' : '+ Atribuir Perfis'}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment:
                              field.value.length === 0 ? <IconPlus size={16} style={{ marginLeft: 8 }} /> : params.InputProps.startAdornment
                          }}
                        />
                      )}
                    />
                  )}
                />
              )}
            </Box>

            {/* Status (Ativo/Bloqueado) */}
            <Box>
              <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
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
                  <InputLabel>Senha *</InputLabel>
                  <OutlinedInput
                    {...register('password', { required: !isEditMode ? 'A senha é obrigatória' : false })}
                    type="password"
                    placeholder="Senha"
                    fullWidth
                    autoComplete="new-password"
                    error={Boolean(errors.password)}
                  />
                  {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel>Confirmar Senha *</InputLabel>
                  <OutlinedInput
                    {...register('rePassword', { required: !isEditMode ? 'A confirmação de senha é obrigatória' : false })}
                    type="password"
                    placeholder="Confirmar Senha"
                    fullWidth
                    autoComplete="new-password"
                    error={Boolean(errors.rePassword)}
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
              <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={photoPreview ?? (currentPhotoUrl || undefined)}
                  sx={{ width: 72, height: 72 }}
                >
                  <IconCamera size={28} />
                </Avatar>
                <Stack sx={{ gap: 0.75 }}>
                  <Typography variant="subtitle2">Foto de perfil</Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<IconCamera size={16} />}
                  >
                    {currentPhotoUrl || photoPreview ? 'Alterar imagem' : 'Escolher imagem'}
                    <input hidden type="file" accept="image/*" onChange={handlePhotoChange} />
                  </Button>
                  {selectedPhoto && (
                    <Typography variant="caption" color="text.secondary">
                      {selectedPhoto.name}
                    </Typography>
                  )}
                </Stack>
              </Stack>

              <Divider />

              <Box>
                <InputLabel>Nome Completo</InputLabel>
                <OutlinedInput {...register('nomeCompleto')} placeholder="Nome completo" fullWidth autoComplete="off" />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel>CPF</InputLabel>
                  <OutlinedInput {...register('cpf')} placeholder="000.000.000-00" fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel>WhatsApp</InputLabel>
                  <OutlinedInput {...register('whatsapp')} placeholder="(00) 00000-0000" fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel>Telefone</InputLabel>
                  <OutlinedInput {...register('telefone')} placeholder="(00) 0000-0000" fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel>CEP</InputLabel>
                  <OutlinedInput {...register('cep')} placeholder="00000-000" fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 8 }}>
                  <InputLabel>Logradouro</InputLabel>
                  <OutlinedInput {...register('logradouro')} placeholder="Rua, avenida..." fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <InputLabel>Número</InputLabel>
                  <OutlinedInput {...register('numero')} placeholder="123" fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel>Complemento</InputLabel>
                  <OutlinedInput {...register('complemento')} placeholder="Apto, bloco..." fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel>Bairro</InputLabel>
                  <OutlinedInput {...register('bairro')} placeholder="Bairro" fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 8 }}>
                  <InputLabel>Cidade</InputLabel>
                  <OutlinedInput {...register('cidade')} placeholder="Cidade" fullWidth autoComplete="off" />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <InputLabel>Estado</InputLabel>
                  <OutlinedInput {...register('estado')} placeholder="UF" fullWidth autoComplete="off" />
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

          <Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleClose} color="secondary" variant="outlined" disabled={isSubmitting}>
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSubmitting ? (isEditMode ? 'Salvando...' : 'Criando...') : isEditMode ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
