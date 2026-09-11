// @third-party
import { AxiosResponse, isAxiosError } from 'axios';

type ApiResult<T> = {
  data: T | null;
  error: string | null;
  /** Lista de detalhes de erros de validação retornados pelo backend (opcional). */
  errors?: string[];
};

type ErrorWithMessage = {
  error: string;
};

function isErrorWithMessage(obj: unknown): obj is ErrorWithMessage {
  return typeof obj === 'object' && obj !== null && 'error' in obj && typeof (obj as { error: unknown }).error === 'string';
}

function extractErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    // Suporta backends que usam tanto 'message' quanto 'error' como chave da mensagem principal.
    return (data?.message as string) || (data?.error as string) || error.message || 'Request failed. Please try again.';
  }

  if (isErrorWithMessage(error)) {
    return error.error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

function extractErrors(error: unknown): string[] | undefined {
  if (isAxiosError(error)) {
    const raw = (error.response?.data as Record<string, unknown> | undefined)?.errors;
    if (Array.isArray(raw)) return raw as string[];
    if (raw && typeof raw === 'object') {
      return (Object.values(raw as Record<string, string[]>) as string[][]).flat();
    }
  }
  return undefined;
}

// ==============================|| ATTEMPT MIDDLEWARE ||============================== //

/**
 * A utility function that safely handles any asynchronous API call or Promise and returns a consistent { data, error, errors } structure.
 */

export async function attempt<T>(promise: Promise<T | AxiosResponse<T>>): Promise<ApiResult<T>> {
  try {
    const result = await promise;

    // Type guard for Axios response
    const data = result && typeof (result as AxiosResponse<T>).data !== 'undefined' ? (result as AxiosResponse<T>).data : (result as T);

    console.log('attempt - Sucesso:', data);
    return { data, error: null };
  } catch (error) {
    console.error('attempt - Erro:', error);
    return { data: null, error: extractErrorMessage(error), errors: extractErrors(error) };
  }
}
