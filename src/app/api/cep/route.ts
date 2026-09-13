import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cep = request.nextUrl.searchParams.get('cep');

  if (!cep) {
    return NextResponse.json(
      { error: 'CEP é obrigatório' },
      { status: 400 }
    );
  }

  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return NextResponse.json(
      { error: 'CEP inválido' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cleanCep}/json/`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Não foi possível consultar o CEP' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.erro) {
      return NextResponse.json(
        { error: 'CEP não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    return NextResponse.json(
      { error: 'Erro ao consultar CEP' },
      { status: 500 }
    );
  }
}
