import { User } from '@/types/users';

export const mockUsers: User[] = [
  {
    id: '1',
    userName: 'admin',
    email: 'admin@onc.com',
    nomeCompleto: 'Administrador',
    whatsapp: '11999999999',
    telefone: '11999999999',
    cpf: '12345678900',
    dataCadastro: '2024-01-01T00:00:00Z',
    fotoURL: '',
    isAtivo: true
  },
  {
    id: '2',
    userName: 'manager',
    email: 'manager@onc.com',
    nomeCompleto: 'Gerente',
    whatsapp: '11988888888',
    telefone: '11988888888',
    cpf: '98765432100',
    dataCadastro: '2024-01-15T00:00:00Z',
    fotoURL: '',
    isAtivo: true
  },
  {
    id: '3',
    userName: 'user',
    email: 'user@onc.com',
    nomeCompleto: 'Usuário Comum',
    whatsapp: '11977777777',
    telefone: '11977777777',
    cpf: '45678912300',
    dataCadastro: '2024-02-01T00:00:00Z',
    fotoURL: '',
    isAtivo: true
  }
];
