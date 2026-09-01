'use client';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { Controller, useForm, SubmitHandler } from 'react-hook-form';

// @icons
import { IconPlus, IconX } from '@tabler/icons-react';

/***************************  MOCK - OPÇÕES  ***************************/
// TODO: substituir por dados vindos da API (GET /api/authz/permissions, GET /api/users)

const permissionOptions = ['Visualizar', 'Criar', 'Deletar', 'Atualizar', 'Dar Desconto'];

const userOptions = ['Stacy Reichel', 'Roderick Rohan', 'Audrey Leffler MD', 'Allison Mosciski', 'Maureen Aufderhar'];

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

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<CreateRoleFormInput> = (data) => {
    // TODO: enviar para API (POST /api/authz/roles)
    onCreate?.(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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

            <Box>
              <InputLabel>Papel</InputLabel>
              <OutlinedInput
                {...register('name', { required: 'O nome do papel é obrigatório' })}
                placeholder="Insira o nome do papel ex. Super Admin"
                fullWidth
                error={Boolean(errors.name)}
              />
              {errors.name?.message && <FormHelperText error>{errors.name.message}</FormHelperText>}
            </Box>

            <Box>
              <InputLabel>Descrição</InputLabel>
              <TextField {...register('description')} placeholder="Adicione uma descrição" fullWidth multiline minRows={3} />
            </Box>

            <Box>
              <InputLabel sx={{ mb: 1 }}>Permissão (Opcional)</InputLabel>
              <Controller
                name="permissions"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={permissionOptions}
                    value={field.value}
                    onChange={(_event, value) => field.onChange(value)}
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
            </Box>

            <Box>
              <InputLabel sx={{ mb: 1 }}>Usuários (Opcional)</InputLabel>
              <Controller
                name="users"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={userOptions}
                    value={field.value}
                    onChange={(_event, value) => field.onChange(value)}
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
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="error">
            Criar Papel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
