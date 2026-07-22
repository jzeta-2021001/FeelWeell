// client-mobile/src/features/chat/hooks/useChat.js
import { useState, useCallback } from 'react';
import aiChatClient from '../../../shared/api/aiChatClient';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');

  const dismissEmergencyBanner = useCallback(() => {
    setShowEmergencyBanner(false);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || trimmed.length > 2000 || typing) {
      return;
    }

    setError(null);
    const userMsgId = Date.now().toString() + '-user';
    const userMessage = {
      id: userMsgId,
      role: 'USER',
      text: trimmed,
    };

    setMessages((prev) => [userMessage, ...prev]);
    setTyping(true);

    try {
      const response = await aiChatClient.post('/chat', { message: trimmed });
      const data = response.data;
      
      const assistantMessage = {
        id: Date.now().toString() + '-assistant',
        role: 'ASSISTANT',
        text: data.respuesta || data.message || '',
        tipo: data.tipo || 'RESPUESTA',
      };

      setMessages((prev) => [assistantMessage, ...prev]);

      if (data.tipo === 'EMERGENCIA') {
        setEmergencyMessage(assistantMessage.text);
        setShowEmergencyBanner(true);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al conectar con Tiyú';
      setError(errorMsg);
    } finally {
      setTyping(false);
    }
  }, [typing]);

  return {
    messages,
    typing,
    error,
    sendMessage,
    showEmergencyBanner,
    emergencyMessage,
    dismissEmergencyBanner,
  };
}

export default useChat;
