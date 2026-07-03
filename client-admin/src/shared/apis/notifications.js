import { axiosHealthy } from './api.js';

export const getMyNotifications = () => axiosHealthy.get('/notifications/my');

export const markNotificationAsRead = (id) => axiosHealthy.patch(`/notifications/${id}/read`);

//Preferencias 
export const getNotificationPreferences = () => axiosHealthy.get('/notifications/preferences');

export const updateNotificationPreferences = (data) => axiosHealthy.put('/notifications/preferences', data);

export const toggleNotificationType = (type, active) =>
    axiosHealthy.patch('/notifications/preferences/toggle', { type, active });

// Cada uno aplica anti-spam (24h) y respeta las preferencias del usuario en el backend.

export const scheduleMoodReminder = () => axiosHealthy.post('/notifications/schedule/mood-reminder');

export const scheduleExerciseReminder = (exerciseId, exerciseTitle) =>
    axiosHealthy.post('/notifications/schedule/exercise-reminder', { exerciseId, exerciseTitle });

export const scheduleStreakAlert = (currentStreak, lastActivityDate) =>
    axiosHealthy.post('/notifications/schedule/streak-alert', { currentStreak, lastActivityDate });