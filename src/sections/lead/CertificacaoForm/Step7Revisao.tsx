'use client';

import { useState, useEffect } from 'react';

// @mui
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// @tabler
import { IconChevronDown, IconEdit } from '@tabler/icons-react';

// @third-party
import { UseFormRegister, UseFormWatch, FieldErrors, Controller } from 'react-hook-form';

// @utils
import { getMunicipiosByUf } from '@/utils/api/ibge';

// @types
import { CertificacaoStep1, CertificacaoStep2, CertificacaoStep3, CertificacaoStep4, CertificacaoStep5, CertificacaoStep6 } from '@/types/lead';

/***************************  STEP 7 - REVISÃO  ***************************/

interface Step7RevisaoProps {
  register: UseFormRegister<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  errors: FieldErrors<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  watch: UseFormWatch<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  onEdit: (step: number) => void;
}

export default function Step7Revisao({ register, errors, watch, onEdit }: Step7RevisaoProps) {
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  
  const watchedNormas = watch('normasSelecionadas') || [];
  const watchedEstado = watch('estado');
  const watchedCidade = watch('cidade');
  const watchedLocalidades = watch('localidades') || [];

  // Verificar se tem dados específicos
  const hasLixoZero = watchedNormas.includes('Lixo Zero');
  const hasISO50001 = watchedNormas.includes('ISO 50001');
  const hasISO14001 = watchedNormas.includes('ISO 14001');
  const hasISO45001 = watchedNormas.includes('ISO 45001');
  const hasISO22000 = watchedNormas.includes('ISO 22000');
  const hasISO37001 = watchedNormas.includes('ISO 37001');
  const hasEspecificos = hasLixoZero || hasISO50001 || hasISO14001 || hasISO45001 || hasISO22000 || hasISO37001;

  // Carregar cidades quando estado muda
  useEffect(() => {
    if (watchedEstado && watchedEstado.length === 2) {
      setLoadingCidades(true);
      getMunicipiosByUf(watchedEstado)
        .then((municipios) => {
          setCidades(municipios);
          setLoadingCidades(false);
        })
        .catch(() => {
          setCidades([]);
          setLoadingCidades(false);
        });
    }
  }, [watchedEstado]);

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
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Tipo de Certificação</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('tipoCertificacao') === 'inicial' ? 'Certificação Inicial' : 'Transferência de Organismo'}
              </Typography>
            </Grid>
            {watch('tipoCertificacao') === 'transferencia' && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Certificados Existentes</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {(watch('certificados') || []).length > 0
                      ? (watch('certificados') || []).map((cert, idx) => `${cert.numero} (Validade: ${cert.validade})`).join(', ')
                      : '—'}
                  </Typography>
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Nome do Contato</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('nomeContato')}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Cargo</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('cargo')}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Empresa</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('empresa')}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Data de Nascimento</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('dataNascimento') || '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>E-mail</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('email')}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Telefone</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('telefone')}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>WhatsApp</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('whatsapp') || '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Onde nos conheceu</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('ondeNosConheceu') || '—'}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ACORDEÃO 2: Normas */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown size={20} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>NORMAS</Typography>
            <Button size="small" variant="outlined" onClick={() => onEdit(1)} startIcon={<IconEdit size={16} />}>
              Editar
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={1}>
            {watchedNormas.map((norma, idx) => (
              <Typography key={idx} variant="body2" sx={{ fontWeight: 500 }}>
                • {norma}
              </Typography>
            ))}
            {watch('outraNorma') && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: 'info.lighter', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Outra norma</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('outraNorma')}</Typography>
              </Box>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* ACORDEÃO 3: Empresa */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown size={20} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>EMPRESA</Typography>
            <Button size="small" variant="outlined" onClick={() => onEdit(2)} startIcon={<IconEdit size={16} />}>
              Editar
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>CNPJ</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('cnpj')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Website</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('website') || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Razão Social</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('razaoSocial')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Setor</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {watch('setorEmpresa') === 'privado' ? 'Setor Privado' : 'Setor Público'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>E-mail</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('emailEmpresa')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Telefone</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('telefoneEmpresa')}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Endereço</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('endereco')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Número</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('numero')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Complemento</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('complemento') || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Bairro</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('bairro')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>CEP</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('cep')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Estado</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('estado')}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Cidade (com busca)</Typography>
                <Autocomplete
                  options={cidades}
                  value={watchedCidade || null}
                  loading={loadingCidades}
                  disabled={!watchedEstado || loadingCidades}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Digite a cidade..."
                      error={Boolean(errors.cidade)}
                      helperText={errors.cidade?.message || (loadingCidades ? 'Carregando cidades...' : '')}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingCidades ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* ACORDEÃO 4: Negócio */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown size={20} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>NEGÓCIO</Typography>
            <Button size="small" variant="outlined" onClick={() => onEdit(3)} startIcon={<IconEdit size={16} />}>
              Editar
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Produtos e/ou Serviços</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('produtosServicos')}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Principais Processos</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('principaisProcessos')}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Principais Obrigações Legais</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('principaisObrigacoesLegais') || '—'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Já certificada em outras normas?</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('jaCertificada') ? 'Sim' : 'Não'}
              </Typography>
            </Grid>
            {watch('jaCertificada') && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Descrição das Certificações</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('descricaoCertificacoes')}</Typography>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Responsável pelo projeto?</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('responssavelProjeto') ? 'Sim' : 'Não'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Terceiriza processos?</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('terceirizaProcesso') ? 'Sim' : 'Não'}
              </Typography>
            </Grid>
            {watch('terceirizaProcesso') && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Processos Terceirizados</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('processosTerceirizados')}</Typography>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ACORDEÃO 5: Sistema de Gestão */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown size={20} />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>SISTEMA DE GESTÃO</Typography>
            <Button size="small" variant="outlined" onClick={() => onEdit(4)} startIcon={<IconEdit size={16} />}>
              Editar
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Grau de Implementação</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('grauImplementacao') === 'total' ? 'Totalmente Implementado' : watch('grauImplementacao') === 'parcial' ? 'Parcialmente Implementado' : 'Não Implementado'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Grau de Integração</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('grauIntegracao') === 'total' ? 'Totalmente Integrado' : watch('grauIntegracao') === 'parcial' ? 'Parcialmente Integrado' : 'Não Integrado'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Cobre todas as localidades?</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('cobreTodasLocalidades') ? 'Sim' : 'Não'}
              </Typography>
            </Grid>
            {!watch('cobreTodasLocalidades') && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Localidades Independentes</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('localidadesIndependentes')}</Typography>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Utiliza consultoria?</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('utilizaConsultoria') ? 'Sim' : 'Não'}
              </Typography>
            </Grid>
            {watch('utilizaConsultoria') && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Nome da Consultoria</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('nomeConsultoria')}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Nome do Consultor</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('nomeConsultor')}</Typography>
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Certificação acreditada?</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('certificacaoAcreditada') ? 'Sim' : 'Não'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Escopo a ser certificado</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('escopo')}</Typography>
            </Grid>
            {watchedLocalidades.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Localidades ({watchedLocalidades.length})</Typography>
                <Stack gap={1}>
                  {watchedLocalidades.map((loc, idx) => (
                    <Box key={idx} sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {loc.nome} - {loc.cidade}, {loc.estado}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Atividades: {loc.atividades}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Funcionários: {loc.totalFuncionarios} (Adm: {loc.funcionariosAdm}, Op: {loc.funcionariosOp})
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Funcionários em clientes?</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {watch('funcionariosEmClientes') ? 'Sim' : 'Não'}
              </Typography>
            </Grid>
            {watch('funcionariosEmClientes') && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Descrição dos Clientes</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('descricaoClientes')}</Typography>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ACORDEÃO 6: Dados Específicos (condicional) */}
      {hasEspecificos && (
        <Accordion>
          <AccordionSummary expandIcon={<IconChevronDown size={20} />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>DADOS ESPECÍFICOS</Typography>
              <Button size="small" variant="outlined" onClick={() => onEdit(5)} startIcon={<IconEdit size={16} />}>
                Editar
              </Button>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack gap={2}>
              {hasLixoZero && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>Lixo Zero</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Área (m²)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('lixoZero.areaTotalM2')} m²</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Geração Mensal (kg)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('lixoZero.geracaoMensalKg')} kg</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Possui gestão?</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {watch('lixoZero.possuiGestaoResiduos') ? 'Sim' : 'Não'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Reciclagem (%)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('lixoZero.porcentualReciclagem')}%</Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Resíduos Gerados</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('lixoZero.residuosGerados')}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {(hasLixoZero && (hasISO50001 || hasISO14001 || hasISO45001 || hasISO22000 || hasISO37001)) && <Divider />}
              {hasISO50001 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>ISO 50001</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Consumo (kWh)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('iso50001.consumoTotalKwh')} kWh</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Fontes de Energia</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('iso50001.numeroFontesEnergia')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Usos Significativos</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('iso50001.numeroUsoSignificativos')}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {(hasISO50001 && (hasISO14001 || hasISO45001 || hasISO22000 || hasISO37001)) && <Divider />}
              {hasISO14001 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>ISO 14001</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Aspectos Ambientais</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('iso14001.aspectosAmbientais')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Requisitos Legais</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('iso14001.requisitosLegaisAmbientais') || '—'}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {(hasISO14001 && (hasISO45001 || hasISO22000 || hasISO37001)) && <Divider />}
              {hasISO45001 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>ISO 45001</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Riscos Identificados</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('iso45001.riscosSSOIdentificados')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Acidentes sem afastamento?</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {watch('iso45001.acidentesSemAfastamento') ? `Sim (${watch('iso45001.totalAcidentesSemAfastamento')})` : 'Não'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Acidentes com afastamento?</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {watch('iso45001.acidentesComAfastamento') ? `Sim (${watch('iso45001.totalAcidentesComAfastamento')})` : 'Não'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {(hasISO45001 && (hasISO22000 || hasISO37001)) && <Divider />}
              {hasISO22000 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>ISO 22000</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>APPCCs</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('iso22000.appccs')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Linhas de Processos</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('iso22000.linhasProcessos')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Categorias</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>{watch('iso22000.categoriasAlimentos')}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {(hasISO22000 && hasISO37001) && <Divider />}
              {hasISO37001 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>ISO 37001</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Serviços Financeiros</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('iso37001.pessoasServicosFinanceiros')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Aquisições</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{watch('iso37001.pessoasAquisicoes')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Realiza doações?</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {watch('iso37001.realizaDoacoes') ? 'Sim' : 'Não'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Envolvimento em suborno?</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {watch('iso37001.envolvidoSuborno') ? 'Sim' : 'Não'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

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
        <Box sx={{ p: 1.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            [reCAPTCHA — Não sou um robô]
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
