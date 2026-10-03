/**
 * Máscara para CPF: 999.999.999-99
 */
export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 11);
  return limited
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2');
};

/**
 * Máscara para CNPJ: 99.999.999/0001-99
 */
export const formatCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 14);
  return limited
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{2})$/, '$1-$2');
};

/**
 * Máscara para CEP: 99999-999
 */
export const formatCEP = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 8);
  return limited.replace(/(\d{5})(\d{3})$/, '$1-$2');
};

/**
 * Máscara para Telefone: (99) 99999-9999
 */
export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 11);
  
  if (limited.length <= 2) {
    return limited ? `(${limited}` : '';
  }
  if (limited.length <= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  }
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
};

/**
 * Máscara para WhatsApp (mesmo que telefone): (99) 99999-9999
 */
export const formatWhatsApp = (value: string): string => {
  return formatPhone(value);
};

/**
 * Máscara para Data: 99/99/9999
 */
export const formatDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 8);
  
  if (limited.length <= 2) {
    return limited;
  }
  if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }
  return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
};

/**
 * Remove máscara, retornando apenas números
 */
export const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};
