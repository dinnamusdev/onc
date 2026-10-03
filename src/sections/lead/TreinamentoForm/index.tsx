'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import Step1TipoSolicitante from './Step1TipoSolicitante';
import Step2Empresa from './Step2Empresa';
import Step2Participante from './Step2Participante';
import Step3Treinamentos from './Step3Treinamentos';
import Step4Revisao from './Step4Revisao';

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

export default function TreinamentoForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
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

  const handleNext = async () => {
    const fieldsToValidate = requiredFieldsByStep[activeStep];
    
    // Validação especial para Step 1 (Tipo e Solicitante)
    if (activeStep === 0) {
      const isValid = await trigger(['paraQuem', 'nomeContato', 'cargo', 'email', 'telefone'] as any, { shouldFocus: true });
      if (!isValid) {
        setSubmitError('Preencha nome, cargo, e-mail e telefone do solicitante para continuar.');
        return;
      }
    }

    setSubmitError(null);
    
    // Validação especial para Step 1 (Dados da Empresa ou Participante)
    if (activeStep === 1) {
      if (paraQuem === 'empresa') {
        const empresaFields = ['empresa.cnpj', 'empresa.razaoSocial', 'empresa.setorEmpresa', 'empresa.emailEmpresa', 'empresa.telefoneEmpresa', 'empresa.endereco', 'empresa.numero', 'empresa.bairro', 'empresa.cep', 'empresa.cidade', 'empresa.estado'] as any;
        const isValid = await trigger(empresaFields);
        if (!isValid) return;
      } else {
        const participanteFields = ['participante.nomeCompleto', 'participante.cpf', 'participante.email', 'participante.dataNascimento', 'participante.telefone', 'participante.endereco', 'participante.numero', 'participante.bairro', 'participante.cep', 'participante.cidade', 'participante.estado'] as any;
        const isValid = await trigger(participanteFields);
        if (!isValid) return;
      }
    }

    // Validação especial para Step 2 (Treinamentos)
    if (activeStep === 2) {
      const treinamentos = watch('treinamentos') || [];
      if (treinamentos.length === 0) {
        setSubmitError('Adicione pelo menos um treinamento.');
        return;
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
      setSubmitError('Erro ao enviar o formulário. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={2}>
      {/* Título */}
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 1 }}>
        Solicitação de Treinamento
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              type="button"
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
              variant="outlined"
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
