'use client';

import { useState } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
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
import CircularProgress from '@mui/material/CircularProgress';

// @third-party
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import useSWR from 'swr';

// @icons
import { IconPlus, IconX } from '@tabler/icons-react';

// @project
import { getPermissions, createRole, assignPermission, assignRolesToUser } from '@/utils/api/rbac';
import { getUsers } from '@/utils/api/users';
import { Permission } from '@/types/rbac';

/***************************  HELPERS  ***************************/

// Representa um usuário no formato retornado pelo backend (UserResponseDTO).
interface UserOption {
  id: string;
  label: string;
}

// Gera um rótulo estável para a permissão. O backend novo modela permissões como
// subject + action (o campo `name` pode vir vazio), então priorizamos essa combinação.
const permissionLabel = (p: Permission): string => {
  if (p.subject || p.action) {
    return [p.subject, p.action].filter(Boolean).join('.');
  }
  return p.name ?? String(p.id);
};

/***************************  TYPES  ***************************/

interface CreateRoleFormInput {
  name: string;
  description: string;
  permissions: string[];
  users: string[];
}

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: CreateRoleFormInput) => void;
}

/***************************  ROLES - CREATE DIALOG  ***************************/

export default function CreateRoleDialog({ open, onClose, onCreate }: CreateRoleDialogProps) {
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<CreateRoleFormInput>({
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
      users: []
    }
  });

  // Buscar permissions da API
  const {
    data: permissions,
    error: permissionsError,
    isLoading: permissionsLoading
  } = useSWR<Permission[]>('/api/rbac/permissions', async () => {
    const { data, error } = await getPermissions();
    if (error) throw new Error(error);
    return (data ?? []) as Permission[];
  });

  // Buscar usuários da API para permitir atribuição ao papel.
  const { data: userOptions, isLoading: usersLoading } = useSWR<UserOption[]>('/api/users', async () => {
    const { data, error } = await getUsers();
    if (error) throw new Error(error);
    const list = (Array.isArray(data) ? data : []) as Array<Record<string, unknown>>;
    return list.map((u) => ({
      id: String(u.id ?? ''),
      label: String(u.nomeCompleto || u.userName || u.email || u.id || '')
    }));
  });

  const handleClose = () => {
    reset();
    setSubmitError('');
    onClose();
  };

  const onSubmit: SubmitHandler<CreateRoleFormInput> = async (data) => {
    setSubmitError('');
    setIsSubmitting(true);

    // 1) Cria o papel (POST /auth/api/Permission/roles).
    const { data: created, error: createError } = await createRole({
      name: data.name,
      description: data.description
    });

    if (createError) {
      setIsSubmitting(false);
      setSubmitError(createError || 'Não foi possível criar o papel.');
      return;
    }

    // 2) Se houver permissões selecionadas, associa ao papel recém-criado.
    const roleId = (created as { id?: string | number } | null)?.id;
    const selectedPermissionIds = (permissions ?? []).filter((p) => data.permissions.includes(permissionLabel(p))).map((p) => p.id);

    if (roleId != null && selectedPermissionIds.length > 0) {
      const { error: assignError } = await assignPermission({
        roleId,
        permissions: selectedPermissionIds
      });

      if (assignError) {
        setIsSubmitting(false);
        setSubmitError(assignError || 'Papel criado, mas falhou ao associar permissões.');
        return;
      }
    }

    // 3) Se houver usuários selecionados, vincula o papel a cada um deles
    //    (PUT /auth/api/Permission/user-roles).
    const selectedUserIds = (userOptions ?? []).filter((u) => data.users.includes(u.label)).map((u) => u.id);

    if (roleId != null && selectedUserIds.length > 0) {
      const results = await Promise.all(selectedUserIds.map((userId) => assignRolesToUser({ userId, roles: [roleId] })));

      const firstUserError = results.find((r) => r.error)?.error;
      if (firstUserError) {
        setIsSubmitting(false);
        setSubmitError(firstUserError || 'Papel criado, mas falhou ao associar usuários.');
        return;
      }
    }

    setIsSubmitting(false);
    onCreate?.(created ?? data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3 }}>
        <Box>
          <DialogTitle sx={{ p: 0, fontSize: 18, fontWeight: 600 }}>Adicionar Papéis</DialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Descreva as responsabilidades e o nível de autoridade deste papel.
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <IconX size={18} />
        </IconButton>
      </Stack>

      <Divider sx={{ mt: 2 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack sx={{ gap: 2.5 }}>
            <Typography variant="subtitle1">Informação Geral</Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Papel</InputLabel>
                <OutlinedInput
                  {...register('name', { required: 'O nome do papel é obrigatório' })}
                  placeholder="Insira o nome do papel ex. Super Admin"
                  fullWidth
                  error={Boolean(errors.name)}
                />
                {errors.name?.message && <FormHelperText error>{errors.name.message}</FormHelperText>}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Descrição</InputLabel>
                <TextField {...register('description')} placeholder="Adicione uma descrição" fullWidth multiline minRows={3} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 1 }}>Permissão (Opcional)</InputLabel>
                {permissionsLoading ? (
                  <CircularProgress size={20} />
                ) : permissionsError ? (
                  <Typography color="error">Erro ao carregar permissões</Typography>
                ) : (
                  <Controller
                    name="permissions"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={permissions?.map((p) => permissionLabel(p)) || []}
                        value={field.value}
                        onChange={(_event, value) => field.onChange(value)}
                        noOptionsText="Nenhuma permissão encontrada"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={field.value.length ? '' : '+ Atribuir Permissões'}
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
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 1 }}>Usuários (Opcional)</InputLabel>
                {usersLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Controller
                    name="users"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={(userOptions ?? []).map((u) => u.label)}
                        value={field.value}
                        onChange={(_event, value) => field.onChange(value)}
                        noOptionsText="Nenhum usuário encontrado"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={field.value.length ? '' : '+ Atribuir Usuários'}
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
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, flexDirection: 'column', alignItems: 'stretch', gap: 1.5 }}>
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
              {isSubmitting ? 'Criando...' : 'Criar Papel'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
