// src/shared/api/authClient.js
import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

// Rutas públicas de autenticación: nunca deben disparar logout() ante un 401/403,
// ya que un fallo de login/registro no significa que la sesión actual sea inválida.
// OJO: no basta con "startsWith('/auth')" porque TODAS las rutas del servicio cuelgan
// de "/auth" (incluidas las protegidas como "/auth/profile" o "/auth/change-password").
const PUBLIC_AUTH_PREFIXES = [
  '/auth/login',
  '/auth/activate',
  '/auth/forgot-password',
  '/auth/reset-password',
];

function isPublicAuthRequest(url = '') {
  const path = url.split('?')[0];
  if (path === '/auth') return true; // POST /auth = registro
  return PUBLIC_AUTH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 8000,
});

authClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    if ((status === 401 || status === 403) && !isPublicAuthRequest(url)) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default authClient;
