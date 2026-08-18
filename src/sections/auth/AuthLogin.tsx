'use client';

// @next
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useTransition } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { useForm, SubmitHandler } from 'react-hook-form';

// @project
import { APP_DEFAULT_PATH, AUTH_USER_KEY } from '@/config';
import { login, getUserProfile } from '@/utils/api/auth';
import { emailSchema, passwordSchema } from '@/utils/validation-schema/common';

// @types
import { AuthRole } from '@/enum';
import { User } from '@/types/auth';

// @icons
import { IconEye, IconEyeOff } from '@tabler/icons-react';

// @types
import { CommonAuthComponentProps } from '@/types/auth';

interface LoginFormInput {
  email: string;
  password: string;
}

interface UserCredentials extends LoginFormInput {
  title: string;
}

// Mock user credentials
const userCredentials = [
  { title: 'Super Admin', email: 'super_admin@saasable.io', password: 'Super@123' },
  { title: 'Admin', email: 'admin@saasable.io', password: 'Admin@123' },
  { title: 'User', email: 'user@saasable.io', password: 'User@123' }
];

function isChildObjectContained(parent: UserCredentials, child: LoginFormInput) {
  return Object.entries(child).every(
    ([key, value]) => Object.prototype.hasOwnProperty.call(parent, key) && parent[key as keyof UserCredentials] === value
  );
}

// Função para criar objeto User com dados do perfil e token
function createUserFromProfile(profileData: any, token: string, email: string): User {
  return {
    id: profileData.id || '',
    email: email,
    role: AuthRole.USER, // Será ajustado conforme necessário
    contact: profileData.whatsapp || profileData.telefone || '',
    dialcode: '',
    firstname: profileData.nomeCompleto || profileData.userName || '',
    lastname: '',
    token: token,
    // Campos do perfil
    userName: profileData.userName,
    whatsapp: profileData.whatsapp,
    telefone: profileData.telefone,
    nomeCompleto: profileData.nomeCompleto,
    cpf: profileData.cpf,
    dataCadastro: profileData.dataCadastro,
    fotoURL: profileData.fotoURL,
    logradouro: profileData.logradouro,
    numero: profileData.numero,
    complemento: profileData.complemento,
    bairro: profileData.bairro,
    cidade: profileData.cidade,
    estado: profileData.estado,
    cep: profileData.cep
  };
}

/***************************  AUTH - LOGIN  ***************************/

export default function AuthLogin({ inputSx }: CommonAuthComponentProps) {
  const router = useRouter();
  const theme = useTheme();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isProcessing, startTransition] = useTransition();
  const [loginError, setLoginError] = useState('');

  // Initialize react-hook-form
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LoginFormInput>({ defaultValues: { email: 'super_admin@saasable.io', password: 'Super@123' } });

  const formData = watch();

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormInput> = (formData) => {
    setLoginError('');

    startTransition(async () => {
      // 1. Fazer login para obter o token
      const { data, error } = await login(formData);
      if (error) {
        setLoginError(error || 'Something went wrong');
        return;
      }

      // Extrair o token da resposta da API
      const token = data?.data || data;
      if (typeof token !== 'string') {
        setLoginError('Invalid token format received from server');
        return;
      }

      // 2. Buscar dados completos do perfil do usuário usando o endpoint fornecido
      const { data: profileData, error: profileError } = await getUserProfile(formData.email, token);
      
      if (profileError || !profileData) {
        setLoginError('Failed to fetch user profile. Please try again.');
        return;
      }

      // 3. Criar objeto User com dados do perfil e token
      const userData = createUserFromProfile(profileData, token, formData.email);

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      router.replace(APP_DEFAULT_PATH);
    });
  };

  const commonIconProps = { size: 16, color: theme.vars.palette.grey[700] };

  return (
    <>
      <Stack direction="row" sx={{ gap: 1, mb: 2 }}>
        {userCredentials.map((credential) => (
          <Button
            key={credential.title}
            variant="outlined"
            color={isChildObjectContained(credential, formData) ? 'primary' : 'secondary'}
            sx={{ flex: 1 }}
            onClick={() => {
              reset({ email: credential.email, password: credential.password });
            }}
          >
            {credential.title}
          </Button>
        ))}
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <Box>
            <InputLabel>Email</InputLabel>
            <OutlinedInput
              {...register('email', emailSchema)}
              placeholder="example@saasable.io"
              fullWidth
              error={Boolean(errors.email)}
              sx={inputSx}
            />
            {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
          </Box>

          <Box>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              {...register('password', passwordSchema)}
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              fullWidth
              error={Boolean(errors.password)}
              endAdornment={
                <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <IconEye {...commonIconProps} /> : <IconEyeOff {...commonIconProps} />}
                </InputAdornment>
              }
              sx={inputSx}
            />
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: errors.password ? 'space-between' : 'flex-end', width: 1 }}>
              {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
              <Link
                component={NextLink}
                underline="hover"
                variant="caption"
                href="/forgot-password"
                textAlign="right"
                sx={{ '&:hover': { color: 'primary.dark' }, mt: 0.75 }}
              >
                Forgot Password?
              </Link>
            </Stack>
          </Box>
        </Stack>

        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isProcessing}
          endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
          sx={{ minWidth: 120, mt: { xs: 1, sm: 4 }, '& .MuiButton-endIcon': { ml: 1 } }}
        >
          Sign In
        </Button>

        {loginError && (
          <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
            {loginError}
          </Alert>
        )}
      </form>
    </>
  );
}
