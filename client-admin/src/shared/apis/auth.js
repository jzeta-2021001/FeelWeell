import { axiosAuth } from "./api.js";


export const loginRequest = async ({ username, password }) => {
  return await axiosAuth.post(`/login`, { username, password });
};

export const activateAccountRequest = async (token) => {
  return await axiosAuth.get(`/activate/${token}`);
};

export const forgotPasswordRequest = async (email) => {
  return await axiosAuth.post(`/forgot-password`, { email });
};

export const resetPasswordRequest = async ({ token, newPassword }) => {
  return await axiosAuth.post(`/reset-password/${token}`, { newPassword });
};

export const changePasswordRequest = async ({ currentPassword, newPassword }) => {
  return await axiosAuth.put(`/change-password`, { currentPassword, newPassword });
};

export const registerRequest = async ({ firstName, surname, username, email, password }) => {
  return await axiosAuth.post('/', { firstName, surname, username, email, password });
};