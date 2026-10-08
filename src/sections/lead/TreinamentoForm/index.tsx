'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import Step1TipoSolicitante from './Step1TipoSolicitante';
import Step2Empresa from './Step2Empresa';
import Step2Participante from './Step2Participante';
import Step3Treinamentos from './Step3Treinamentos';
import Step4Revisao from './Step4Revisao';
import { useLeadFormHeader } from '@/contexts/LeadFormHeaderContext';

// @types
import { TreinamentoFormData } from '@/types/lead';

/***************************  TREINAMENTO FORM  ***************************/

const steps = ['Tipo e Solicitante', 'Empresa / Participante', 'Treinamentos', 'Revisão'];

const requiredFieldsByStep: Record<number, string[]> = {
  0: ['paraQuem', 'nomeContato', 'cargo', 'email', 'telefone'],
  1: [], // Será validado especificamente
  2: ['treinamentos'],
  3: ['aceitaTermos', 'aceitaPoliticaPrivacidade']
};

const headerSubtitle = 'Caso sua solicitação seja diferente dessa, retorne ao Site do ONC e registre uma nova solicitação.';

export default function TreinamentoForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Publica título, frase de aviso e Stepper no cabeçalho fixo do LeadLayout (junto com a logo),
  // para que fiquem sempre visíveis e só o conteúdo do formulário role com a página.
  const { setHeader, clearHeader, showNotice, dismissNotice } = useLeadFormHeader();

  // Limpa o cabeçalho apenas ao desmontar (ex.: ao navegar para fora deste formulário).
  useEffect(() => {
    return () => clearHeader();
  }, [clearHeader]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    getValues,
    control
  } = useForm<TreinamentoFormData>({
    mode: 'onBlur',
    defaultValues: {
      paraQuem: 'empresa',
      ondeNosConheceu: '',
      nomeContato: '',
      cargo: '',
      email: '',
      dataNascimento: '',
      telefone: '',
      whatsapp: '',
      empresa: {
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
        estado: 'SP'
      },
      participante: {
        nomeCompleto: '',
        cpf: '',
        email: '',
        dataNascimento: '',
        telefone: '',
        whatsapp: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cep: '',
        cidade: '',
        estado: 'SP',
        empresaOndeTrabalha: '',
        cargo: ''
      },
      treinamentos: [
        {
          normaId: 1,
          tipoTreinamentoId: 1,
          totalParticipantes: 1,
          formatoId: 1,
          dataPrevista: ''
        }
      ],
      aceitaTermos: false,
      aceitaPoliticaPrivacidade: false
    }
  });

  const paraQuem = watch('paraQuem');

  const validateStep = useCallback(async (stepIndex: number) => {
    dismissNotice();
    const fieldsToValidate = requiredFieldsByStep[stepIndex];
    const isValid = await trigger(fieldsToValidate as any, { shouldFocus: true });
    const hasMissingField = fieldsToValidate.some((field) => {
      const value = getValues(field as any);
      return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    });
    if (!isValid || hasMissingField) {
      showNotice('Preencha todos os campos obrigatórios desta etapa para continuar.');
      return false;
    }

    // Validação especial para Step 1 (Tipo e Solicitante)
    if (stepIndex === 0) {
      const isSolicitanteValid = await trigger(['paraQuem', 'nomeContato', 'cargo', 'email', 'telefone'] as any, { shouldFocus: true });
      if (!isSolicitanteValid) {
        showNotice('Preencha nome, cargo, e-mail e telefone do solicitante para continuar.');
        return false;
      }
    }

    // Validação especial para Step 1 (Dados da Empresa ou Participante)
    if (stepIndex === 1) {
      if (getValues('paraQuem') === 'empresa') {
        const empresaFieldNames = ['empresa.cnpj', 'empresa.razaoSocial', 'empresa.setorEmpresa', 'empresa.emailEmpresa', 'empresa.telefoneEmpresa', 'empresa.endereco', 'empresa.numero', 'empresa.bairro', 'empresa.cep', 'empresa.cidade', 'empresa.estado'];
        const empresaFields = empresaFieldNames as any;
        const isValid = await trigger(empresaFields);
        const hasMissingCompanyField = empresaFieldNames.some((field) => {
          const value = getValues(field as any);
          return value === undefined || value === null || value === '';
        });
        if (!isValid || hasMissingCompanyField) {
          showNotice('Preencha todos os campos obrigatórios da empresa para continuar.');
          return false;
        }
      } else {
        const participanteFieldNames = ['participante.nomeCompleto', 'participante.cpf', 'participante.email', 'participante.dataNascimento', 'participante.telefone', 'participante.endereco', 'participante.numero', 'participante.bairro', 'participante.cep', 'participante.cidade', 'participante.estado'];
        const participanteFields = participanteFieldNames as any;
        const isValid = await trigger(participanteFields);
        const hasMissingParticipantField = participanteFieldNames.some((field) => {
          const value = getValues(field as any);
          return value === undefined || value === null || value === '';
        });
        if (!isValid || hasMissingParticipantField) {
          showNotice('Preencha todos os campos obrigatórios do participante para continuar.');
          return false;
        }
      }
    }

    // Validação especial para Step 2 (Treinamentos)
    if (stepIndex === 2) {
      const treinamentos = getValues('treinamentos') || [];
      if (treinamentos.length === 0) {
        showNotice('Adicione pelo menos um treinamento.');
        return false;
      }
      const treinamentoFieldsValid = treinamentos.every(
        (treinamento) =>
          treinamento.normaId !== undefined &&
          treinamento.normaId !== null &&
          treinamento.tipoTreinamentoId !== undefined &&
          treinamento.tipoTreinamentoId !== null &&
          Number(treinamento.totalParticipantes) >= 1 &&
          treinamento.formatoId !== undefined &&
          treinamento.formatoId !== null &&
          Boolean(treinamento.dataPrevista)
      );
      if (!treinamentoFieldsValid) {
        await trigger('treinamentos', { shouldFocus: true });
        showNotice('Preencha os dados obrigatórios de todos os treinamentos para continuar.');
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
    setHeader({ title: 'Solicitação de Treinamento', subtitle: headerSubtitle, steps, activeStep, onStepClick: handleStepClick });
  }, [activeStep, handleStepClick, setHeader]);

  const handleNext = async () => {
    if (!(await validateStep(activeStep))) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleEdit = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const handleSubmitForm = async () => {
    dismissNotice();
    setIsSubmitting(true);

    try {
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

  const onSubmit: SubmitHandler<TreinamentoFormData> = async (data) => {
    try {
      console.log('Form submitted:', data);
      // TODO: Submit to backend - Descomentar quando API estiver pronta
      // const response = await fetch('/api/lead/treinamento', {
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
          {activeStep === 0 && <Step1TipoSolicitante register={register} errors={errors} watch={watch} control={control} />}
          
          {activeStep === 1 && paraQuem === 'empresa' && (
            <Step2Empresa register={register} errors={errors} watch={watch} control={control} />
          )}
          
          {activeStep === 1 && paraQuem === 'pessoa_fisica' && (
            <Step2Participante register={register} errors={errors} watch={watch} control={control} />
          )}
          
          {activeStep === 2 && <Step3Treinamentos register={register} errors={errors} watch={watch} control={control} />}
          
          {activeStep === 3 && <Step4Revisao register={register} errors={errors} watch={watch} onEdit={handleEdit} />}

          {/* Botões de navegação */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              type="button"
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
              variant="contained"
              size="small"
            >
              Anterior
            </Button>
            <Button
              type="button"
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
