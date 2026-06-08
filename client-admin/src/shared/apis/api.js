import axios from 'axios';

import { useAuthStore } from '../../features/auth/store/authStore';

export const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAuth.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
