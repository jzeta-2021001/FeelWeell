import { create } from 'zustand';
import {
    getMyNotifications as getMyNotificationsRequest,
    markNotificationAsRead as markAsReadRequest,
    getNotificationPreferences as getPreferencesRequest,
    updateNotificationPreferences as updatePreferencesRequest,
    toggleNotificationType as toggleTypeRequest,
    scheduleMoodReminder as scheduleMoodReminderRequest,
    scheduleExerciseReminder as scheduleExerciseReminderRequest,
    scheduleStreakAlert as scheduleStreakAlertRequest,
} from '../../../shared/apis';
import { errorMessage } from '../../../shared/utils/errorMessage.js';

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unread: 0,
    preferences: null,
    loading: false,
    preferencesLoading: false,
    error: null,
    lastChecked: null,
    autoChecksRan: false,

    fetchNotifications: async () => {
        try {
            set({ loading: true, error: null });
            const { data } = await getMyNotificationsRequest();
            set({
                notifications: data.data ?? [],
                unread: data.unread ?? 0,
                loading: false,
                lastChecked: new Date().toISOString(),
            });
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'No se pudieron obtener las notificaciones');
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    markAsRead: async (id) => {
        try {
            const { data } = await markAsReadRequest(id);
            set({
                notifications: get().notifications.map((n) => (n._id === id ? data.data : n)),
                unread: Math.max(0, get().unread - 1),
            });
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'No se pudo marcar la notificación como leída');
            return { success: false, error: message };
        }
    },

    markAllAsRead: async () => {
        const unreadOnes = get().notifications.filter((n) => !n.read);
        await Promise.all(unreadOnes.map((n) => get().markAsRead(n._id)));
    },

    fetchPreferences: async () => {
        try {
            set({ preferencesLoading: true });
            const { data } = await getPreferencesRequest();
            set({ preferences: data.data, preferencesLoading: false });
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'No se pudieron obtener las preferencias');
            set({ preferencesLoading: false });
            return { success: false, error: message };
        }
    },

    updatePreferences: async (updates) => {
        try {
            const { data } = await updatePreferencesRequest(updates);
            set({ preferences: data.data });
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'No se pudieron actualizar las preferencias');
            return { success: false, error: message };
        }
    },

    toggleType: async (type, active) => {
        try {
            const { data } = await toggleTypeRequest(type, active);
            set({ preferences: data.data });
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'No se pudo actualizar el tipo de notificación');
            return { success: false, error: message };
        }
    },

    markAutoChecksRan: () => {
        if (get().autoChecksRan) return false;
        set({ autoChecksRan: true });
        return true;
    },

    checkMoodReminder: async () => {
        try {
            const { data } = await scheduleMoodReminderRequest();
            if (!data?.data?.skipped) await get().fetchNotifications();
        } catch {
            // Disparador best-effort: no interrumpe la experiencia del usuario
        }
    },

    checkStreakAlert: async (currentStreak, lastActivityDate) => {
        try {
            const { data } = await scheduleStreakAlertRequest(currentStreak, lastActivityDate);
            if (!data?.data?.skipped) await get().fetchNotifications();
        } catch {
        }
    },

    checkExerciseReminder: async (exerciseId, exerciseTitle) => {
        try {
            const { data } = await scheduleExerciseReminderRequest(exerciseId, exerciseTitle);
            if (!data?.data?.skipped) await get().fetchNotifications();
        } catch {
        }
    },
}));