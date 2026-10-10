'use client';

import { useState, useEffect } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// @third-party
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';

// @project
import { IconDownload, IconHelp, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { getMunicipiosByUf } from '@/utils/api/ibge';

// @types
import { CertificacaoStep5, CertificacaoStep1, CertificacaoStep2, CertificacaoStep3, CertificacaoStep4, CertificacaoStep6 } from '@/types/lead';

// @data
import { brazilianStates } from '@/data/brazilianStates';

// @utils
import { extractSelectedFile } from '@/utils/file';
import {
  isCsvFile,
  LOCALIDADES_CSV_EXAMPLE,
  LOCALIDADES_CSV_HEADERS,
  LOCALIDADES_CSV_TEMPLATE,
  parseLocalidadesCsv
} from '@/utils/localidadesCsv';

type CsvFeedback = { severity: 'success' | 'warning' | 'error'; messages: string[] } | null;

// CSVs exportados pelo Excel costumam vir em Windows-1252; tenta UTF-8 primeiro.
async function readFileText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder('windows-1252').decode(buffer);
  }
}

function downloadCsvTemplate() {
  const blob = new Blob(['\uFEFF', LOCALIDADES_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'modelo-localidades.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/***************************  STEP 5 - DADOS DO SISTEMA DE GESTÃO  ***************************/

interface Step5SistemaGestaoProps {
  register: UseFormRegister<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  errors: FieldErrors<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  watch: UseFormWatch<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  setValue: UseFormSetValue<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
}

export default function Step5SistemaGestao({ register, errors, watch, setValue }: Step5SistemaGestaoProps) {
  const watchedCobreTodasLocalidades = watch('cobreTodasLocalidades');
  const watchedUtilizaConsultoria = watch('utilizaConsultoria');
  const watchedFuncionariosEmClientes = watch('funcionariosEmClientes');
  const watchedLocalidades = watch('localidades') || [];
  const watchedArquivoLocalidades = watch('arquivoLocalidades');
  const [cidadesPorEstado, setCidadesPorEstado] = useState<{ [key: string]: string[] }>({});
  const [loadingCidadesPorEstado, setLoadingCidadesPorEstado] = useState<{ [key: string]: boolean }>({});
  const [csvFeedback, setCsvFeedback] = useState<CsvFeedback>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [indiceParaExcluir, setIndiceParaExcluir] = useState<number | null>(null);
  const arquivoLocalidadesRegister = register('arquivoLocalidades');

  // O aviso do CSV some sozinho após alguns segundos
  useEffect(() => {
    if (!csvFeedback) return;
    const timer = setTimeout(() => setCsvFeedback(null), 6000);
    return () => clearTimeout(timer);
  }, [csvFeedback]);

  const requiredField = { required: 'Campo obrigatório' };

  // Verificar se tem arquivo selecionado (inputs type="file" guardam um FileList, não um File)
  const arquivoSelecionado = extractSelectedFile(watchedArquivoLocalidades);
  const temArquivoSelecionado = Boolean(arquivoSelecionado);

  // Carregar cidades para cada estado de localidade
  useEffect(() => {
    const estadosUnicos = new Set(watchedLocalidades.map((loc) => loc.estado));
    estadosUnicos.forEach((estado) => {
      if (!cidadesPorEstado[estado]) {
        setLoadingCidadesPorEstado((prev) => ({ ...prev, [estado]: true }));
        getMunicipiosByUf(estado)
          .then((municipios) => {
            setCidadesPorEstado((prev) => ({ ...prev, [estado]: municipios }));
            setLoadingCidadesPorEstado((prev) => ({ ...prev, [estado]: false }));
          })
          .catch(() => {
            setCidadesPorEstado((prev) => ({ ...prev, [estado]: [] }));
            setLoadingCidadesPorEstado((prev) => ({ ...prev, [estado]: false }));
          });
      }
    });
  }, [watchedLocalidades, cidadesPorEstado]);

  const isCidadeNaoEncontrada = (estado: string, cidade: string) => {
    const cidades = cidadesPorEstado[estado];
    return Boolean(cidade) && Boolean(cidades?.length) && !cidades.includes(cidade);
  };

  const handleAddLocalidade = () => {
    const currentLocalidades = watchedLocalidades || [];
    setValue('localidades', [
      ...currentLocalidades,
      {
        nome: '',
        estado: 'SP',
        cidade: '',
        atividades: '',
        totalFuncionarios: 0,
        funcionariosAdm: 0,
        funcionariosOp: 0,
        numeroDeTurnos: 0,
        horarioInicio: '',
        horarioTermino: ''
      }
    ]);
  };

  const handleRemoveLocalidade = (index: number) => {
    const currentLocalidades = watchedLocalidades || [];
    setValue('localidades', currentLocalidades.filter((_, i) => i !== index));
  };

  const handleArquivoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    await arquivoLocalidadesRegister.onChange(event);
    setCsvFeedback(null);

    // Outros formatos apenas ficam anexados; somente CSV preenche a tabela.
    if (!file || !isCsvFile(file)) return;

    const { localidades, errors } = parseLocalidadesCsv(await readFileText(file));

    if (errors.length > 0) {
      // Mantém o arquivo inválido fora do formulário para não satisfazer a validação de localidades.
      setValue('arquivoLocalidades', undefined);
      const shown = errors.slice(0, 5);
      if (errors.length > shown.length) shown.push(`... e mais ${errors.length - shown.length} erro(s).`);
      setCsvFeedback({ severity: 'error', messages: ['Não foi possível importar o CSV. Corrija o arquivo e envie novamente:', ...shown] });
      return;
    }

    const replaced = watchedLocalidades.length;
    setValue('localidades', localidades, { shouldValidate: true });
    setCsvFeedback({
      severity: replaced > 0 ? 'warning' : 'success',
      messages: [
        `${localidades.length} localidade(s) importada(s) para a tabela abaixo.`,
        ...(replaced > 0 ? [`As ${replaced} linha(s) existente(s) na tabela foram substituídas.`] : []),
        'Confira as cidades marcadas em vermelho, pois não foram encontradas na lista do estado.'
      ]
    });
  };

  const handleLocalidadeChange = (index: number, field: string, value: string | number) => {
    const currentLocalidades = watchedLocalidades || [];
    const updatedLocalidades = currentLocalidades.map((localidade, i) =>
      i === index ? { ...localidade, [field]: value } : localidade
    );
    setValue('localidades', updatedLocalidades);
  };

  return (
    <Stack gap={2}>
      {/* DADOS DO SISTEMA DE GESTÃO */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem' }}>
        DADOS DO SISTEMA DE GESTÃO
      </Typography>

      {/* Row 1: 3 selects lado a lado */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={Boolean(errors.grauImplementacao)} size="small">
            <InputLabel shrink>Grau de Implementação *</InputLabel>
            <Select
              {...register('grauImplementacao', requiredField)}
              label="Grau de Implementação *"
              defaultValue="total"
              notched
            >
              <MenuItem value="total">Totalmente Implementado</MenuItem>
              <MenuItem value="parcial">Parcialmente Implementado</MenuItem>
              <MenuItem value="nao">Não Implementado</MenuItem>
            </Select>
            {errors.grauImplementacao && <FormHelperText>{errors.grauImplementacao.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={Boolean(errors.grauIntegracao)} size="small">
            <InputLabel shrink>Grau de Integração *</InputLabel>
            <Select
              {...register('grauIntegracao', requiredField)}
              label="Grau de Integração *"
              defaultValue="total"
              notched
            >
              <MenuItem value="total">Totalmente Integrado</MenuItem>
              <MenuItem value="parcial">Parcialmente Integrado</MenuItem>
              <MenuItem value="nao">Não Integrado</MenuItem>
            </Select>
            {errors.grauIntegracao && <FormHelperText>{errors.grauIntegracao.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth error={Boolean(errors.cobreTodasLocalidades)} size="small">
            <InputLabel shrink>Cobre todas as localidades? *</InputLabel>
            <Select
              {...register('cobreTodasLocalidades', requiredField)}
              label="Cobre todas as localidades? *"
              defaultValue="true"
              notched
            >
              <MenuItem value="true">Sim</MenuItem>
              <MenuItem value="false">Não</MenuItem>
            </Select>
            {errors.cobreTodasLocalidades && <FormHelperText>{errors.cobreTodasLocalidades.message}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      {/* Campo condicional: Localidades independentes */}
      {watchedCobreTodasLocalidades === 'false' && (
        <TextField
          {...register('localidadesIndependentes', requiredField)}
          label="Descreva as localidades com Sistemas de Gestão independentes *"
          fullWidth
          multiline
          rows={2}
          size="small"
          error={Boolean(errors.localidadesIndependentes)}
          helperText={errors.localidadesIndependentes?.message}
          InputLabelProps={{ shrink: true }}
        />
      )}

      {/* Row 2: Utiliza consultoria | Certificação acreditada */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={Boolean(errors.utilizaConsultoria)} size="small">
            <InputLabel shrink>Utiliza consultoria para implementação? *</InputLabel>
            <Select
              {...register('utilizaConsultoria', requiredField)}
              label="Utiliza consultoria para implementação? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.utilizaConsultoria && <FormHelperText>{errors.utilizaConsultoria.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={Boolean(errors.certificacaoAcreditada)} size="small">
            <InputLabel shrink>Necessita da certificação acreditada? *</InputLabel>
            <Select
              {...register('certificacaoAcreditada', requiredField)}
              label="Necessita da certificação acreditada? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.certificacaoAcreditada && <FormHelperText>{errors.certificacaoAcreditada.message}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      {/* Row 3: Nome da Consultoria | Nome do Consultor (condicional) */}
      {watchedUtilizaConsultoria === 'true' && (
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('nomeConsultoria', requiredField)}
              label="Nome da Consultoria *"
              fullWidth
              size="small"
              error={Boolean(errors.nomeConsultoria)}
              helperText={errors.nomeConsultoria?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              {...register('nomeConsultor', requiredField)}
              label="Nome do Consultor *"
              fullWidth
              size="small"
              error={Boolean(errors.nomeConsultor)}
              helperText={errors.nomeConsultor?.message}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      )}

      {/* Escopo a ser certificado */}
      <TextField
        {...register('escopo', requiredField)}
        label="Escopo a ser certificado *"
        fullWidth
        multiline
        rows={2}
        size="small"
        error={Boolean(errors.escopo)}
        helperText={errors.escopo?.message}
        InputLabelProps={{ shrink: true }}
      />

      {/* LOCALIDADES A SEREM CERTIFICADAS */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem', mt: 1 }}>
        LOCALIDADES A SEREM CERTIFICADAS *
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
        Faça upload de um arquivo OU preencha manualmente (obrigatório - mínimo 1 localidade)
      </Typography>

      {/* Upload de arquivo */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Opção 1: Upload de Arquivo
          </Typography>
          <IconButton
            size="small"
            aria-label="Ajuda sobre o formato do arquivo CSV"
            onClick={() => setHelpOpen(true)}
            sx={{ bgcolor: 'primary.main', color: 'common.white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <IconHelp size={16} />
          </IconButton>
        </Stack>

        <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Formato esperado do arquivo CSV</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              A primeira linha deve ser o cabeçalho com as colunas abaixo, nesta ordem, e cada linha seguinte é uma localidade. Separador: ponto e
              vírgula (;) ou vírgula (,). Ao enviar um CSV válido, a tabela é preenchida automaticamente (substituindo as linhas atuais).
            </Typography>
            <Box
              component="code"
              sx={{ display: 'block', mt: 1, p: 0.75, bgcolor: 'action.hover', borderRadius: 1, fontSize: '0.75rem', wordBreak: 'break-word' }}
            >
              {LOCALIDADES_CSV_HEADERS.join(';')}
              <br />
              {LOCALIDADES_CSV_EXAMPLE}
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Estado: sigla da UF (ex.: SP) · Cidade: nome do município · Funcionários e turnos: números inteiros · Horários: HH:mm
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button variant="contained" startIcon={<IconDownload size={16} />} onClick={downloadCsvTemplate}>
              Baixar modelo CSV
            </Button>
            <Button variant="contained" onClick={() => setHelpOpen(false)}>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>

        {csvFeedback && (
          <Alert severity={csvFeedback.severity} onClose={() => setCsvFeedback(null)} sx={{ mb: 1 }}>
            {csvFeedback.messages.map((message) => (
              <Typography key={message} variant="body2">
                {message}
              </Typography>
            ))}
          </Alert>
        )}

        {arquivoSelecionado ? (
          <Stack
            direction="row"
            sx={{ alignItems: 'center', gap: 1, px: 1.5, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-all' }}>
              {arquivoSelecionado.name}
            </Typography>
            <IconButton
              size="small"
              aria-label="Remover arquivo"
              onClick={() => {
                setValue('arquivoLocalidades', undefined);
                setCsvFeedback(null);
              }}
              sx={{ bgcolor: 'primary.main', color: 'common.white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <IconX size={16} />
            </IconButton>
          </Stack>
        ) : (
          <Button component="label" variant="contained" size="small">
            Selecionar arquivo
            <input hidden type="file" {...arquivoLocalidadesRegister} onChange={handleArquivoChange} />
          </Button>
        )}
      </Box>

      {/* Ou preencha manualmente */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Opção 2: Preencher Manualmente
        </Typography>
      </Box>

      {/* Tabela de localidades */}
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300, mb: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 120 }}>Nome</TableCell>
              <TableCell sx={{ minWidth: 80 }}>Estado</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Cidade</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Atividades</TableCell>
              <TableCell sx={{ minWidth: 80 }}>Total Fun.</TableCell>
              <TableCell sx={{ minWidth: 80 }}>Adm.</TableCell>
              <TableCell sx={{ minWidth: 80 }}>Operacional</TableCell>
              <TableCell sx={{ minWidth: 60 }}>Turnos</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Horários</TableCell>
              <TableCell sx={{ minWidth: 50 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {watchedLocalidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Nenhuma localidade adicionada. Clique em "Adicionar Localidade" para começar.
                </TableCell>
              </TableRow>
            ) : (
              watchedLocalidades.map((localidade, index) => (
              <TableRow key={index} sx={{ '& td': { border: '1px solid rgba(224, 224, 224, 1)' } }}>
                <TableCell sx={{ py: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={localidade.nome}
                    onChange={(e) => handleLocalidadeChange(index, 'nome', e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Select
                    size="small"
                    fullWidth
                    value={localidade.estado}
                    onChange={(e) => handleLocalidadeChange(index, 'estado', e.target.value)}
                  >
                    {brazilianStates.map((state) => (
                      <MenuItem key={state.code} value={state.code}>
                        {state.code}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Autocomplete
                    options={cidadesPorEstado[localidade.estado] || []}
                    value={localidade.cidade || null}
                    loading={loadingCidadesPorEstado[localidade.estado] || false}
                    disabled={!localidade.estado}
                    size="small"
                    onInputChange={(_, value, reason) => {
                      if (reason === 'clear' || reason === 'input') {
                        handleLocalidadeChange(index, 'cidade', value || '');
                      }
                    }}
                    onChange={(_, value) => {
                      handleLocalidadeChange(index, 'cidade', value || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        error={isCidadeNaoEncontrada(localidade.estado, localidade.cidade)}
                        helperText={isCidadeNaoEncontrada(localidade.estado, localidade.cidade) ? 'Cidade não encontrada' : undefined}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingCidadesPorEstado[localidade.estado] ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={localidade.atividades}
                    onChange={(e) => handleLocalidadeChange(index, 'atividades', e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    value={localidade.totalFuncionarios}
                    onChange={(e) => handleLocalidadeChange(index, 'totalFuncionarios', parseInt(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    value={localidade.funcionariosAdm}
                    onChange={(e) => handleLocalidadeChange(index, 'funcionariosAdm', parseInt(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    value={localidade.funcionariosOp}
                    onChange={(e) => handleLocalidadeChange(index, 'funcionariosOp', parseInt(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    value={localidade.numeroDeTurnos}
                    onChange={(e) => handleLocalidadeChange(index, 'numeroDeTurnos', parseInt(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Grid container spacing={0.5}>
                    <Grid size={6}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Início"
                        value={localidade.horarioInicio}
                        onChange={(e) => handleLocalidadeChange(index, 'horarioInicio', e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Término"
                        value={localidade.horarioTermino}
                        onChange={(e) => handleLocalidadeChange(index, 'horarioTermino', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <IconButton
                    size="small"
                    aria-label="Remover localidade"
                    onClick={() => setIndiceParaExcluir(index)}
                    sx={{ bgcolor: 'primary.main', color: 'common.white', '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    <IconTrash size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={indiceParaExcluir !== null} onClose={() => setIndiceParaExcluir(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Tem certeza que deseja excluir
            {indiceParaExcluir !== null && watchedLocalidades[indiceParaExcluir]?.nome
              ? ` a localidade "${watchedLocalidades[indiceParaExcluir].nome}"`
              : ' esta localidade'}
            ? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setIndiceParaExcluir(null)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<IconTrash size={16} />}
            onClick={() => {
              if (indiceParaExcluir !== null) handleRemoveLocalidade(indiceParaExcluir);
              setIndiceParaExcluir(null);
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      {/* Mensagem de validação/confirmação */}
      {temArquivoSelecionado ? (
        <Typography variant="caption" sx={{ color: 'success.main', display: 'block', mt: 1, fontWeight: 500 }}>
          ✓ Arquivo selecionado - Você pode avançar para o próximo passo
        </Typography>
      ) : watchedLocalidades.length === 0 ? (
        <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 1, fontWeight: 500 }}>
          ⚠ Arquivo obrigatório OU preencha manualmente (mínimo 1 localidade)
        </Typography>
      ) : null}

      {/* Botão Adicionar Localidade */}
      <Button
        startIcon={<IconPlus size={18} />}
        onClick={handleAddLocalidade}
        variant="contained"
        color="primary"
        size="large"
        disabled={temArquivoSelecionado}
        sx={{ mt: 1, alignSelf: 'flex-start' }}
      >
        Adicionar Localidade
      </Button>

      {/* Row 4: Funcionários em sites de clientes */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={Boolean(errors.funcionariosEmClientes)} size="small">
            <InputLabel shrink>Funcionários em sites de clientes? *</InputLabel>
            <Select
              {...register('funcionariosEmClientes', requiredField)}
              label="Funcionários em sites de clientes? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.funcionariosEmClientes && <FormHelperText>{errors.funcionariosEmClientes.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {watchedFuncionariosEmClientes === 'true' && (
            <TextField
              {...register('descricaoClientes', requiredField)}
              label="Descreva em quais clientes *"
              fullWidth
              size="small"
              error={Boolean(errors.descricaoClientes)}
              helperText={errors.descricaoClientes?.message}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}
