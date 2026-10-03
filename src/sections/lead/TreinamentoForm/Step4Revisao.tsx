'use client';

// @mui
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// @tabler
import { IconChevronDown, IconEdit } from '@tabler/icons-react';

// @third-party
import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';

// @types
import { TreinamentoFormData } from '@/types/lead';

/***************************  STEP 4 - REVISÃO  ***************************/

interface Step4RevisaoProps {
  register: UseFormRegister<TreinamentoFormData>;
  errors: FieldErrors<TreinamentoFormData>;
  watch: UseFormWatch<TreinamentoFormData>;
  onEdit: (step: number) => void;
}

export default function Step4Revisao({ register, errors, watch, onEdit }: Step4RevisaoProps) {
  const paraQuem = watch('paraQuem');
  const empresa = watch('empresa');
  const participante = watch('participante');
  const treinamentos = watch('treinamentos');

  const NORMAS_MAP: Record<number | string, string> = {
    1: 'ISO 9001',
    2: 'ISO 14001',
    3: 'ISO 45001',
    4: 'ISO/IEC 27001',
    5: 'ISO/IEC 20000-1',
    6: 'ISO 37001',
    7: 'ISO 50001',
    8: 'ISO 22000',
  };

  const TIPOS_MAP: Record<number | string, string> = {
    1: 'Auditoria Interna',
    2: 'Implementação',
    3: 'Capacitação',
    4: 'Consultoria',
  };

  const FORMATOS_MAP: Record<number | string, string> = {
    1: 'Online Ao Vivo',
    2: 'Presencial',
  };

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem', mb: 1 }}>
        REVISÃO DA SOLICITAÇÃO
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Verifique todos os dados abaixo antes de enviar. Você pode editar qualquer seção.
      </Typography>

      {/* ACORDEÃO 1: Tipo e Solicitante */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<IconChevronDown size={20} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>TIPO E SOLICITANTE</Typography>
            <Button size="small" variant="outlined" onClick={() => onEdit(0)} startIcon={<IconEdit size={16} />}>
              Editar
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Para quem será o treinamento
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {paraQuem === 'empresa' ? 'Para uma Empresa' : 'Para uma Pessoa Física'}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Onde nos conheceu
              </Typography>
              <Typography variant="body2">{watch('ondeNosConheceu') || '—'}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Nome do Contato
              </Typography>
              <Typography variant="body2">{watch('nomeContato')}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Cargo
              </Typography>
              <Typography variant="body2">{watch('cargo')}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                E-mail
              </Typography>
              <Typography variant="body2">{watch('email')}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Telefone
              </Typography>
              <Typography variant="body2">{watch('telefone')}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ACORDEÃO 2: Dados da Empresa ou Participante */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<IconChevronDown size={20} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
              {paraQuem === 'empresa' ? 'DADOS DA EMPRESA' : 'DADOS DO PARTICIPANTE'}
            </Typography>
            <Button size="small" variant="outlined" onClick={() => onEdit(1)} startIcon={<IconEdit size={16} />}>
              Editar
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {paraQuem === 'empresa' && empresa ? (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    CNPJ
                  </Typography>
                  <Typography variant="body2">{empresa.cnpj}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Razão Social
                  </Typography>
                  <Typography variant="body2">{empresa.razaoSocial}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    E-mail
                  </Typography>
                  <Typography variant="body2">{empresa.emailEmpresa}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Telefone
                  </Typography>
                  <Typography variant="body2">{empresa.telefoneEmpresa}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Endereço
                  </Typography>
                  <Typography variant="body2">
                    {empresa.endereco}, {empresa.numero} {empresa.complemento && `- ${empresa.complemento}`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Cidade
                  </Typography>
                  <Typography variant="body2">
                    {empresa.cidade}, {empresa.estado}
                  </Typography>
                </Grid>
              </>
            ) : participante ? (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Nome Completo
                  </Typography>
                  <Typography variant="body2">{participante.nomeCompleto}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    CPF
                  </Typography>
                  <Typography variant="body2">{participante.cpf}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    E-mail
                  </Typography>
                  <Typography variant="body2">{participante.email}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Telefone
                  </Typography>
                  <Typography variant="body2">{participante.telefone}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Endereço
                  </Typography>
                  <Typography variant="body2">
                    {participante.endereco}, {participante.numero} {participante.complemento && `- ${participante.complemento}`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Empresa onde trabalha
                  </Typography>
                  <Typography variant="body2">{participante.empresaOndeTrabalha || '—'}</Typography>
                </Grid>
              </>
            ) : null}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ACORDEÃO 3: Treinamentos */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<IconChevronDown size={20} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>TREINAMENTOS</Typography>
            <Button size="small" variant="outlined" onClick={() => onEdit(2)} startIcon={<IconEdit size={16} />}>
              Editar
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Norma</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Participantes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Formato</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {treinamentos?.map((treino, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      {typeof treino.normaId === 'number'
                        ? NORMAS_MAP[treino.normaId]
                        : treino.outraNorma}
                    </TableCell>
                    <TableCell>
                      {typeof treino.tipoTreinamentoId === 'number'
                        ? TIPOS_MAP[treino.tipoTreinamentoId]
                        : treino.outroTipoTreinamento}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{treino.totalParticipantes}</TableCell>
                    <TableCell>{FORMATOS_MAP[treino.formatoId]}</TableCell>
                    <TableCell>{treino.dataPrevista}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* DIVIDER */}
      <Divider sx={{ my: 1 }} />

      {/* CHECKBOXES E RECAPTCHA */}
      <Stack gap={1.5}>
        <FormControlLabel
          control={<Checkbox {...register('aceitaTermos', { required: 'Aceite é obrigatório' })} />}
          label={
            <Typography variant="body2">
              Declaro que as informações fornecidas são verídicas e atualizadas. *
            </Typography>
          }
        />
        {errors.aceitaTermos && <FormHelperText error>{errors.aceitaTermos.message}</FormHelperText>}

        <FormControlLabel
          control={<Checkbox {...register('aceitaPoliticaPrivacidade', { required: 'Aceite é obrigatório' })} />}
          label={
            <Typography variant="body2">
              Li e estou de acordo com a{' '}
              <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Política de Privacidade
              </a>{' '}
              *
            </Typography>
          }
        />
        {errors.aceitaPoliticaPrivacidade && <FormHelperText error>{errors.aceitaPoliticaPrivacidade.message}</FormHelperText>}

        {/* TODO: Integrar reCAPTCHA aqui */}
      </Stack>
    </Stack>
  );
}
