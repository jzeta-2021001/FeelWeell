import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  changePasswordRequest,
} from '../../../shared/apis';

const ALLOWED_ROLES = [
  'USER_ROLE',
  'ADMIN_ROLE',
  'ADMIN_USERS_ROLE',
  'ADMIN_MOODTRACKING_ROLE',
  'ADMIN_HEALTHY_ROLE',
];

const getErrorMessage = (error, fallback) =>
  error.response?.data?.errors?.[0]?.message ||
  error.response?.data?.error ||
  error.response?.data?.message ||
  fallback;

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
        const hasAccess = ALLOWED_ROLES.includes(user?.role);

        if (token && !hasAccess) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoadingAuth: false,
            error: 'No tienes permiso para acceder a esta aplicación',
          });
          return;
        }

        set({
          isAuthenticated: Boolean(token && user && hasAccess),
          isLoadingAuth: false,
        });
      },

      login: async ({ username, password }) => {
        try {
          set({ loading: true, error: null });
          const response = await loginRequest({ username, password });
          const { user, token } = response.data.data;

          if (!ALLOWED_ROLES.includes(user?.role)) {
            const message = 'No tienes permiso para acceder a esta aplicación';
            set({ loading: false, isAuthenticated: false, error: message });
            return { success: false, error: message };
          }

          set({ user, token, loading: false, error: null, isAuthenticated: true });
          return { success: true, role: user.role };
        } catch (error) {
          const message = getErrorMessage(error, 'Error al iniciar sesión');
          set({ loading: false, error: message, isAuthenticated: false });
          return { success: false, error: message };
        }
      },

      registerUser: async (formData) => {
        try {
          set({ loading: true, error: null });
          await registerRequest(formData);
          set({ loading: false });
          return { success: true, message: 'Cuenta creada. Revisa tu correo para activarla.' };
        } catch (error) {
          const message = getErrorMessage(error, 'Error al registrar usuario');
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ loading: true, error: null });
          const response = await forgotPasswordRequest(email);
          set({ loading: false });
          return { success: true, message: response.data.message };
        } catch (error) {
          const message = getErrorMessage(error, 'Error al enviar correo');
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      resetPassword: async ({ token, newPassword }) => {
        try {
          set({ loading: true, error: null });
          const response = await resetPasswordRequest({ token, newPassword });
          set({ loading: false });
          return { success: true, message: response.data.message };
        } catch (error) {
          const message = getErrorMessage(error, 'Error al restablecer contraseña');
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      changePassword: async ({ currentPassword, newPassword }) => {
        try {
          set({ loading: true, error: null });
          const response = await changePasswordRequest({ currentPassword, newPassword });
          set({ loading: false });
          return { success: true, message: response.data.message };
        } catch (error) {
          const message = getErrorMessage(error, 'Error al cambiar contraseña');
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      updateUser: (updates) => {
        set((s) => ({ user: { ...s.user, ...updates } }));
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
      name: 'feelweell-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkAuth();
        } else {
          useAuthStore.setState({ isLoadingAuth: false });
        }
      },
    }
  )
);