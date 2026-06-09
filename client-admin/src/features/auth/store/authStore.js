import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login as loginRequest,
  register as registerRequest,
  createUser as createUserRequest,
  changePassword as changePasswordRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
} from '../../../shared/apis';
import { showError } from '../../../shared/utils/toast.js';

const ALLOWED_ROLES = [
  'USER_ROLE',
  'ADMIN_ROLE',
  'ADMIN_USERS_ROLE',
  'ADMIN_MOODTRACKING_ROLE',
  'ADMIN_HEALTHY_ROLE',
];

const getErrorMessage = (err, fallback) =>
  err.response?.data?.errors?.[0]?.message ||
  err.response?.data?.error ||
  err.response?.data?.message ||
  fallback;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      loading: false,
      error: null,
      isLoadingAuth: true,
      isAuthenticated: false,

      checkAuth: () => {
        const token = get().token;
        const role = get().user?.role;
        const hasAccess = ALLOWED_ROLES.includes(role);

        if (token && !hasAccess) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            isLoadingAuth: false,
            isAuthenticated: false,
            error: 'No tienes permiso para acceder a esta aplicación',
          });
          return;
        }

        set({
          isLoadingAuth: false,
          isAuthenticated: Boolean(token) && hasAccess,
        });
      },

      updateUser: (updates) => {
        set((s) => ({ user: { ...s.user, ...updates } }));
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          error: null,
        });
      },

      login: async ({ username, password }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await loginRequest({ username, password });
          const role = data?.data?.user?.role;

          if (!ALLOWED_ROLES.includes(role)) {
            const message = 'No tienes permiso para acceder a esta aplicación';
            set({
              user: null,
              token: null,
              refreshToken: null,
              expiresAt: null,
              isLoadingAuth: false,
              isAuthenticated: false,
              loading: false,
              error: message,
            });
            showError(message);
            return { success: false, error: message };
          }

          set({
            user: data.data.user,
            token: data.data.token,
            refreshToken: data.data.refreshToken ?? null,
            expiresAt: data.data.expiresIn ?? null,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true, role };
        } catch (err) {
          const message = getErrorMessage(err, 'Error al iniciar sesión');
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      register: async (formData) => {
        try {
          set({ loading: true, error: null });
          const { data } = await registerRequest(formData);
          set({ loading: false });
          return {
            success: true,
            message: data?.message || 'Cuenta creada. Revisa tu correo para activarla.',
            data,
          };
        } catch (err) {
          const message = getErrorMessage(err, 'Error al registrar cuenta');
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      // Alias previo (usado en RegisterForm original de FeelWeell)
      registerUser: async (formData) => {
        return get().register(formData);
      },

      createUser: async (userData) => {
        try {
          set({ loading: true, error: null });
          const { data } = await createUserRequest(userData);
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message = getErrorMessage(err, 'Error al crear el usuario');
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ loading: true, error: null });
          const { data } = await forgotPasswordRequest(email);
          set({ loading: false });
          return { success: true, message: data.message };
        } catch (err) {
          const message = getErrorMessage(err, 'Error al enviar correo');
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      resetPassword: async ({ token, newPassword }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await resetPasswordRequest(token, newPassword);
          set({ loading: false });
          return { success: true, message: data.message };
        } catch (err) {
          const message = getErrorMessage(err, 'Error al restablecer contraseña');
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      changePassword: async ({ currentPassword, newPassword }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await changePasswordRequest({ currentPassword, newPassword });
          set({ loading: false });
          return { success: true, message: data.message };
        } catch (err) {
          const message = getErrorMessage(err, 'Error al cambiar contraseña');
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
    }),
    {
      name: 'feelweell-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.checkAuth();
        else useAuthStore.setState({ isLoadingAuth: false });
      },
    }
  )
);