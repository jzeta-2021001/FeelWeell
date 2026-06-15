import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosMood = axios.create({
  baseURL: import.meta.env.VITE_MOOD_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosMood.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getStreak = () => axiosMood.get('/streak');


export const updateStreak = () => axiosMood.put('/streak');


export const checkStreakAtRisk = () => axiosMood.get('/streak/at-risk');

// Admin


export const adminGetAllStreaks = () => axiosMood.get('/admin/streaks');


export const adminResetStreak = (userId) => axiosMood.put(`/admin/streaks/${userId}/reset`);