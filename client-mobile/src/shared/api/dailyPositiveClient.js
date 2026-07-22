// src/shared/api/dailyPositiveClient.js
import { ENDPOINTS } from '../constants/endpoints';
import { createApiClient } from './createApiClient';

// Servicio .NET de refuerzo positivo. NO lleva el prefijo "/feelWeell/v1";
// sus rutas cuelgan directamente de "/api/...", p.ej. /api/daily-message/today/${userId}
export const dailyPositiveClient = createApiClient({
  baseURL: ENDPOINTS.DAILY_POSITIVE,
  timeout: 8000,
});

export default dailyPositiveClient;
