'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import Step1TipoSolicitante from './Step1TipoSolicitante';
import Step2Normas from './Step2Normas';
import Step3DadosEmpresa from './Step3DadosEmpresa';
import Step4DadosNegocio from './Step4DadosNegocio';
import Step5SistemaGestao from './Step5SistemaGestao';
import Step6DadosEspecificos from './Step6DadosEspecificos';
import Step7Revisao from './Step7Revisao';

// @types
import { CertificacaoStep1, CertificacaoStep2, CertificacaoStep3, CertificacaoStep4, CertificacaoStep5, CertificacaoStep6 } from '@/types/lead';

/***************************  CERTIFICACAO FORM  ***************************/

const steps = ['Tipo e Solicitante', 'Normas', 'Empresa', 'Negócio', 'Sistema de Gestão', 'Específico', 'Revisão'];

// Campos obrigatórios por step de acordo com a documentação
const requiredFieldsByStep: Record<number, string[]> = {
  0: ['tipoCertificacao', 'nomeContato', 'cargo', 'empresa', 'email', 'telefone'],
  1: ['normasSelecionadas'],
  2: ['cnpj', 'razaoSocial', 'setorEmpresa', 'emailEmpresa', 'telefoneEmpresa', 'endereco', 'numero', 'bairro', 'cep', 'cidade', 'estado'],
  3: ['produtosServicos', 'principaisProcessos', 'jaCertificada', 'responssavelProjeto', 'terceirizaProcesso'],
  4: ['grauImplementacao', 'grauIntegracao', 'cobreTodasLocalidades', 'utilizaConsultoria', 'certificacaoAcreditada', 'escopo', 'localidades', 'funcionariosEmClientes'],
  5: [], // Campos específicos dependem das normas selecionadas
  6: ['aceitaTermos', 'aceitaPoliticaPrivacidade'] // Revisão - validar checkboxes
};

