// src/features/home/hooks/useHomeSummary.js
import { useCallback, useEffect, useState } from 'react';
import { dailyPositiveClient } from '../../../shared/api/dailyPositiveClient';
import { moodClient } from '../../../shared/api/moodClient';
import { healthyClient } from '../../../shared/api/healthyClient';

const INITIAL_STATE = {
  dailyMessage: null,
  streak: null,
  dailyChallenge: null,
  unreadCount: 0,
  loading: true,
  error: null,
};

// Agrega, en paralelo (Promise.allSettled), todos los datos que necesita HomeScreen
// para no encadenar peticiones. Cada fuente se degrada con gracia: si una falla,
// las demás igual se muestran y no bloqueamos toda la pantalla por un solo servicio caído.
export function useHomeSummary(userId) {
  const [state, setState] = useState(INITIAL_STATE);

  const fetchSummary = useCallback(async () => {
    if (!userId) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const [dailyMessageResult, streakResult, dailyChallengeResult, notificationsResult] =
      await Promise.allSettled([
        dailyPositiveClient.get(`/api/daily-message/today/${userId}`),
        moodClient.get('/streak'),
        healthyClient.get('/exercises/daily-challenge'),
        healthyClient.get('/notifications/my'),
      ]);

    setState({
      dailyMessage:
        dailyMessageResult.status === 'fulfilled' ? dailyMessageResult.value.data : null,
      streak: streakResult.status === 'fulfilled' ? streakResult.value.data : null,
      dailyChallenge:
        dailyChallengeResult.status === 'fulfilled' ? dailyChallengeResult.value.data : null,
      unreadCount:
        notificationsResult.status === 'fulfilled'
          ? notificationsResult.value.data?.unread || 0
          : 0,
      loading: false,
      // Sólo reportamos error "duro" si TODAS las fuentes fallaron.
      error:
        [dailyMessageResult, streakResult, dailyChallengeResult, notificationsResult].every(
          (result) => result.status === 'rejected'
        )
          ? 'No pudimos cargar tu resumen. Desliza para reintentar.'
          : null,
    });
  }, [userId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { ...state, refresh: fetchSummary };
}

export default useHomeSummary;
