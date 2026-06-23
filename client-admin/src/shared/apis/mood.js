import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosMood = axios.create({
  baseURL: import.meta.env.VITE_MOOD_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

axiosMood.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getTodayMood = () => axiosMood.get('/moodTracking/mood/today');
export const registerMood = (data) => axiosMood.post('/moodTracking/mood', data);
export const getMoodHistory = (params = {}) => axiosMood.get('/moodTracking/mood/history', { params });
export const getQuestionnaire = () => axiosMood.get('/moodTracking/questionnaire');
export const submitQuestionnaire = (answers) => axiosMood.post('/moodTracking/questionnaire', { answers });
export const getUserEmotionalProfile = () => axiosMood.get('/moodTracking/profile');

// ── Admin endpoints ──────────────────────────────────────────────────────────
export const adminGetAllMoodEntries = (params = {}) => axiosMood.get('/admin/mood-entries', { params });
export const adminDeleteMoodEntry   = (id)          => axiosMood.delete(`/admin/mood-entries/${id}`);
export const adminGetAllProfiles    = ()             => axiosMood.get('/admin/profiles');
export const adminDeleteUserProfile = (userId)       => axiosMood.delete(`/admin/profiles/${userId}`);
export const adminGetSystemStats    = ()             => axiosMood.get('/admin/stats');