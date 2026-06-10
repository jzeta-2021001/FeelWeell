import axios from 'axios';

// Instancia única para el auth-service de FeelWeell
const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUEST — adjunta el JWT y marca el cliente
// Refactorización: Importación dinámica para romper la Dependencia Circular
axiosAuth.interceptors.request.use(async (config) => {
  config._axiosClient = 'auth';
  
  // Lazy Loading del store
  const { useAuthStore } = await import('../../features/auth/store/authStore.js');
  const token = useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Lógica de refresh token (misma estructura que DebuggersEats) ──
let _isRefreshing = false;
let failedQueue = [];

function _processQueue(_error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => (_error ? reject(_error) : resolve(token)));
  failedQueue = [];
}

const handleRefreshToken = async function (_error) {
  const _original = _error.config;

  if (!_original || _original._retry) {
    return Promise.reject(_error);
  }

  const status = _error.response?.status;
  const errorCode = _error.response?.data?.error;
  const isRefreshEndpoint = (_original.url || '').includes('/auth/refresh');

  const shouldRefresh =
    !isRefreshEndpoint &&
    (status === 401 || (status === 403 && errorCode === 'TOKEN_EXPIRED'));

  if (shouldRefresh) {
    // Refactorización: Importación dinámica para la recuperación de sesión
    const { useAuthStore } = await import('../../features/auth/store/authStore.js');

    if (_isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          _original.headers['Authorization'] = 'Bearer ' + token;
          return axiosAuth(_original);
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
      return axiosAuth(_original);
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

axiosAuth.interceptors.response.use((res) => res, handleRefreshToken);

export { axiosAuth };