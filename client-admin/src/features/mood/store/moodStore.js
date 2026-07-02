import { create } from "zustand";
import {
    getTodayMood as getTodayMoodRequest,
    registerMood as registerMoodRequest
} from "../../../shared/apis";

export const useMoodStore = create((set) => ({
    todayMood: null,
    checkingToday: true,
    submitting: false,
    error: null,

    checkTodayMood: async () => {
        set({ checkingToday: true, todayMood: null }); 
        try {
            const response = await getTodayMoodRequest();
            const data = response.data?.data ?? response.data ?? response;
            const registered = response.data?.registered ?? !!data;
            set({ todayMood: registered ? data : null, checkingToday: false });
        } catch (err) {
            set({ checkingToday: false });
        }
    },

    registerMood: async ({ emotion, intensity, note }) => {
        set({ submitting: true, error: null });
        try {
            const response = await registerMoodRequest({ emotion, intensity, note });
            const entry = response.data?.data ?? response.data ?? response;
            set({ todayMood: entry, submitting: false });
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al registrar tu estado de ánimo';
            set({ submitting: false, error: message });
            return { success: false, error: message };
        }
    },

    reset: () => set({ todayMood: null, checkingToday: true, submitting: false, error: null }),
}))