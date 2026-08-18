// @third-party
import { AxiosResponse, isAxiosError } from 'axios';

type ApiResult<T> = {
  data: T | null;
  error: string | null;
};

type ErrorWithMessage = {
  error: string;
};

function isErrorWithMessage(obj: unknown): obj is ErrorWithMessage {
  return typeof obj === 'object' && obj !== null && 'error' in obj && typeof (obj as { error: unknown }).error === 'string';
}

function extractErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Request failed. Please try again.';
  }

  if (isErrorWithMessage(error)) {
    return error.error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

// ==============================|| ATTEMPT MIDDLEWARE ||============================== //

/**
 * A utility function that safely handles any asynchronous API call or Promise and returns a consistent { data, error } structure.
 */

export async function attempt<T>(promise: Promise<T | AxiosResponse<T>>): Promise<ApiResult<T>> {
  try {
    const result = await promise;

    // Type guard for Axios response
    const data = result && typeof (result as AxiosResponse<T>).data !== 'undefined' ? (result as AxiosResponse<T>).data : (result as T);

    return { data, error: null };
  } catch (error) {
    return { data: null, error: extractErrorMessage(error) };
  }
}
