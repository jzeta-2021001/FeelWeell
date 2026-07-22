// client-mobile/src/features/notifications/hooks/useNotifications.js
import { useState, useCallback } from 'react';
import healthyClient from '../../../shared/api/healthyClient';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await healthyClient.get('/notifications/my');
      const data = response.data?.data ?? response.data;
      if (Array.isArray(data)) {
        setNotifications(data);
        setTotal(data.length);
        setUnread(data.filter((n) => !n.read).length);
      } else if (data) {
        setNotifications(data.notifications || data.data || []);
        setTotal(data.total || 0);
        setUnread(data.unread || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await healthyClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? { ...item, read: true } : item))
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Error marking notification as read:', err.message);
    }
  }, []);

  const fetchPreferences = useCallback(async () => {
    try {
      const response = await healthyClient.get('/notifications/preferences');
      const data = response.data?.data ?? response.data;
      setPreferences(data);
      return data;
    } catch (err) {
      console.warn('Error fetching notification preferences:', err.message);
    }
  }, []);

  const updatePreferences = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await healthyClient.put('/notifications/preferences', data);
      const updated = response.data?.data ?? response.data;
      setPreferences((prev) => ({ ...prev, ...updated }));
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al actualizar preferencias';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleType = useCallback(async (type, active) => {
    try {
      const response = await healthyClient.patch('/notifications/preferences/toggle', {
        type,
        active,
      });
      const updated = response.data?.data ?? response.data;
      setPreferences((prev) => {
        if (!prev) return prev;
        const currentTypes = prev.activeTypes || [];
        const newTypes = active
          ? [...new Set([...currentTypes, type])]
          : currentTypes.filter((t) => t !== type);
        return { ...prev, activeTypes: newTypes, ...updated };
      });
    } catch (err) {
      console.warn('Error toggling notification type:', err.message);
    }
  }, []);

  const scheduleMoodReminder = useCallback(async () => {
    try {
      const res = await healthyClient.post('/notifications/schedule/mood-reminder');
      return res.data;
    } catch (err) {
      // Ignorar de forma silenciosa
      return { skipped: true };
    }
  }, []);

  const scheduleExerciseReminder = useCallback(async (exerciseId, exerciseTitle) => {
    try {
      const res = await healthyClient.post('/notifications/schedule/exercise-reminder', {
        exerciseId,
        exerciseTitle,
      });
      return res.data;
    } catch (err) {
      return { skipped: true };
    }
  }, []);

  const scheduleStreakAlert = useCallback(async (currentStreak, lastActivityDate) => {
    try {
      const res = await healthyClient.post('/notifications/schedule/streak-alert', {
        currentStreak,
        lastActivityDate,
      });
      return res.data;
    } catch (err) {
      return { skipped: true };
    }
  }, []);

  return {
    notifications,
    total,
    unread,
    preferences,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    fetchPreferences,
    updatePreferences,
    toggleType,
    scheduleMoodReminder,
    scheduleExerciseReminder,
    scheduleStreakAlert,
  };
}

export default useNotifications;
