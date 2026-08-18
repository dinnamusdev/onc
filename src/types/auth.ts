// @mui
import { SxProps } from '@mui/material/styles';

// @project
import { AuthRole } from '@/enum';

export type ResendOtpType = 'signup' | 'email_change';
export interface User {
  id: string;
  email: string;
  role: AuthRole;
  contact: string;
  dialcode: string;
  firstname: string;
  lastname: string;
  token?: string;
  // Campos adicionais do perfil
  userName?: string;
  whatsapp?: string | null;
  telefone?: string;
  nomeCompleto?: string | null;
  cpf?: string | null;
  dataCadastro?: string;
  fotoURL?: string;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
}

export interface CommonAuthComponentProps {
  inputSx?: SxProps;
}

export interface OtpVerificationProps {
  email: string;
  verify: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
