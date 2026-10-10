'use client';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';

// @types
import { CertificacaoStep6, CertificacaoStep1, CertificacaoStep2, CertificacaoStep3, CertificacaoStep4, CertificacaoStep5 } from '@/types/lead';
import { extractSelectedFile } from '@/utils/file';

/***************************  STEP 6 - DADOS ESPECÍFICOS  ***************************/

interface Step6DadosEspecificosProps {
  register: UseFormRegister<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  errors: FieldErrors<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  watch: UseFormWatch<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
  setValue: UseFormSetValue<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>;
}

function SpecificSectionHeading({ norma }: { norma: string }) {
  return (
    <Box sx={{ textAlign: 'center', mt: 0.5, mb: 0.25 }}>
      <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', fontWeight: 'bold', lineHeight: 1.2 }}>
        ESPECÍFICO
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold', lineHeight: 1.3 }}>
        {norma}
      </Typography>
    </Box>
  );
}

export default function Step6DadosEspecificos({ register, errors, watch, setValue }: Step6DadosEspecificosProps) {
  const watchedNormas = watch('normasSelecionadas') || [];
  const arquivoLocalidadesLixoZero = extractSelectedFile(watch('lixoZero.arquivoLocalidades'));
  const requiredField = { required: 'Campo obrigatório' };

  const hasLixoZero = watchedNormas.includes('Lixo Zero');
  const hasISO50001 = watchedNormas.includes('ISO 50001');
  const hasISO14001 = watchedNormas.includes('ISO 14001');
  const hasISO45001 = watchedNormas.includes('ISO 45001');
  const hasISO22000 = watchedNormas.includes('ISO 22000');
  const hasISO37001 = watchedNormas.includes('ISO 37001');

  // Se nenhuma norma específica foi selecionada, mostra mensagem
  if (!hasLixoZero && !hasISO50001 && !hasISO14001 && !hasISO45001 && !hasISO22000 && !hasISO37001) {
    return null;
  }

  return (
    <Stack gap={1.25} sx={{ '& .MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.95)', maxWidth: 'calc(105% - 32px)' }, '& .MuiOutlinedInput-notchedOutline legend': { fontSize: '0.95em' } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.9rem', textAlign: 'center' }}>
        DADOS ESPECÍFICOS
      </Typography>

      {/* Bloco Lixo Zero */}
      {hasLixoZero && (
        <>
          <SpecificSectionHeading norma="LIXO ZERO" />
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register('lixoZero.areaTotalM2', { ...requiredField, valueAsNumber: true })}
                label="Área total da empresa (m²) *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.lixoZero?.areaTotalM2)}
                helperText={errors.lixoZero?.areaTotalM2?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register('lixoZero.geracaoMensalKg', { ...requiredField, valueAsNumber: true })}
                label="Geração mensal de resíduos (kg/mês) *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.lixoZero?.geracaoMensalKg)}
                helperText={errors.lixoZero?.geracaoMensalKg?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <TextField
            {...register('lixoZero.residuosGerados', requiredField)}
            label="Quais são os resíduos gerados? *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.lixoZero?.residuosGerados)}
            helperText={errors.lixoZero?.residuosGerados?.message}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth error={Boolean(errors.lixoZero?.possuiGestaoResiduos)} size="small">
            <InputLabel shrink>Possui gestão de resíduos? *</InputLabel>
            <Select
              {...register('lixoZero.possuiGestaoResiduos', requiredField)}
              label="Possui gestão de resíduos? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.lixoZero?.possuiGestaoResiduos && <FormHelperText>{errors.lixoZero.possuiGestaoResiduos.message}</FormHelperText>}
          </FormControl>
          <TextField
            {...register('lixoZero.tiposResiduos', requiredField)}
            label="Quais são os tipos de resíduos gerados? *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.lixoZero?.tiposResiduos)}
            helperText={errors.lixoZero?.tiposResiduos?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('lixoZero.porcentualReciclagem', { ...requiredField, valueAsNumber: true })}
            label="Porcentual de reciclagem dos resíduos gerados (%) *"
            fullWidth
            size="small"
            type="number"
            error={Boolean(errors.lixoZero?.porcentualReciclagem)}
            helperText={errors.lixoZero?.porcentualReciclagem?.message}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth error={Boolean(errors.lixoZero?.existeDestinacao)} size="small">
            <InputLabel shrink>Existe destinação dos resíduos gerados? *</InputLabel>
            <Select
              {...register('lixoZero.existeDestinacao', requiredField)}
              label="Existe destinação dos resíduos gerados? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.lixoZero?.existeDestinacao && <FormHelperText>{errors.lixoZero.existeDestinacao.message}</FormHelperText>}
          </FormControl>
          {watch('lixoZero.existeDestinacao') === 'true' && (
            <FormControl component="fieldset">
              <Typography variant="body2" sx={{ mb: 1 }}>A destinação é feita pela:</Typography>
              <RadioGroup row defaultValue="propria">
                <FormControlLabel value="propria" control={<Radio />} label="Própria empresa" />
                <FormControlLabel value="contratada" control={<Radio />} label="Empresa contratada" />
              </RadioGroup>
            </FormControl>
          )}
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Caso a certificação seja para várias localidades, faça upload das informações por site:
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Button component="label" variant="contained" size="small">
                Selecionar arquivo
                <input hidden type="file" {...register('lixoZero.arquivoLocalidades')} />
              </Button>
              {arquivoLocalidadesLixoZero && (
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {arquivoLocalidadesLixoZero.name}
                </Typography>
              )}
            </Stack>
          </Box>
          {(hasISO50001 || hasISO14001 || hasISO45001 || hasISO22000 || hasISO37001) && (
            <Divider sx={{ my: 1.25, borderColor: 'rgba(102, 0, 0, 0.35)', borderBottomWidth: 2 }} />
          )}
        </>
      )}

      {/* Bloco ISO 50001 */}
      {hasISO50001 && (
        <>
          <SpecificSectionHeading norma="ISO 50001" />
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...register('iso50001.consumoTotalKwh', { ...requiredField, valueAsNumber: true })}
                label="Consumo total de energia (kWh) *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.iso50001?.consumoTotalKwh)}
                helperText={errors.iso50001?.consumoTotalKwh?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...register('iso50001.numeroFontesEnergia', { ...requiredField, valueAsNumber: true })}
                label="Número de fontes de energia *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.iso50001?.numeroFontesEnergia)}
                helperText={errors.iso50001?.numeroFontesEnergia?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...register('iso50001.numeroUsoSignificativos', { ...requiredField, valueAsNumber: true })}
                label="Número de usos significativos *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.iso50001?.numeroUsoSignificativos)}
                helperText={errors.iso50001?.numeroUsoSignificativos?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          {(hasISO14001 || hasISO45001 || hasISO22000 || hasISO37001) && (
            <Divider sx={{ my: 1.25, borderColor: 'rgba(102, 0, 0, 0.35)', borderBottomWidth: 2 }} />
          )}
        </>
      )}

      {/* Bloco ISO 14001 */}
      {hasISO14001 && (
        <>
          <SpecificSectionHeading norma="ISO 14001" />
          <TextField
            {...register('iso14001.aspectosAmbientais', requiredField)}
            label="Quais os aspectos ambientais identificados? *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso14001?.aspectosAmbientais)}
            helperText={errors.iso14001?.aspectosAmbientais?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('iso14001.requisitosLegaisAmbientais')}
            label="Requisitos legais ambientais relacionados com as atividades da empresa:"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso14001?.requisitosLegaisAmbientais)}
            helperText={errors.iso14001?.requisitosLegaisAmbientais?.message}
            InputLabelProps={{ shrink: true }}
          />
          {(hasISO45001 || hasISO22000 || hasISO37001) && (
            <Divider sx={{ my: 1.25, borderColor: 'rgba(102, 0, 0, 0.35)', borderBottomWidth: 2 }} />
          )}
        </>
      )}

      {/* Bloco ISO 45001 */}
      {hasISO45001 && (
        <>
          <SpecificSectionHeading norma="ISO 45001" />
          <TextField
            {...register('iso45001.riscosSSOIdentificados', requiredField)}
            label="Riscos à saúde e segurança ocupacional identificados: *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso45001?.riscosSSOIdentificados)}
            helperText={errors.iso45001?.riscosSSOIdentificados?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('iso45001.principaisAmeacas')}
            label="Principais ameaças e riscos dos processos:"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso45001?.principaisAmeacas)}
            helperText={errors.iso45001?.principaisAmeacas?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('iso45001.materiaisPerigosos')}
            label="Principais materiais perigosos usados nos processos:"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso45001?.materiaisPerigosos)}
            helperText={errors.iso45001?.materiaisPerigosos?.message}
            InputLabelProps={{ shrink: true }}
          />
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={Boolean(errors.iso45001?.acidentesSemAfastamento)} size="small">
                <InputLabel shrink>Acidentes sem afastamento (último ano)? *</InputLabel>
                <Select
                  {...register('iso45001.acidentesSemAfastamento', requiredField)}
                  label="Acidentes sem afastamento (último ano)? *"
                  defaultValue="false"
                  notched
                >
                  <MenuItem value="false">Não</MenuItem>
                  <MenuItem value="true">Sim</MenuItem>
                </Select>
                {errors.iso45001?.acidentesSemAfastamento && <FormHelperText>{errors.iso45001.acidentesSemAfastamento.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {watch('iso45001.acidentesSemAfastamento') === 'true' && (
                <TextField
                  {...register('iso45001.totalAcidentesSemAfastamento', { valueAsNumber: true })}
                  label="Total: *"
                  fullWidth
                  size="small"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={Boolean(errors.iso45001?.acidentesComAfastamento)} size="small">
                <InputLabel shrink>Acidentes com afastamento (último ano)? *</InputLabel>
                <Select
                  {...register('iso45001.acidentesComAfastamento', requiredField)}
                  label="Acidentes com afastamento (último ano)? *"
                  defaultValue="false"
                  notched
                >
                  <MenuItem value="false">Não</MenuItem>
                  <MenuItem value="true">Sim</MenuItem>
                </Select>
                {errors.iso45001?.acidentesComAfastamento && <FormHelperText>{errors.iso45001.acidentesComAfastamento.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {watch('iso45001.acidentesComAfastamento') === 'true' && (
                <TextField
                  {...register('iso45001.totalAcidentesComAfastamento', { valueAsNumber: true })}
                  label="Total: *"
                  fullWidth
                  size="small"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Grid>
          </Grid>
          <TextField
            {...register('iso45001.requisitosLegaisSSO', requiredField)}
            label="Requisitos legais relevantes à atividade: *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso45001?.requisitosLegaisSSO)}
            helperText={errors.iso45001?.requisitosLegaisSSO?.message}
            InputLabelProps={{ shrink: true }}
          />
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={Boolean(errors.iso45001?.alocaFuncionariosEmClientes)} size="small">
                <InputLabel shrink>Aloca funcionários em outras empresas? *</InputLabel>
                <Select
                  {...register('iso45001.alocaFuncionariosEmClientes', requiredField)}
                  label="Aloca funcionários em outras empresas? *"
                  defaultValue="false"
                  notched
                >
                  <MenuItem value="false">Não</MenuItem>
                  <MenuItem value="true">Sim</MenuItem>
                </Select>
                {errors.iso45001?.alocaFuncionariosEmClientes && <FormHelperText>{errors.iso45001.alocaFuncionariosEmClientes.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {watch('iso45001.alocaFuncionariosEmClientes') === 'true' && (
                <FormControl fullWidth error={Boolean(errors.iso45001?.sistemaGestaoCobreClientes)} size="small">
                  <InputLabel shrink>Sistema de Gestão cobre essas atividades? *</InputLabel>
                  <Select
                    {...register('iso45001.sistemaGestaoCobreClientes', requiredField)}
                    label="Sistema de Gestão cobre essas atividades? *"
                    defaultValue="false"
                    notched
                  >
                    <MenuItem value="false">Não</MenuItem>
                    <MenuItem value="true">Sim</MenuItem>
                  </Select>
                  {errors.iso45001?.sistemaGestaoCobreClientes && <FormHelperText>{errors.iso45001.sistemaGestaoCobreClientes.message}</FormHelperText>}
                </FormControl>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={Boolean(errors.iso45001?.avaliadaPorOrgao)} size="small">
                <InputLabel shrink>Avaliada por órgão municipal/estadual/federal (SSO)? *</InputLabel>
                <Select
                  {...register('iso45001.avaliadaPorOrgao', requiredField)}
                  label="Avaliada por órgão municipal/estadual/federal (SSO)? *"
                  defaultValue="false"
                  notched
                >
                  <MenuItem value="false">Não</MenuItem>
                  <MenuItem value="true">Sim</MenuItem>
                </Select>
                {errors.iso45001?.avaliadaPorOrgao && <FormHelperText>{errors.iso45001.avaliadaPorOrgao.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {watch('iso45001.avaliadaPorOrgao') === 'true' && (
                <TextField
                  {...register('iso45001.descricaoOrgao', requiredField)}
                  label="Qual e periodicidade: *"
                  fullWidth
                  size="small"
                  error={Boolean(errors.iso45001?.descricaoOrgao)}
                  helperText={errors.iso45001?.descricaoOrgao?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Grid>
          </Grid>
          {(hasISO22000 || hasISO37001) && (
            <Divider sx={{ my: 1.25, borderColor: 'rgba(102, 0, 0, 0.35)', borderBottomWidth: 2 }} />
          )}
        </>
      )}

      {/* Bloco ISO 22000 */}
      {hasISO22000 && (
        <>
          <SpecificSectionHeading norma="ISO 22000" />
          <TextField
            {...register('iso22000.appccs', requiredField)}
            label="APPCCs implementadas: *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso22000?.appccs)}
            helperText={errors.iso22000?.appccs?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('iso22000.linhasProcessos', requiredField)}
            label="Linhas de processos: *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso22000?.linhasProcessos)}
            helperText={errors.iso22000?.linhasProcessos?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('iso22000.categoriasAlimentos', requiredField)}
            label="Categorias de alimentos: *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso22000?.categoriasAlimentos)}
            helperText={errors.iso22000?.categoriasAlimentos?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('iso22000.subcategoriasAlimentos', requiredField)}
            label="Subcategorias de alimentos: *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso22000?.subcategoriasAlimentos)}
            helperText={errors.iso22000?.subcategoriasAlimentos?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('iso22000.pprs', requiredField)}
            label="Lista de Programas de Pré-Requisitos (PPRs): *"
            fullWidth
            multiline
            rows={2}
            size="small"
            error={Boolean(errors.iso22000?.pprs)}
            helperText={errors.iso22000?.pprs?.message}
            InputLabelProps={{ shrink: true }}
          />
          {hasISO37001 && <Divider sx={{ my: 1.25, borderColor: 'rgba(102, 0, 0, 0.35)', borderBottomWidth: 2 }} />}
        </>
      )}

      {/* Bloco ISO 37001 */}
      {hasISO37001 && (
        <>
          <SpecificSectionHeading norma="ISO 37001" />
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register('iso37001.pessoasServicosFinanceiros', { ...requiredField, valueAsNumber: true })}
                label="Pessoas na área de serviços financeiros: *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.iso37001?.pessoasServicosFinanceiros)}
                helperText={errors.iso37001?.pessoasServicosFinanceiros?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register('iso37001.pessoasElaboracaoOfertas', { ...requiredField, valueAsNumber: true })}
                label="Pessoas envolvidas em elaboração de ofertas/licitações: *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.iso37001?.pessoasElaboracaoOfertas)}
                helperText={errors.iso37001?.pessoasElaboracaoOfertas?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register('iso37001.pessoasAquisicoes', { ...requiredField, valueAsNumber: true })}
                label="Pessoas envolvidas em aquisições e compras: *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.iso37001?.pessoasAquisicoes)}
                helperText={errors.iso37001?.pessoasAquisicoes?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register('iso37001.pessoasComunicacaoSubcontratados', { ...requiredField, valueAsNumber: true })}
                label="Pessoas em comunicação com subcontratados/clientes: *"
                fullWidth
                size="small"
                type="number"
                error={Boolean(errors.iso37001?.pessoasComunicacaoSubcontratados)}
                helperText={errors.iso37001?.pessoasComunicacaoSubcontratados?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth error={Boolean(errors.iso37001?.realizaDoacoes)} size="small">
            <InputLabel shrink>A empresa realiza doações? *</InputLabel>
            <Select
              {...register('iso37001.realizaDoacoes', requiredField)}
              label="A empresa realiza doações? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.iso37001?.realizaDoacoes && <FormHelperText>{errors.iso37001.realizaDoacoes.message}</FormHelperText>}
          </FormControl>
          {watch('iso37001.realizaDoacoes') === 'true' && (
            <TextField
              {...register('iso37001.descricaoDoacoes', requiredField)}
              label="Liste as principais doações do último ano: *"
              fullWidth
              multiline
              rows={2}
              size="small"
              error={Boolean(errors.iso37001?.descricaoDoacoes)}
              helperText={errors.iso37001?.descricaoDoacoes?.message}
              InputLabelProps={{ shrink: true }}
            />
          )}
          <FormControl fullWidth error={Boolean(errors.iso37001?.envolvidoSuborno)} size="small">
            <InputLabel shrink>Membro do quadro societário envolvido com suspeitas de suborno? *</InputLabel>
            <Select
              {...register('iso37001.envolvidoSuborno', requiredField)}
              label="Membro do quadro societário envolvido com suspeitas de suborno? *"
              defaultValue="false"
              notched
            >
              <MenuItem value="false">Não</MenuItem>
              <MenuItem value="true">Sim</MenuItem>
            </Select>
            {errors.iso37001?.envolvidoSuborno && <FormHelperText>{errors.iso37001.envolvidoSuborno.message}</FormHelperText>}
          </FormControl>
        </>
      )}
    </Stack>
  );
}
