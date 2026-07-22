// src/shared/api/healthyClient.js
import { ENDPOINTS } from '../constants/endpoints';
import { createApiClient } from './createApiClient';

// Sirve /exercises, /contents, /notifications
export const healthyClient = createApiClient({
  baseURL: ENDPOINTS.HEALTHY,
  timeout: 8000,
});

export default healthyClient;
