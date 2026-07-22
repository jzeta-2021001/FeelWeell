// src/shared/store/authStore.js
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: el auth-service de FeelWeel NO expone un endpoint de refresh token.
// El login sólo devuelve { user, token } (JWT firmado, expira por defecto en 1h).
// No implementamos lógica de refresh silencioso ni persistimos un refreshToken:
// cuando el token expira (401 del backend), la sesión se cierra y el usuario
// debe volver a iniciar sesión.

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoadingAuth: false,
      _hasHydrated: false,
      // Bandera transitoria (NO persistida): se activa justo después de un
      // login exitoso para que la UI pueda reaccionar una sola vez (ej. que
      // Tiyú salude en el HomeScreen). Se consume y limpia con clearJustLoggedIn().
      justLoggedIn: false,

      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
          justLoggedIn: true,
        }),

      clearJustLoggedIn: () => set({ justLoggedIn: false }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          justLoggedIn: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'feelweell-mobile-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // justLoggedIn es transitorio: no lo persistimos, así que no debe
      // sobrevivir a un cierre de la app (evita que Tiyú salude "sin motivo"
      // al reabrir la app con una sesión ya guardada).
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true;
      },
    }
  )
);

export default useAuthStore;