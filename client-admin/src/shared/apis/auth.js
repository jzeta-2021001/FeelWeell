import { axiosAuth } from "./api";

const AUTH_URL = "/api/auth";

export const loginRequest = async ({ username, password }) => {
  return await axiosAuth.post(`${AUTH_URL}/login`, {
    username,
    password,
  });
};

export const activateAccountRequest = async (token) => {
  return await axiosAuth.get(`${AUTH_URL}/activate/${token}`);
};

export const forgotPasswordRequest = async (email) => {
  return await axiosAuth.post(`${AUTH_URL}/forgot-password`, {
    email,
  });
};

export const resetPasswordRequest = async ({ token, newPassword }) => {
  return await axiosAuth.post(`${AUTH_URL}/reset-password/${token}`, {
    newPassword,
  });
};

export const changePasswordRequest = async ({ currentPassword, newPassword }) => {
  return await axiosAuth.put(`${AUTH_URL}/change-password`, {
    currentPassword,
    newPassword,
  });
};

export const registerRequest = async ({
  firstName,
  surname,
  username,
  email,
  password,
}) => {
  return await axiosAuth.post(AUTH_URL, {
    firstName,
    surname,
    username,
    email,
    password,
  });
};
