// src/shared/api/aiChatClient.js
import { ENDPOINTS } from '../constants/endpoints';
import { createApiClient } from './createApiClient';

// Sirve /chat (Tiyú). Timeout mayor porque la IA puede tardar más en responder.
export const aiChatClient = createApiClient({
  baseURL: ENDPOINTS.AI_CHAT,
  timeout: 15000,
});

export default aiChatClient;
