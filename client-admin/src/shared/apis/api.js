import axios from 'axios';
// Importación estática del store para el uso general, 
// pero dinámica dentro del interceptor para evitar dependencias circulares
import { useAuthStore } from '../../features/auth/store/authStore.js';

// Instancias configuradas
const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

const axiosIA = axios.create({
  baseURL: import.meta.env.VITE_AI_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

const axiosHealthy = axios.create({
  baseURL: import.meta.env.VITE_HEALTHY_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// 1. Interceptores de REQUEST (Adjuntar JWT)
const attachToken = (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axiosAuth.interceptors.request.use((config) => {
  config._axiosClient = 'auth';
  return attachToken(config);
});

axiosIA.interceptors.request.use((config) => {
  config._axiosIA = 'ia';
  return attachToken(config);
});

axiosHealthy.interceptors.request.use((config) => {
  config._axiosHealthy = 'healthy';
  return attachToken(config);
});

// 2. Lógica de Refresh Token (Centralizada)
let _isRefreshing = false;
let failedQueue = [];

function _processQueue(_error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => (_error ? reject(_error) : resolve(token)));
  failedQueue = [];
}

const handleRefreshToken = async function (_error) {
  const _original = _error.config;

  // Si no hay respuesta o ya se intentó refrescar, rechazamos
  if (!_original || _original._retry) {
    return Promise.reject(_error);
  }

  const status = _error.response?.status;
  const errorCode = _error.response?.data?.error;
  
  // Evitamos bucles infinitos en endpoints de autenticación
  const isRefreshEndpoint = (_original.url || '').includes('/auth/refresh');
  const isLoginEndpoint = (_original.url || '').includes('/auth/login');

  const shouldRefresh =
    !isRefreshEndpoint &&
    !isLoginEndpoint &&
    (status === 401 || (status === 403 && errorCode === 'TOKEN_EXPIRED'));

  if (shouldRefresh) {
    const { useAuthStore } = await import('../../features/auth/store/authStore.js');

    if (_isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
      .then((token) => {
        _original.headers['Authorization'] = 'Bearer ' + token;
        return axios(_original); // Reintentar usando la instancia original
      })
      .catch((err) => Promise.reject(err));
    }

    _original._retry = true;
    _isRefreshing = true;

    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      useAuthStore.getState().logout();
      return Promise.reject(_error);
    }

    try {
      const response = await axiosAuth.post('/auth/refresh', { refreshToken });
      const payload = response.data.data ?? response.data;
      const { accessToken, refreshToken: newRefreshToken, expiresIn, userDetails } = payload;

      useAuthStore.setState({
        token: accessToken,
        refreshToken: newRefreshToken,
        expiresAt: expiresIn,
        user: userDetails || useAuthStore.getState().user,
        isAuthenticated: true,
      });

      _processQueue(null, accessToken);
      _original.headers['Authorization'] = 'Bearer ' + accessToken;
      return axios(_original);
    } catch (err) {
      _processQueue(err, null);
      useAuthStore.getState().logout();
      return Promise.reject(err);
    } finally {
      _isRefreshing = false;
    }
  }

  return Promise.reject(_error);
};

// 3. Aplicar Interceptores de RESPONSE a TODOS los servicios
axiosAuth.interceptors.response.use((res) => res, handleRefreshToken);
axiosIA.interceptors.response.use((res) => res, handleRefreshToken);
axiosHealthy.interceptors.response.use((res) => res, handleRefreshToken);

export { axiosAuth, axiosIA, axiosHealthy };