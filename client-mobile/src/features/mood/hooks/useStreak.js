// src/features/mood/hooks/useStreak.js
import { useState, useCallback } from 'react';
import moodClient from '../../../shared/api/moodClient';

export function useStreak() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(null);
  const [atRisk, setAtRisk] = useState(false);

  const fetchStreak = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.get('/streak');
      const data = response.data?.data ?? response.data;
      setStreak(data);
      return data;
    } catch (err) {
      // Para usuarios nuevos puede no existir aún — tratar como vacío, no como error
      if (err.response?.status === 404) {
        setStreak({ currentStreak: 0, maxStreak: 0, lastRegisteredAt: null });
        return null;
      }
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStreak = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.put('/streak');
      const data = response.data?.data ?? response.data;
      setStreak(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStreakAtRisk = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.get('/streak/at-risk');
      const data = response.data?.data ?? response.data;
      setAtRisk(!!data?.atRisk);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    streak,
    atRisk,
    fetchStreak,
    updateStreak,
    checkStreakAtRisk,
  };
}

export default useStreak;
