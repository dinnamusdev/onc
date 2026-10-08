'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
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
import { useLeadFormHeader } from '@/contexts/LeadFormHeaderContext';

// @types
import { CertificacaoStep1, CertificacaoStep2, CertificacaoStep3, CertificacaoStep4, CertificacaoStep5, CertificacaoStep6 } from '@/types/lead';

// @utils
import { hasSelectedFile } from '@/utils/file';

/***************************  CERTIFICACAO FORM  ***************************/

const steps = ['Tipo e Solicitante', 'Normas', 'Empresa', 'Negócio', 'Sistema de Gestão', 'Específico', 'Revisão'];

// Campos obrigatórios por step de acordo com a documentação
const requiredFieldsByStep: Record<number, string[]> = {
  0: ['tipoCertificacao', 'nomeContato', 'cargo', 'empresa', 'email', 'telefone'],
  1: [], // Normas - validado manualmente em handleNext (normasSelecionadas é um array, não um input registrado)
  2: ['cnpj', 'razaoSocial', 'setorEmpresa', 'emailEmpresa', 'telefoneEmpresa', 'endereco', 'numero', 'bairro', 'cep', 'cidade', 'estado'],
  3: ['produtosServicos', 'principaisProcessos', 'jaCertificada', 'responssavelProjeto', 'terceirizaProcesso'],
  4: ['grauImplementacao', 'grauIntegracao', 'cobreTodasLocalidades', 'utilizaConsultoria', 'certificacaoAcreditada', 'escopo', 'localidades', 'funcionariosEmClientes'],
  5: [], // Campos específicos dependem das normas selecionadas
  6: ['aceitaTermos', 'aceitaPoliticaPrivacidade'] // Revisão - validar checkboxes
};

const headerSubtitle = 'Caso sua solicitação seja diferente dessa, retorne ao Site do ONC e registre uma nova solicitação.';

