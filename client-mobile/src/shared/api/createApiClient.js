// src/shared/api/createApiClient.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Crea una instancia axios con:
// - baseURL / timeout propios de cada servicio
// - interceptor de request: agrega Authorization: Bearer <token>
// - interceptor de response: si 401 (o 403 con token inválido/expirado), logout().
//   No existe endpoint de refresh token en el backend, así que nunca lo intentamos.
export function createApiClient({ baseURL, timeout = 8000 }) {
  const client = axios.create({ baseURL, timeout });

  client.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export default createApiClient;
