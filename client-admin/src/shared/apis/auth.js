import { axiosAuth } from './api.js';

// ── Autenticación ──
export const login = async (data) => {
  return await axiosAuth.post('/auth/login', data);
};

export const register = async (data) => {
  return await axiosAuth.post('/auth', data);
};

export const activateAccount = async (token) => {
  return await axiosAuth.get(`/auth/activate/${token}`);
};

export const forgotPassword = async (email) => {
  return await axiosAuth.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, newPassword) => {
  return await axiosAuth.post(`/auth/reset-password/${token}`, { newPassword });
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  return await axiosAuth.put('/auth/change-password', { currentPassword, newPassword });
};

export const updateProfile = async (data) => {
  return await axiosAuth.put('/auth/profile', data);
};

// ── Gestión de usuarios (admin) ──
export const getAllUsers = async () => {
  return await axiosAuth.get('/auth/users');
};

export const createUser = async (data) => {
  return await axiosAuth.post('/auth', data);
};

export const toggleUserStatus = async (id) => {
  return await axiosAuth.patch(`/auth/users/${id}/toggle-status`);
};

export const deleteUser = async (id) => {
  return await axiosAuth.delete(`/auth/users/${id}`);
};

// Alias usado por useVerifyEmail
export const verifyEmail = activateAccount;
