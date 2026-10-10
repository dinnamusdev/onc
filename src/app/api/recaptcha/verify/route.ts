// @next
import { NextRequest, NextResponse } from 'next/server';

/***************************  API - RECAPTCHA VERIFY  ***************************/

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export async function POST(request: NextRequest) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    // Sem chave configurada só é permitido fora de produção
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, message: 'reCAPTCHA não configurado no servidor.' }, { status: 500 });
    }
    return NextResponse.json({ success: true, skipped: true });
  }

  let token: string | undefined;
  try {
    ({ token } = await request.json());
  } catch {
    return NextResponse.json({ success: false, message: 'Requisição inválida.' }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ success: false, message: 'Confirme que você não é um robô.' }, { status: 400 });
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token })
    });
    const result = await response.json();

    if (!result.success) {
      return NextResponse.json({ success: false, message: 'Falha na verificação do reCAPTCHA. Tente novamente.' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Não foi possível validar o reCAPTCHA.' }, { status: 502 });
  }
}
