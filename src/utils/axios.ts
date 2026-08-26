// @third-party
import axios from 'axios';

// @project
import { AUTH_USER_KEY } from '@/config';
import { isTokenExpired } from '@/utils/jwt';

const axiosServices = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')
});

/***************************  AXIOS MIDDLEWARE  ***************************/

axiosServices.interceptors.request.use(
  async (config) => {
    const storedValue = typeof window !== 'undefined' ? localStorage.getItem(AUTH_USER_KEY) : null;
    const parsedValue = storedValue && JSON.parse(storedValue);

    if (parsedValue?.access_token) {
      // Se o token já estiver expirado, limpa a sessão e não envia o header.
      if (isTokenExpired(parsedValue.access_token)) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_USER_KEY);
        }
      } else {
        config.headers['Authorization'] = `Bearer ${parsedValue.access_token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined' && !window.location.href.includes('/login')) {
      localStorage.removeItem(AUTH_USER_KEY);
      window.location.pathname = '/login';
    }
    return Promise.reject((error?.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;
