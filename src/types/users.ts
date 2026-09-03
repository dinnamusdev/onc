/***************************  USERS TYPES  ***************************/

export interface User {
  id: string;
  userName: string;
  email: string;
  nomeCompleto?: string;
  whatsapp?: string;
  telefone?: string;
  cpf?: string;
  dataCadastro?: string;
  fotoURL?: string;
  isAtivo?: boolean;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  password: string;
  rePassword: string;
}

export interface UpdateUserRequest {
  id: string;
  userName?: string;
  email?: string;
  nomeCompleto?: string;
  whatsapp?: string;
  telefone?: string;
  cpf?: string;
  fotoURL?: string;
  isAtivo?: boolean;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface UserListParams {
  email?: string;
  userName?: string;
  cpf?: string;
}
