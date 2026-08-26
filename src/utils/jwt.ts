/**
 * Utilitários para lidar com JWT no client-side.
 *
 * IMPORTANTE: a decodificação aqui NÃO valida a assinatura do token — isso é
 * responsabilidade do backend. Serve apenas para ler claims públicas (como
 * `exp`) e decidir, no cliente, se a sessão deve ser considerada expirada.
 */

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

/**
 * Decodifica o payload (parte central) de um JWT sem verificar a assinatura.
 * Retorna `null` se o token for inválido/ilegível.
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const json =
      typeof window !== 'undefined' && typeof window.atob === 'function'
        ? decodeURIComponent(
            window
              .atob(normalized)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
        : Buffer.from(normalized, 'base64').toString('utf-8');

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Verifica se um JWT está expirado com base na claim `exp` (em segundos).
 *
 * - Retorna `true` se o token estiver expirado ou for inválido.
 * - Retorna `false` se ainda for válido.
 * - Se o token não tiver `exp`, é considerado NÃO expirado (não há como saber).
 *
 * @param token   O JWT a ser verificado.
 * @param skewSeconds  Margem de tolerância (relógio) em segundos. Padrão: 0.
 */
export function isTokenExpired(token: string | undefined | null, skewSeconds = 0): boolean {
  if (!token) return true;

  const payload = decodeJwt(token);
  if (!payload) return true;

  if (typeof payload.exp !== 'number') return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds - skewSeconds;
}

/**
 * Extrai o token de um objeto de auth persistido no localStorage, cobrindo as
 * variações usadas na app (`access_token` e `token`).
 */
export function getTokenFromAuthData(authData: unknown): string | null {
  if (!authData || typeof authData !== 'object') return null;
  const obj = authData as Record<string, unknown>;
  const token = obj.access_token ?? obj.token;
  return typeof token === 'string' && token.length > 0 ? token : null;
}
