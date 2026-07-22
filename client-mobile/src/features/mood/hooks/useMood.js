// src/features/mood/hooks/useMood.js
import { useState, useCallback } from 'react';
import moodClient from '../../../shared/api/moodClient';

export function useMood() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  const fetchTodayMood = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.get('/moodTracking/mood/today');
      const data = response.data?.data ?? response.data;
      setTodayMood(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerMood = useCallback(async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.post('/moodTracking/mood', payload);
      const data = response.data?.data ?? response.data;
      return data;
    } catch (err) {
      // 409 = ya registrado hoy, manejar aparte
      if (err.response?.status === 409) {
        return { conflict: true };
      }
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoodHistory = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.get('/moodTracking/mood/history', { params });
      const data = response.data?.data ?? response.data;
      const list = Array.isArray(data) ? data : data?.data || [];
      setMoodHistory(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    todayMood,
    moodHistory,
    fetchTodayMood,
    registerMood,
    fetchMoodHistory,
  };
}

export default useMood;
