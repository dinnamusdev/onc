'use client';

// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @tabler
import { IconTrash } from '@tabler/icons-react';

// @third-party
import { UseFormRegister, UseFormWatch, FieldErrors, Controller, useFieldArray } from 'react-hook-form';

// @types
import { TreinamentoFormData } from '@/types/lead';

/***************************  STEP 3 - TREINAMENTOS  ***************************/

interface Step3TreinamentosProps {
  register: UseFormRegister<TreinamentoFormData>;
  errors: FieldErrors<TreinamentoFormData>;
  watch: UseFormWatch<TreinamentoFormData>;
  control: any;
}

// Mock data - será substituído por chamada à API
const NORMAS = [
  { id: 1, descricao: 'ISO 9001' },
  { id: 2, descricao: 'ISO 14001' },
  { id: 3, descricao: 'ISO 45001' },
  { id: 4, descricao: 'ISO/IEC 27001' },
  { id: 5, descricao: 'ISO/IEC 20000-1' },
  { id: 6, descricao: 'ISO 37001' },
  { id: 7, descricao: 'ISO 50001' },
  { id: 8, descricao: 'ISO 22000' },
];

const TIPOS_TREINAMENTO = [
  { id: 1, descricao: 'Auditoria Interna' },
  { id: 2, descricao: 'Implementação' },
  { id: 3, descricao: 'Capacitação' },
  { id: 4, descricao: 'Consultoria' },
];

const FORMATOS = [
  { id: 1, descricao: 'Online Ao Vivo' },
  { id: 2, descricao: 'Presencial' },
];

export default function Step3Treinamentos({ register, errors, watch, control }: Step3TreinamentosProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'treinamentos'
  });

  const handleAddTreinamento = () => {
    append({
      normaId: 1,
      tipoTreinamentoId: 1,
      totalParticipantes: 1,
      formatoId: 1,
      dataPrevista: ''
    });
  };

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
        TREINAMENTOS SOLICITADOS
      </Typography>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Norma *</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tipo de Treinamento *</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Total Part. *</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Formato *</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data Prevista *</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    {...register(`treinamentos.${index}.normaId` as const)}
                    error={!!errors.treinamentos?.[index]?.normaId}
                    SelectProps={{ native: true }}
                  >
                    {NORMAS.map((norma) => (
                      <option key={norma.id} value={norma.id}>
                        {norma.descricao}
                      </option>
                    ))}
                    <option value="outra">Outra</option>
                  </TextField>
                  {watch(`treinamentos.${index}.normaId` as const) === 'outra' && (
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Descreva a norma"
                      {...register(`treinamentos.${index}.outraNorma`)}
                      sx={{ mt: 1 }}
                    />
                  )}
                </TableCell>

                <TableCell>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    {...register(`treinamentos.${index}.tipoTreinamentoId` as const)}
                    error={!!errors.treinamentos?.[index]?.tipoTreinamentoId}
                    SelectProps={{ native: true }}
                  >
                    {TIPOS_TREINAMENTO.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.descricao}
                      </option>
                    ))}
                    <option value="outro">Outro</option>
                  </TextField>
                  {watch(`treinamentos.${index}.tipoTreinamentoId` as const) === 'outro' && (
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Descreva o tipo"
                      {...register(`treinamentos.${index}.outroTipoTreinamento`)}
                      sx={{ mt: 1 }}
                    />
                  )}
                </TableCell>

                <TableCell sx={{ textAlign: 'center' }}>
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 1, max: 999 }}
                    {...register(`treinamentos.${index}.totalParticipantes`, {
                      required: 'Campo obrigatório',
                      min: { value: 1, message: 'Mínimo 1' }
                    })}
                    error={!!errors.treinamentos?.[index]?.totalParticipantes}
                    sx={{ width: '80px' }}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    {...register(`treinamentos.${index}.formatoId` as const)}
                    error={!!errors.treinamentos?.[index]?.formatoId}
                    SelectProps={{ native: true }}
                  >
                    {FORMATOS.map((formato) => (
                      <option key={formato.id} value={formato.id}>
                        {formato.descricao}
                      </option>
                    ))}
                  </TextField>
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="date"
                    placeholder="dd/mm/aaaa"
                    {...register(`treinamentos.${index}.dataPrevista`, {
                      required: 'Campo obrigatório'
                    })}
                    error={!!errors.treinamentos?.[index]?.dataPrevista}
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>

                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    sx={{ bgcolor: 'primary.main', color: 'common.white', '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' } }}
                  >
                    <IconTrash size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        size="small"
        onClick={handleAddTreinamento}
        sx={{ alignSelf: 'flex-start' }}
      >
        + Adicionar Treinamento
      </Button>
    </Stack>
  );
}
