interface IbgeMunicipiosResponse {
  municipios: string[];
}

// Cache local para evitar multiplas requisições
const municipiosCache: Record<string, string[]> = {};

export async function getMunicipiosByUf(uf: string): Promise<string[]> {
  if (!uf || uf.length !== 2) {
    throw new Error('UF inválido');
  }

  // Verifica cache
  if (municipiosCache[uf]) {
    return municipiosCache[uf];
  }

  try {
    const response = await fetch(`/api/ibge/municipios?uf=${uf}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar cidades: ${response.statusText}`);
    }

    const data: IbgeMunicipiosResponse = await response.json();

    // Armazena no cache
    municipiosCache[uf] = data.municipios;

    return data.municipios;
  } catch (error) {
    console.error('Erro ao consultar IBGE:', error);
    throw error instanceof Error ? error : new Error('Erro ao buscar cidades');
  }
}
