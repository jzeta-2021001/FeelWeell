// src/features/questionnaire/hooks/useQuestionnaire.js
import { useState, useCallback } from 'react';
import moodClient from '../../../shared/api/moodClient';

export function useQuestionnaire() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submitResult, setSubmitResult] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.get('/moodTracking/profile');
      const data = response.data?.data ?? response.data;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuestionnaire = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.get('/moodTracking/questionnaire');
      const data = response.data?.data ?? response.data;
      const list = Array.isArray(data) ? data : data?.questions || [];
      setQuestions(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswers = useCallback(async (answers) => {
    try {
      setLoading(true);
      setError(null);
      const response = await moodClient.post('/moodTracking/questionnaire', { answers });
      const data = response.data?.data ?? response.data;
      setSubmitResult(data);
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
    profile,
    questions,
    submitResult,
    fetchProfile,
    fetchQuestionnaire,
    submitAnswers,
  };
}

export default useQuestionnaire;
