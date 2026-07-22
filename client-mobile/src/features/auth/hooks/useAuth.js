// src/features/auth/hooks/useAuth.js
import { useCallback, useState } from 'react';
import { authClient } from '../../../shared/api/authClient';
import { useAuthStore } from '../../../shared/store/authStore';

function getErrorMessage(err) {
  return (
    err.response?.data?.error || err.response?.data?.message || 'Error inesperado'
  );
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const login = useAuthStore((state) => state.login);

  const handleLogin = useCallback(
    async ({ username, password }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authClient.post('/auth/login', { username, password });
        const { user, token } = response.data.data;
        login(token, user);
        return { success: true };
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const handleRegister = useCallback(
    async ({ firstName, surname, username, email, password, acceptTerms }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authClient.post('/auth', {
          firstName,
          surname,
          username,
          email,
          password,
          acceptTerms,
        });
        return { success: true, message: response.data.message };
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleForgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.post('/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResetPassword = useCallback(async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
    loading,
    error,
  };
}

export default useAuth;
