export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function getAddressByCep(cep: string): Promise<CepResponse> {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido');
  }

  const response = await fetch(
    `/api/cep?cep=${cleanCep}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Não foi possível consultar o CEP');
  }

  const data: CepResponse = await response.json();

  return data;
}