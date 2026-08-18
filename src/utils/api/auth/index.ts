// @project
import { AUTH_CONFIG_KEY, AUTH_USER_KEY } from '@/config';
import { attempt } from '@/utils/attempt';
import axiosServices from '@/utils/axios';

// @types
import { LoginFormData } from '@/types/auth';

type ApiFormData = Record<string, unknown>;

export async function login(formData: LoginFormData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  return attempt(axiosServices.post('/api/auth/login', formData));
}

export async function signUp(formData: ApiFormData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  return attempt(axiosServices.post('/api/auth/signUp', formData));
}

export async function getUser() {
  return attempt(axiosServices.get('/api/auth/getUser'));
}

export async function forgotPassword(formData: ApiFormData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  return attempt(axiosServices.post('/api/auth/forgotPassword', formData));
}

export async function resetPassword(formData: ApiFormData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  return attempt(axiosServices.post('/api/auth/resetPassword', formData));
}

export async function verifyOtp(formData: ApiFormData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  return attempt(axiosServices.post('/api/auth/verifyOtp', formData));
}

export async function resendOtp(formData: ApiFormData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  return attempt(axiosServices.post('/api/auth/resend', formData));
}

export async function logout() {
  await axiosServices.post('/api/auth/signOut');
  localStorage.removeItem(AUTH_USER_KEY);
  window.location.pathname = '/login';
  return { data: { message: 'Loggedout' }, error: null };
}

export async function getUserProfile(email: string, token: string) {
  return attempt(axiosServices.post('/api/auth/getUserProfile', { email, token }));
}