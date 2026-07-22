// src/features/exercises/hooks/useExercises.js
import { useState, useCallback } from 'react';
import healthyClient from '../../../shared/api/healthyClient';

export function useExercises() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [exercise, setExercise] = useState(null);
  const [progress, setProgress] = useState(null);

  const fetchExercises = useCallback(async (type) => {
    try {
      setLoading(true);
      setError(null);
      const params = type ? { type } : undefined;
      const response = await healthyClient.get('/exercises', { params });
      const data = response.data?.data ?? response.data;
      const list = Array.isArray(data) ? data : data?.exercises || [];
      setExercises(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommended = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthyClient.get('/exercises/recommended');
      const data = response.data?.data ?? response.data;
      // Si viene vacío { message, exercises: [] } → lista vacía (no es error)
      const list = Array.isArray(data) ? data : data?.exercises || [];
      setRecommended(list);
      return list;
    } catch (err) {
      // No setear error aquí — recommended es opcional
      setRecommended([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExerciseById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthyClient.get(`/exercises/${id}`);
      const data = response.data?.data ?? response.data;
      setExercise(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthyClient.get('/exercises/user/progress');
      const data = response.data?.data ?? response.data;
      setProgress(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeExercise = useCallback(async (exerciseId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthyClient.post(`/exercises/${exerciseId}/complete`);
      const data = response.data?.data ?? response.data;
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveExerciseForLater = useCallback(async (exerciseId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthyClient.post(`/exercises/${exerciseId}/save`);
      const data = response.data?.data ?? response.data;
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
    exercises,
    recommended,
    exercise,
    progress,
    fetchExercises,
    fetchRecommended,
    fetchExerciseById,
    fetchUserProgress,
    completeExercise,
    saveExerciseForLater,
  };
}

export default useExercises;
