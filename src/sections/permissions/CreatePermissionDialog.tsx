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
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { Controller, useForm, SubmitHandler } from 'react-hook-form';

// @icons
import { IconTrash, IconUser, IconX } from '@tabler/icons-react';

/*************************** MOCK - OPÇÕES ***************************/

const targetOptions = ['Proposta', 'Cliente', 'Dashboard', 'Papel', 'Permissão', 'Usuário'];

const actionOptions = ['Visualizar', 'Criar', 'Atualizar', 'Deletar', 'Aplicar Desconto'];

const roleOptions = ['Super Admin', 'Gestor', 'Gerente', 'Atendente'];

/*************************** TYPES ***************************/

export interface PermissionRole {
  name: string;
  description?: string;
}

export interface PermissionData {
  id?: string;
  name?: string;
  target?: string;
  actions?: string[];
  description?: string;
  roles?: string[];
  roleDetails?: PermissionRole[];
}

interface CreatePermissionFormInput {
  target: string;
  actions: string[];
  description: string;
  roles: string[];
}

interface CreatePermissionDialogProps {
  open: boolean;
  onClose: () => void;

  onCreate?: (data: CreatePermissionFormInput) => void;

  /**
   * Quando informado, o modal funciona como edição.
   * Quando não informado, continua funcionando como criação.
   */
  permission?: PermissionData | null;

  /**
   * Callback opcional para atualização.
   */
  onUpdate?: (data: CreatePermissionFormInput) => void;
}

/*************************** HELPERS ***************************/

const getRoleDescription = (role: string) => {
  const descriptions: Record<string, string> = {
    'Super Admin': 'O Super Admin é o papel administrativo de mais alto nível com acesso total ao sistema.',
    Gestor: 'Responsável por gerenciar atividades, usuários e permissões relacionadas ao sistema.',
    Gerente: 'Responsável por acompanhar e gerenciar as atividades da equipe.',
    Atendente: 'Responsável pelo atendimento e execução das atividades atribuídas.'
  };

  return descriptions[role] || 'Papel atribuído a esta permissão.';
};

/*************************** PERMISSIONS DIALOG ***************************/

export default function CreatePermissionDialog({ open, onClose, onCreate, permission, onUpdate }: CreatePermissionDialogProps) {
  const isEdit = Boolean(permission);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<CreatePermissionFormInput>({
    defaultValues: {
      target: permission?.target || '',
      actions: permission?.actions || [],
      description: permission?.description || '',
      roles: permission?.roles || []
    }
  });

  /**
   * Mantém os valores atualizados quando outra permissão
   * é selecionada para edição.
   */
  const handleDialogEntered = () => {
    reset({
      target: permission?.target || '',
      actions: permission?.actions || [],
      description: permission?.description || '',
      roles: permission?.roles || []
    });
  };

  const handleClose = () => {
    reset({
      target: '',
      actions: [],
      description: '',
      roles: []
    });

    onClose();
  };

  const onSubmit: SubmitHandler<CreatePermissionFormInput> = (data) => {
    if (isEdit) {
      onUpdate?.(data);
    } else {
      onCreate?.(data);
    }

    handleClose();
  };

  const selectedRoles = permission?.roles || [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onTransitionEnter={handleDialogEntered}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 48px)'
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
            overflowY: 'auto'
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
            {/* MODO EDIÇÃO - NOME DA PERMISSÃO                  */}
            {/* ================================================= */}

            {isEdit ? (
              <Box>
                <InputLabel
                  sx={{
                    mb: 0.75,
                    fontSize: 14,
                    color: 'text.primary'
                  }}
                >
                  Nome da permissão
                </InputLabel>

                <TextField
                  value={permission?.name || ''}
                  fullWidth
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 40,
                      borderRadius: 1.5,
                      bgcolor: 'background.paper'
                    }
                  }}
                />
              </Box>
            ) : (
              <>
                {/* ALVO */}

                <Box>
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

                        {targetOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.target?.message && <FormHelperText error>{errors.target.message}</FormHelperText>}
                </Box>

                {/* AÇÕES */}

                <Box>
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
                          overflowY: 'auto'
                        }}
                      >
                        <FormGroup>
                          {actionOptions.map((action) => (
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
                </Box>
              </>
            )}

            {/* ================================================= */}
            {/* DESCRIÇÃO                                         */}
            {/* ================================================= */}

            <Box>
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
            </Box>

            {/* ================================================= */}
            {/* PAPÉIS                                            */}
            {/* ================================================= */}

            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  fontSize: 14
                }}
              >
                Papéis{' '}
                <Typography component="span" variant="body2" color="text.secondary">
                  (Opcional)
                </Typography>
              </Typography>

              {/* ============================================= */}
              {/* MODO EDIÇÃO                                    */}
              {/* ============================================= */}

              {isEdit ? (
                <Stack sx={{ gap: 1 }}>
                  {selectedRoles.map((role) => (
                    <Stack
                      key={role}
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        gap: 1.25,
                        minHeight: 58,
                        px: 1,
                        py: 0.75,
                        borderRadius: 1.5
                      }}
                    >
                      {/* ÍCONE */}

                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          borderRadius: 1.5,
                          bgcolor: 'primary.lighter',
                          color: 'primary.main'
                        }}
                      >
                        <IconUser size={20} />
                      </Box>

                      {/* INFORMAÇÕES */}

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            lineHeight: 1.4
                          }}
                        >
                          {role}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4
                          }}
                        >
                          {permission?.roleDetails?.find((item) => item.name === role)?.description || getRoleDescription(role)}
                        </Typography>
                      </Box>

                      {/* REMOVER */}

                      <IconButton
                        type="button"
                        size="small"
                        sx={{
                          width: 40,
                          height: 40,
                          color: 'error.main',
                          border: '1px solid',
                          borderColor: 'error.lighter',
                          borderRadius: 1.5,
                          flexShrink: 0
                        }}
                      >
                        <IconTrash size={17} />
                      </IconButton>
                    </Stack>
                  ))}

                  {/* ========================================= */}
                  {/* ATRIBUIR PAPÉIS                            */}
                  {/* ========================================= */}

                  <Controller
                    name="roles"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={roleOptions}
                        value={field.value}
                        onChange={(_event, value) => field.onChange(value)}
                        disableCloseOnSelect
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox checked={selected} size="small" sx={{ mr: 1 }} />
                            {option}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="+ Atribuir Papéis"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                minHeight: 44,
                                borderRadius: 1.5
                              }
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Stack>
              ) : (
                /* ============================================= */
                /* MODO CRIAÇÃO                                  */
                /* ============================================= */

                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={roleOptions}
                      value={field.value}
                      onChange={(_event, value) => field.onChange(value)}
                      disableCloseOnSelect
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} size="small" sx={{ mr: 1 }} />
                          {option}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="+ Atribuir Papéis"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              minHeight: 44,
                              borderRadius: 1.5
                            }
                          }}
                        />
                      )}
                    />
                  )}
                />
              )}
            </Box>
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
            justifyContent: 'space-between'
          }}
        >
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
        </DialogActions>
      </form>
    </Dialog>
  );
}
