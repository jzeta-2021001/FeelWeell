// src/features/content/hooks/useContent.js
import { useState, useCallback } from 'react';
import healthyClient from '../../../shared/api/healthyClient';

export function useContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contents, setContents] = useState([]);
  const [content, setContent] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthyClient.get('/contents');
      const data = response.data?.data ?? response.data;
      const list = Array.isArray(data) ? data : data?.contents || [];
      setContents(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContentByCategory = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthyClient.get(`/contents/category/${encodeURIComponent(category)}`);
      const data = response.data?.data ?? response.data;
      const list = Array.isArray(data) ? data : data?.contents || [];
      setContents(list);
      return list;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error inesperado');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContentById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await healthyClient.get(`/contents/${id}`);
      const data = response.data?.data ?? response.data;
      setContent(data);
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
    contents,
    content,
    fetchContent,
    fetchContentByCategory,
    fetchContentById,
  };
}

export default useContent;
