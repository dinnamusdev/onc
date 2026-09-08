'use client';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import useSWR from 'swr';

// @icons
import { IconX } from '@tabler/icons-react';

// @project
import { getPermissions } from '@/utils/api/rbac';

/*************************** MOCK - OPÇÕES (Fallback) ***************************/

const defaultTargetOptions = ['Proposta', 'Cliente', 'Dashboard', 'Papel', 'Permissão', 'Usuário'];

const defaultActionOptions = ['Visualizar', 'Criar', 'Atualizar', 'Deletar', 'Aplicar Desconto'];

/*************************** TYPES ***************************/

export interface PermissionData {
  id?: string;
  name?: string;
  target?: string;
  actions?: string[];
  description?: string;
}

interface CreatePermissionFormInput {
  name?: string;
  target: string;
  actions: string[];
  description: string;
}

interface CreatePermissionDialogProps {
  open: boolean;
  onClose: () => void;

  onCreate?: (data: CreatePermissionFormInput) => void | Promise<boolean | void>;

  /**
   * Quando informado, o modal funciona como edição.
   * Quando não informado, continua funcionando como criação.
   */
  permission?: PermissionData | null;

  /**
   * Callback opcional para atualização.
   */
  onUpdate?: (data: CreatePermissionFormInput) => void | Promise<boolean | void>;
}

/*************************** HELPERS ***************************/

/*************************** PERMISSIONS DIALOG ***************************/