export default function CertificacaoForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6>({
    mode: 'onBlur',
    defaultValues: {
      tipoCertificacao: 'inicial',
      ondeNosConheceu: '',
      nomeContato: '',
      cargo: '',
      empresa: '',
      email: '',
      dataNascimento: '',
      telefone: '',
      whatsapp: '',
      certificados: [],
      normasSelecionadas: [],
      outraNorma: '',
      cnpj: '',
      website: '',
      razaoSocial: '',
      setorEmpresa: 'privado',
      emailEmpresa: '',
      telefoneEmpresa: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade: '',
      estado: 'SP',
      produtosServicos: '',
      principaisProcessos: '',
      principaisObrigacoesLegais: '',
      jaCertificada: 'false',
      descricaoCertificacoes: '',
      responssavelProjeto: 'false',
      terceirizaProcesso: 'false',
      processosTerceirizados: '',
      grauImplementacao: 'total',
      grauIntegracao: 'total',
      cobreTodasLocalidades: 'true',
      localidadesIndependentes: '',
      utilizaConsultoria: 'false',
      nomeConsultoria: '',
      nomeConsultor: '',
      certificacaoAcreditada: 'false',
      escopo: '',
      arquivoLocalidades: undefined,
      localidades: [],
      funcionariosEmClientes: 'false',
      descricaoClientes: '',
      lixoZero: {
        areaTotalM2: 0,
        residuosGerados: '',
        possuiGestaoResiduos: 'false',
        tiposResiduos: '',
        geracaoMensalKg: 0,
        porcentualReciclagem: 0,
        existeDestinacao: 'false',
        quemRealiza: 'propria',
        arquivoLocalidades: undefined
      },
      iso50001: {
        consumoTotalKwh: 0,
        numeroFontesEnergia: 0,
        numeroUsoSignificativos: 0
      },
      iso14001: {
        aspectosAmbientais: '',
        requisitosLegaisAmbientais: ''
      },
      iso45001: {
        riscosSSOIdentificados: '',
        principaisAmeacas: '',
        materiaisPerigosos: '',
        acidentesSemAfastamento: 'false',
        totalAcidentesSemAfastamento: 0,
        acidentesComAfastamento: 'false',
        totalAcidentesComAfastamento: 0,
        requisitosLegaisSSO: '',
        alocaFuncionariosEmClientes: 'false',
        sistemaGestaoCobreClientes: 'false',
        avaliadaPorOrgao: 'false',
        descricaoOrgao: ''
      },
      iso22000: {
        appccs: '',
        linhasProcessos: '',
        categoriasAlimentos: '',
        subcategoriasAlimentos: '',
        pprs: ''
      },
      iso37001: {
        pessoasServicosFinanceiros: 0,
        pessoasElaboracaoOfertas: 0,
        pessoasAquisicoes: 0,
        pessoasComunicacaoSubcontratados: 0,
        realizaDoacoes: 'false',
        descricaoDoacoes: '',
        envolvidoSuborno: 'false'
      },
      aceitaTermos: false,
      aceitaPoliticaPrivacidade: false
    }
  });

  const handleNext = async () => {
    // Validar campos obrigatórios do step atual
    const fieldsToValidate = requiredFieldsByStep[activeStep];
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid) {
      // Validações específicas por step
      if (activeStep === 1) {
        // Step 2 - Normas: validar se pelo menos uma norma foi selecionada
        const normasSelecionadas = watch('normasSelecionadas') || [];
        if (normasSelecionadas.length === 0) {
          return; // Não avança
        }
      }

      if (activeStep === 3) {
        // Step 4 - Dados do Negócio: validar campos condicionais
        const jaCertificada = watch('jaCertificada');
        if (String(jaCertificada) === 'true') {
          const descricaoCertificacoes = watch('descricaoCertificacoes');
          if (!descricaoCertificacoes || descricaoCertificacoes.trim() === '') {
            return; // Não avança
          }
        }

        const terceirizaProcesso = watch('terceirizaProcesso');
        if (String(terceirizaProcesso) === 'true') {
          const processosTerceirizados = watch('processosTerceirizados');
          if (!processosTerceirizados || processosTerceirizados.trim() === '') {
            return; // Não avança
          }
        }
      }

      if (activeStep === 4) {
        // Step 5 - Sistema de Gestão: validar campos condicionais
        const cobreTodasLocalidades = watch('cobreTodasLocalidades');
        if (String(cobreTodasLocalidades) === 'false') {
          const localidadesIndependentes = watch('localidadesIndependentes');
          if (!localidadesIndependentes || localidadesIndependentes.trim() === '') {
            return; // Não avança
          }
        }

        const utilizaConsultoria = watch('utilizaConsultoria');
        if (String(utilizaConsultoria) === 'true') {
          const nomeConsultoria = watch('nomeConsultoria');
          const nomeConsultor = watch('nomeConsultor');
          if (!nomeConsultoria || !nomeConsultor) {
            return; // Não avança
          }
        }

        const funcionariosEmClientes = watch('funcionariosEmClientes');
        if (String(funcionariosEmClientes) === 'true') {
          const descricaoClientes = watch('descricaoClientes');
          if (!descricaoClientes || descricaoClientes.trim() === '') {
            return; // Não avança
          }
        }

        // Validar localidades: arquivo OU tabela preenchida
        const arquivoLocalidades = watch('arquivoLocalidades');
        const localidades = watch('localidades') || [];
        const temArquivo = arquivoLocalidades instanceof File; // Verifica se é um objeto File
        const temLocalidadePreenchida = localidades.length > 0;

        if (!temArquivo && !temLocalidadePreenchida) {
          return; // Não avança se não tem arquivo E nem localidades preenchidas
        }
      }

      // Se passou todas as validações, avança
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleEdit = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const handleSubmitForm = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    
    try {
      // Validar campos obrigatórios do step 6 (Revisão)
      const fieldsToValidate = requiredFieldsByStep[activeStep];
      console.log('Validando campos:', fieldsToValidate);
      const isValid = await trigger(fieldsToValidate as any);

      if (!isValid) {
        console.warn('Validação falhou para campos:', fieldsToValidate);
        setSubmitError('Por favor, marque os campos obrigatórios antes de enviar.');
        setIsSubmitting(false);
        return;
      }

      console.log('Validação passou, enviando formulário...');
      handleSubmit(onSubmit)();
    } catch (error) {
      console.error('Erro ao processar envio:', error);
      setSubmitError('Ocorreu um erro ao processar o envio. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<CertificacaoStep1 & CertificacaoStep2 & CertificacaoStep3 & CertificacaoStep4 & CertificacaoStep5 & CertificacaoStep6> = async (data) => {
    try {
      console.log('Form submitted:', data);
      // TODO: Submit to backend - Descomentar quando API estiver pronta
      // const response = await fetch('/api/lead/certificacao', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // if (!response.ok) throw new Error('Erro ao enviar formulário');

      setIsSubmitting(false);
      // Redirecionar para tela de agradecimento
      router.push('/solicitar-proposta/obrigado');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitError('Erro ao enviar o formulário. Tente novamente.');
      setIsSubmitting(false);
      // TODO: Exibir mensagem de erro ao usuário via Snackbar
    }
  };

  return (
    <Stack gap={2}>
      {/* Título */}
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 1 }}>
        Solicitação de Certificação
      </Typography>

      {/* Subtítulo de aviso */}
      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>
        Caso sua solicitação seja diferente dessa, retorne ao Site do ONC e registre uma nova solicitação.
      </Typography>

      {/* Alerta de erro */}
      {submitError && (
        <Alert severity="error" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Card do Formulário */}
      <Card>
        <CardContent>
          {activeStep === 0 && <Step1TipoSolicitante register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 1 && <Step2Normas register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 2 && <Step3DadosEmpresa register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 3 && <Step4DadosNegocio register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 4 && <Step5SistemaGestao register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 5 && <Step6DadosEspecificos register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 6 && <Step7Revisao register={register} errors={errors} watch={watch} onEdit={handleEdit} />}

          {/* Botões de navegação */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              disabled={activeStep === 0 || isSubmitting} 
              onClick={handleBack} 
              variant="outlined" 
              size="small"
            >
              Anterior
            </Button>
            <Button 
              onClick={activeStep === steps.length - 1 ? handleSubmitForm : handleNext}
              disabled={isSubmitting}
              variant="contained" 
              size="small"
              startIcon={isSubmitting && activeStep === steps.length - 1 ? <CircularProgress size={16} /> : undefined}
            >
              {isSubmitting && activeStep === steps.length - 1 ? 'Enviando...' : activeStep === steps.length - 1 ? 'Enviar' : 'Próximo'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
