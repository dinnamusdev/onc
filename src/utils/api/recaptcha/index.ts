/***************************  API - RECAPTCHA  ***************************/

export async function verifyRecaptcha(token: string | null): Promise<{ error?: string }> {
  try {
    const response = await fetch('/api/recaptcha/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      return { error: result.message || 'Falha na verificação do reCAPTCHA.' };
    }
    return {};
  } catch {
    return { error: 'Não foi possível validar o reCAPTCHA. Tente novamente.' };
  }
}
