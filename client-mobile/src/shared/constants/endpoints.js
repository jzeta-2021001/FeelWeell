// src/shared/constants/endpoints.js
import { Platform } from 'react-native';

// En un emulador de Android, localhost apunta al propio emulador.
// Para apuntar a la computadora host (donde corre el backend), se usa 10.0.2.2
const getBaseUrl = (port) => {
  const isAndroid = Platform.OS === 'android';
  const hostname = isAndroid ? '10.0.2.2' : 'localhost';
  return `http://${hostname}:${port}`;
};

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || `${getBaseUrl(3006)}/feelWeell/v1`,
  HEALTHY: process.env.EXPO_PUBLIC_HEALTHY_URL || `${getBaseUrl(3008)}/feelWeell/v1`,
  MOOD: process.env.EXPO_PUBLIC_MOOD_URL || `${getBaseUrl(3001)}/feelWeell/v1`,
  AI_CHAT: process.env.EXPO_PUBLIC_AI_CHAT_URL || `${getBaseUrl(3007)}/feelWeell/v1`,
  DAILY_POSITIVE: process.env.EXPO_PUBLIC_DAILY_POSITIVE_URL || getBaseUrl(5001),
};

export default ENDPOINTS;
