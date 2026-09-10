'use client';

import { useState, useMemo } from 'react';

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
import { getPermissions, getSubjects, getActions, getRoles, createRole, assignPermission, assignRolesToUser } from '@/utils/api/rbac';
import { Permission } from '@/types/rbac';

/***************************  HELPERS  ***************************/

// Formato padronizado de usuário usado em toda a tela de roles/permissions.
// A propriedade `name` já vem resolvida como nomeCompleto → userName → email → id.
export interface UserOption {
  id: string;
  name: string;
  username: string;
}

type LookupMap = Map<number, string>;

/***************************  TYPES  ***************************/

interface CreateRoleFormInput {
  name: string;
  description: string;
  permissions: string[];
  users: string[]; // array de IDs de usuário
}

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: CreateRoleFormInput) => void;
  // Recebe os usuários já normalizados da view pai (evita SWR duplicado e cache collision)
  userOptions?: UserOption[];
  usersLoading?: boolean;
}

/***************************  ROLES - CREATE DIALOG  ***************************/

export default function CreateRoleDialog({ open, onClose, onCreate, userOptions = [], usersLoading = false }: CreateRoleDialogProps) {
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

  // Buscar subjects/actions para resolver subjectId/actionId → descrição
  const { data: subjectsData } = useSWR('/api/rbac/subjects', async () => {
    const { data } = await getSubjects();
    return (data ?? []) as Array<{ id: string | number; description?: string }>;
  });

  const { data: actionsData } = useSWR('/api/rbac/actions', async () => {
    const { data } = await getActions();
    return (data ?? []) as Array<{ id: string | number; description?: string }>;
  });

  const subjectMap = useMemo<LookupMap>(
    () => new Map((subjectsData ?? []).map((s) => [Number(s.id), s.description || ''])),
    [subjectsData]
  );

  const actionMap = useMemo<LookupMap>(
    () => new Map((actionsData ?? []).map((a) => [Number(a.id), a.description || ''])),
    [actionsData]
  );

  // Rótulo legível para uma permissão.
  // Prioridade: description > subject.action > name > id
  const permissionLabel = (p: Permission): string => {
    if (p.description) return p.description;
    const subject = p.subject || (p.subjectId != null ? subjectMap.get(Number(p.subjectId)) : undefined) || '';
    const action = p.action || (p.actionId != null ? actionMap.get(Number(p.actionId)) : undefined) || '';
    if (subject || action) return [subject, action].filter(Boolean).join('.');
    return p.name ?? String(p.id);
  };

  // Usuários recebidos como prop da view pai (sem SWR duplicado)
  // userOptions já contém name = nomeCompleto → userName → email → id

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

    // 2) Obtém o ID do papel recém-criado.
    //    O backend ONC pode não retornar o id na resposta do POST; nesse caso,
    //    buscamos a lista de roles e localizamos pelo nome.
    let roleId: string | number | undefined = (created as { id?: string | number } | null)?.id;

    if (roleId == null) {
      const { data: rolesData } = await getRoles();
      const allRoles = (rolesData ?? []) as Array<{ id: string | number; name: string }>;
      const found = allRoles.find((r) => r.name === data.name);
      roleId = found?.id;
    }

    // data.permissions agora contém IDs (strings) diretamente — não mais labels.
    const selectedPermissionIds = data.permissions;

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
    // data.users já contém IDs diretamente (não mais labels)
    const selectedUserIds = data.users;

    if (roleId != null && selectedUserIds.length > 0) {
      const resolvedRoleId = roleId;
      const results = await Promise.all(selectedUserIds.map((userId) => assignRolesToUser({ userId, roles: [resolvedRoleId] })));

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
          maxHeight: '90vh'
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
            Criar Papel
          </DialogTitle>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
            Crie um novo papel com as permissões e usuários que ele deve gerenciar.
          </Typography>
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            px: 3,
            py: 2.5,
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1
          }}
        >
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
                        options={permissions || []}
                        getOptionLabel={(p) => permissionLabel(p)}
                        isOptionEqualToValue={(opt, val) => String(opt.id) === String(val.id)}
                        // field.value = array de IDs (strings); derivamos os objetos para o value do Autocomplete
                        value={(permissions || []).filter((p) => field.value.includes(String(p.id)))}
                        onChange={(_event, selected) => field.onChange(selected.map((p) => String(p.id)))}
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
                        options={userOptions}
                        // exibe nomeCompleto (resolvido em `name`)
                        getOptionLabel={(opt) => opt.name || opt.username || opt.id}
                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                        // field.value = array de IDs; derivamos os objetos para o value do Autocomplete
                        value={userOptions.filter((u) => field.value.includes(u.id))}
                        onChange={(_event, selected) => field.onChange(selected.map((u) => u.id))}
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
              type="button"
              onClick={handleClose}
              variant="outlined"
              color="secondary"
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
              {isSubmitting ? 'Criando...' : 'Salvar Papel'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
