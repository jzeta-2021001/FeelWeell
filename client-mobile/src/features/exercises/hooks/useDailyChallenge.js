// src/features/exercises/hooks/useDailyChallenge.js
import { useState, useCallback } from 'react';
import healthyClient from '../../../shared/api/healthyClient';

export function useDailyChallenge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  const fetchDailyChallenge = useCallback(async (mood) => {
    try {
      setLoading(true);
      setError(null);
      const params = mood ? { mood } : undefined;
      const response = await healthyClient.get('/exercises/daily-challenge', { params });
      const data = response.data?.data ?? response.data;
      setDailyChallenge(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, dailyChallenge, fetchDailyChallenge };
}

export default useDailyChallenge;
