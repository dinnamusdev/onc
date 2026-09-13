export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uf = searchParams.get('uf');

    if (!uf || uf.length !== 2) {
      return Response.json(
        { error: 'UF inválido. Deve ser um código de 2 letras.' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`IBGE API retornou status ${response.status}`);
    }

    const data = await response.json();

    // Mapeia resposta IBGE para formato simples (array de nomes)
    const municipios = data.map((item: { nome: string }) => item.nome).sort();

    return Response.json({ municipios }, { status: 200 });
  } catch (error) {
    console.error('Erro ao consultar IBGE:', error);
    return Response.json(
      { error: 'Erro ao buscar cidades. Tente novamente.' },
      { status: 500 }
    );
  }
}
