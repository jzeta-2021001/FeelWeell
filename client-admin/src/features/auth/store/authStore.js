import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  changePasswordRequest,
} from "../../../shared/apis";

const getErrorMessage = (error, fallback) => {
  const firstValidationError = error.response?.data?.errors?.[0]?.message;

  return (
    firstValidationError ||
    error.response?.data?.error ||
    error.response?.data?.message ||
    fallback
  );
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isLoadingAuth: true,

      checkAuth: () => {
        const token = get().token;
        const user = get().user;

        set({
          isAuthenticated: Boolean(token && user),
          isLoadingAuth: false,
        });
      },

      login: async ({ username, password }) => {
        try {
          set({ loading: true, error: null });

          const response = await loginRequest({ username, password });

          set({
            user: response.data.data.user,
            token: response.data.data.token,
            loading: false,
            error: null,
            isAuthenticated: true,
          });

          return { success: true };
        } catch (error) {
          const message = getErrorMessage(error, "Error al iniciar sesion");

          set({
            loading: false,
            error: message,
            isAuthenticated: false,
          });

          return { success: false, error: message };
        }
      },

      registerUser: async (formData) => {
        try {
          set({ loading: true, error: null });

          await registerRequest(formData);

          set({ loading: false });

          return {
            success: true,
            message: "Cuenta creada. Revisa tu correo para activarla.",
          };
        } catch (error) {
          const message = getErrorMessage(error, "Error al registrar usuario");

          set({ loading: false, error: message });

          return { success: false, error: message };
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ loading: true, error: null });

          const response = await forgotPasswordRequest(email);

          set({ loading: false });

          return {
            success: true,
            message: response.data.message,
          };
        } catch (error) {
          const message = getErrorMessage(error, "Error al enviar correo");

          set({ loading: false, error: message });

          return { success: false, error: message };
        }
      },

      resetPassword: async ({ token, newPassword }) => {
        try {
          set({ loading: true, error: null });

          const response = await resetPasswordRequest({
            token,
            newPassword,
          });

          set({ loading: false });

          return {
            success: true,
            message: response.data.message,
          };
        } catch (error) {
          const message = getErrorMessage(error, "Error al restablecer contraseña");

          set({ loading: false, error: message });

          return { success: false, error: message };
        }
      },

      changePassword: async ({ currentPassword, newPassword }) => {
        try {
          set({ loading: true, error: null });

          const response = await changePasswordRequest({
            currentPassword,
            newPassword,
          });

          set({ loading: false });

          return {
            success: true,
            message: response.data.message,
          };
        } catch (error) {
          const message = getErrorMessage(error, "Error al cambiar contraseña");

          set({ loading: false, error: message });

          return { success: false, error: message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          error: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "feelweell-auth",
    }
  )
);