export default function CertificacaoForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Publica título, frase de aviso e Stepper no cabeçalho fixo do LeadLayout (junto com a logo),
  // para que fiquem sempre visíveis e só o conteúdo do formulário role com a página.
  const { setHeader, clearHeader, showNotice } = useLeadFormHeader();

  // Limpa o cabeçalho apenas ao desmontar (ex.: ao navegar para fora deste formulário).
  useEffect(() => {
    return () => clearHeader();
  }, [clearHeader]);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    getValues
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

  const validateStep = useCallback(async (stepIndex: number) => {
    const fieldsToValidate = requiredFieldsByStep[stepIndex];
    const isValid = await trigger(fieldsToValidate as any, { shouldFocus: true });
    const hasMissingField = fieldsToValidate.some((field) => {
      if (stepIndex === 4 && field === 'localidades') return false;
      const value = getValues(field as any);
      return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    });

    if (!isValid || hasMissingField) {
      showNotice('Por favor, preencha todos os campos obrigatórios antes de avançar.');
      return false;
    }

    // Validações específicas por step
    if (stepIndex === 1) {
      // Step 2 - Normas: validar se pelo menos uma norma foi selecionada
      const normasSelecionadas = getValues('normasSelecionadas') || [];
      if (normasSelecionadas.length === 0) {
        showNotice('Selecione ao menos uma norma para continuar.');
        return false;
      }
    }

    if (stepIndex === 3) {
      // Step 4 - Dados do Negócio: validar campos condicionais
      const jaCertificada = getValues('jaCertificada');
      if (String(jaCertificada) === 'true') {
        const descricaoCertificacoes = getValues('descricaoCertificacoes');
        if (!descricaoCertificacoes || descricaoCertificacoes.trim() === '') {
          showNotice('Descreva as certificações já obtidas para continuar.');
          return false;
        }
      }

      const terceirizaProcesso = getValues('terceirizaProcesso');
      if (String(terceirizaProcesso) === 'true') {
        const processosTerceirizados = getValues('processosTerceirizados');
        if (!processosTerceirizados || processosTerceirizados.trim() === '') {
          showNotice('Descreva os processos terceirizados para continuar.');
          return false;
        }
      }
    }

    if (stepIndex === 4) {
      // Step 5 - Sistema de Gestão: validar campos condicionais
      const cobreTodasLocalidades = getValues('cobreTodasLocalidades');
      if (String(cobreTodasLocalidades) === 'false') {
        const localidadesIndependentes = getValues('localidadesIndependentes');
        if (!localidadesIndependentes || localidadesIndependentes.trim() === '') {
          showNotice('Descreva as localidades com Sistemas de Gestão independentes para continuar.');
          return false;
        }
      }

      const utilizaConsultoria = getValues('utilizaConsultoria');
      if (String(utilizaConsultoria) === 'true') {
        const nomeConsultoria = getValues('nomeConsultoria');
        const nomeConsultor = getValues('nomeConsultor');
        if (!nomeConsultoria || !nomeConsultor) {
          showNotice('Informe o nome da consultoria e do consultor para continuar.');
          return false;
        }
      }

      const funcionariosEmClientes = getValues('funcionariosEmClientes');
      if (String(funcionariosEmClientes) === 'true') {
        const descricaoClientes = getValues('descricaoClientes');
        if (!descricaoClientes || descricaoClientes.trim() === '') {
          showNotice('Descreva em quais clientes os funcionários estão alocados para continuar.');
          return false;
        }
      }

      // Validar localidades: arquivo OU tabela preenchida
      const arquivoLocalidades = getValues('arquivoLocalidades');
      const localidades = getValues('localidades') || [];
      const temArquivo = hasSelectedFile(arquivoLocalidades);
      const temLocalidadePreenchida = localidades.length > 0;

      if (!temArquivo && !temLocalidadePreenchida) {
        showNotice(
          'Envie um arquivo com as localidades OU clique em "Adicionar Localidade" e preencha ao menos uma linha na tabela para continuar.'
        );
        return false;
      }
    }

    if (stepIndex === 5) {
      const normas = getValues('normasSelecionadas') || [];
      const fieldsToValidate: string[] = [];
      if (normas.includes('Lixo Zero')) {
        fieldsToValidate.push(
          'lixoZero.areaTotalM2',
          'lixoZero.geracaoMensalKg',
          'lixoZero.residuosGerados',
          'lixoZero.possuiGestaoResiduos',
          'lixoZero.tiposResiduos',
          'lixoZero.porcentualReciclagem',
          'lixoZero.existeDestinacao'
        );
      }
      if (normas.includes('ISO 50001')) {
        fieldsToValidate.push('iso50001.consumoTotalKwh', 'iso50001.numeroFontesEnergia', 'iso50001.numeroUsoSignificativos');
      }
      if (normas.includes('ISO 14001')) {
        fieldsToValidate.push('iso14001.aspectosAmbientais');
      }
      if (normas.includes('ISO 45001')) {
        fieldsToValidate.push(
          'iso45001.riscosSSOIdentificados',
          'iso45001.acidentesSemAfastamento',
          'iso45001.acidentesComAfastamento',
          'iso45001.requisitosLegaisSSO'
        );
        if (String(getValues('iso45001.alocaFuncionariosEmClientes')) === 'true') {
          fieldsToValidate.push('iso45001.alocaFuncionariosEmClientes', 'iso45001.sistemaGestaoCobreClientes');
        }
        if (String(getValues('iso45001.avaliadaPorOrgao')) === 'true') {
          fieldsToValidate.push('iso45001.avaliadaPorOrgao', 'iso45001.descricaoOrgao');
        }
      }
      if (normas.includes('ISO 22000')) {
        fieldsToValidate.push(
          'iso22000.appccs',
          'iso22000.linhasProcessos',
          'iso22000.categoriasAlimentos',
          'iso22000.subcategoriasAlimentos',
          'iso22000.pprs'
        );
      }
      if (normas.includes('ISO 37001')) {
        fieldsToValidate.push(
          'iso37001.pessoasServicosFinanceiros',
          'iso37001.pessoasElaboracaoOfertas',
          'iso37001.pessoasAquisicoes',
          'iso37001.pessoasComunicacaoSubcontratados',
          'iso37001.realizaDoacoes',
          'iso37001.descricaoDoacoes',
          'iso37001.envolvidoSuborno'
        );
      }

      const specificFieldsValid = fieldsToValidate.length === 0 || (await trigger(fieldsToValidate as any, { shouldFocus: true }));
      const hasMissingSpecificField = fieldsToValidate.some((field) => {
        const value = getValues(field as any);
        return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
      });
      if (!specificFieldsValid || hasMissingSpecificField) {
        showNotice('Preencha os dados específicos obrigatórios para continuar.');
        return false;
      }
    }

    return true;
  }, [getValues, showNotice, trigger]);

  const handleStepClick = useCallback(async (stepIndex: number) => {
    if (stepIndex <= activeStep) {
      setActiveStep(stepIndex);
      return;
    }

    for (let currentStep = 0; currentStep < stepIndex; currentStep += 1) {
      if (!(await validateStep(currentStep))) {
        setActiveStep(currentStep);
        return;
      }
    }

    setActiveStep(stepIndex);
  }, [activeStep, validateStep]);

  useEffect(() => {
    setHeader({ title: 'Solicitação de Certificação', subtitle: headerSubtitle, steps, activeStep, onStepClick: handleStepClick });
  }, [activeStep, handleStepClick, setHeader]);

  const handleNext = async () => {
    if (!(await validateStep(activeStep))) return;
    // Se passou todas as validações, avança
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleEdit = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const handleSubmitForm = async () => {
    setIsSubmitting(true);

    try {
      // Validar campos obrigatórios do step 6 (Revisão)
      const fieldsToValidate = requiredFieldsByStep[activeStep];
      console.log('Validando campos:', fieldsToValidate);
      const isValid = await trigger(fieldsToValidate as any);

      if (!isValid) {
        console.warn('Validação falhou para campos:', fieldsToValidate);
        showNotice('Por favor, marque os campos obrigatórios antes de enviar.');
        setIsSubmitting(false);
        return;
      }

      console.log('Validação passou, enviando formulário...');
      handleSubmit(onSubmit)();
    } catch (error) {
      console.error('Erro ao processar envio:', error);
      showNotice('Ocorreu um erro ao processar o envio. Tente novamente.');
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
      showNotice('Erro ao enviar o formulário. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={1.5}>
      {/* Card do Formulário */}
      <Card>
        <CardContent sx={{ p: 1.5 }}>
          {activeStep === 0 && <Step1TipoSolicitante register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 1 && <Step2Normas register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 2 && <Step3DadosEmpresa register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 3 && <Step4DadosNegocio register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 4 && <Step5SistemaGestao register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 5 && <Step6DadosEspecificos register={register} errors={errors} watch={watch} setValue={setValue} />}
          {activeStep === 6 && <Step7Revisao register={register} errors={errors} watch={watch} onEdit={handleEdit} />}

          {/* Botões de navegação */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0 || isSubmitting} 
              onClick={handleBack} 
              variant="contained"
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
