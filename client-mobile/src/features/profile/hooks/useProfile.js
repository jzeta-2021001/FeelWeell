// client-mobile/src/features/profile/hooks/useProfile.js
import { useState, useCallback } from 'react';
import authClient from '../../../shared/api/authClient';
import { useAuthStore } from '../../../shared/store/authStore';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateUser = useAuthStore((state) => state.updateUser);

  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.put('/auth/profile', data);
      const updatedData = response.data?.data ?? response.data;
      if (updatedData) {
        updateUser(updatedData);
      } else {
        updateUser(data);
      }
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al actualizar el perfil';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al cambiar la contraseña';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateProfile,
    changePassword,
  };
}

export default useProfile;
