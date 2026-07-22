// src/shared/api/moodClient.js
import { ENDPOINTS } from '../constants/endpoints';
import { createApiClient } from './createApiClient';

// Sirve /moodTracking, /streak
export const moodClient = createApiClient({
  baseURL: ENDPOINTS.MOOD,
  timeout: 8000,
});

export default moodClient;