export default function CreatePermissionDialog({ open, onClose, onCreate, permission, onUpdate }: CreatePermissionDialogProps) {
  const isEdit = Boolean(permission);

  const { data: permissions } = useSWR('/api/rbac/permissions', async () => {
    const { data, error } = await getPermissions();
    if (error) throw new Error(error);
    return (data ?? []) as Array<{ id: string | number; subject?: string; action?: string | string[] }>;
  });

  // Sempre usar defaults como base, adicionando opções da API se disponíveis
  const apiTargets = permissions && permissions.length > 0
    ? Array.from(new Set(permissions.map(p => p.subject).filter(Boolean)))
    : [];

  const apiActions = permissions && permissions.length > 0
    ? Array.from(new Set(permissions.flatMap(p => {
        if (Array.isArray(p.action)) return p.action;
        if (typeof p.action === 'string') return p.action.split(',').map(a => a.trim());
        return [];
      }).filter(Boolean)))
    : [];

  // Combinar defaults com opções da API (priorizando API)
  const targetOptions = Array.from(new Set([...defaultTargetOptions, ...apiTargets]));
  const actionOptions = Array.from(new Set([...defaultActionOptions, ...apiActions]));

  const editTargetOptions = permission?.target && !targetOptions.includes(permission.target)
    ? [...targetOptions, permission.target]
    : targetOptions;

  const editActionOptions = permission?.actions
    ? [...actionOptions, ...permission.actions].filter((option, index, options) => options.indexOf(option) === index)
    : actionOptions;

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<CreatePermissionFormInput>({
    defaultValues: {
      name: permission?.name || '',
      target: permission?.target || '',
      actions: permission?.actions || [],
      description: permission?.description || ''
    }
  });

  /**
   * Mantém os valores atualizados quando outra permissão
   * é selecionada para edição.
   */
  const handleDialogEntered = () => {
    reset({
      name: permission?.name || '',
      target: permission?.target || '',
      actions: permission?.actions || [],
      description: permission?.description || ''
    });
  };

  const handleClose = () => {
    reset({
      name: '',
      target: '',
      actions: [],
      description: ''
    });

    onClose();
  };

  const onSubmit: SubmitHandler<CreatePermissionFormInput> = async (data) => {
    const result = isEdit ? await onUpdate?.(data) : await onCreate?.(data);

    if (result !== false) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onTransitionEnter={handleDialogEntered}
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
      {/* ===================================================== */}
      {/* CABEÇALHO                                            */}
      {/* ===================================================== */}

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
            {isEdit ? 'Editar Permissão' : 'Adicionar Permissão'}
          </DialogTitle>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontSize: 14
            }}
          >
            {isEdit ? 'Defina claramente o escopo desta permissão.' : 'Gerenciamento e atribuição de permissões de acesso.'}
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

      {/* ===================================================== */}
      {/* FORMULÁRIO                                           */}
      {/* ===================================================== */}

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
            {/* ================================================= */}
            {/* INFORMAÇÕES GERAIS                               */}
            {/* ================================================= */}

            <Typography
              variant="subtitle1"
              sx={{
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Informações Gerais
            </Typography>

            {/* ================================================= */}
            <Grid container spacing={2}>
              {/* ALVO */}

              <Grid size={{ xs: 12, sm: 6 }} sx={{ order: 2 }}>
                <InputLabel
                  sx={{
                    mb: 0.75,
                    fontSize: 14,
                    color: 'text.primary'
                  }}
                >
                  Alvo
                </InputLabel>

                <Controller
                  name="target"
                  control={control}
                  rules={{
                    required: 'Selecione o recurso alvo desta permissão'
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      fullWidth
                      error={Boolean(errors.target)}
                      sx={{
                        height: 40,
                        borderRadius: 1.5
                      }}
                    >
                      <MenuItem value="" disabled>
                        Selecionar item
                      </MenuItem>

                      {editTargetOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {errors.target?.message && <FormHelperText error>{errors.target.message}</FormHelperText>}
              </Grid>
            
              {/* AÇÕES */}

              <Grid size={{ xs: 12, sm: 6 }} sx={{ order: 3 }}>
                <InputLabel
                  sx={{
                    mb: 0.75,
                    fontSize: 14,
                    color: 'text.primary'
                  }}
                >
                  Ação
                </InputLabel>

                <Controller
                  name="actions"
                  control={control}
                  rules={{
                    validate: (value) => value.length > 0 || 'Selecione pelo menos uma ação'
                  }}
                  render={({ field }) => (
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: errors.actions ? 'error.main' : 'divider',
                        borderRadius: 1.5,
                        p: 1,
                        maxHeight: 160,
                        overflowY: 'auto',
                        backgroundColor: 'background.paper'
                      }}
                    >
                      <FormGroup>
                        {editActionOptions.map((action) => (
                          <FormControlLabel
                            key={action}
                            label={action}
                            control={
                              <Checkbox
                                size="small"
                                checked={field.value.includes(action)}
                                onChange={(_event, checked) => {
                                  field.onChange(checked ? [...field.value, action] : field.value.filter((item) => item !== action));
                                }}
                              />
                            }
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  )}
                />

                {errors.actions?.message && <FormHelperText error>{errors.actions.message}</FormHelperText>}
              </Grid>

            {/* ================================================= */}
            {/* DESCRIÇÃO                                         */}
            {/* ================================================= */}

            <Grid size={{ xs: 12 }} sx={{ order: 4 }}>
              <InputLabel
                sx={{
                  mb: 0.75,
                  fontSize: 14,
                  color: 'text.primary'
                }}
              >
                Descrição
              </InputLabel>

              <TextField
                {...register('description')}
                placeholder={isEdit ? '' : 'Insira uma descrição de permissão'}
                fullWidth
                multiline
                minRows={isEdit ? 3 : 3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    alignItems: 'flex-start'
                  },
                  '& textarea': {
                    lineHeight: 1.5
                  }
                }}
              />
            </Grid>

            </Grid>
          </Stack>
        </DialogContent>

        {/* ===================================================== */}
        {/* RODAPÉ                                               */}
        {/* ===================================================== */}

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
          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
            <Button
              type="button"
              onClick={handleClose}
              variant="outlined"
              color="secondary"
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
              sx={{
                minWidth: 170,
                height: 44,
                borderRadius: 1.5
              }}
            >
              {isEdit ? 'Atualizar Permissão' : 'Criar Permissão'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
