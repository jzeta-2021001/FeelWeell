import { useCallback, useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore.js';
import { getStreak } from '../../../shared/apis';

const POLL_INTERVAL_MS = 5 * 60 * 1000;

/**
  @param {object} options
  @param {boolean} options.autoCheck 
 */
export const useNotificationCenter = ({ autoCheck = true } = {}) => {
    const {
        notifications,
        unread,
        preferences,
        loading,
        preferencesLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        fetchPreferences,
        updatePreferences,
        toggleType,
        markAutoChecksRan,
        checkMoodReminder,
        checkStreakAlert,
        checkExerciseReminder,
    } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
        fetchPreferences();
    }, [fetchNotifications, fetchPreferences]);

    useEffect(() => {
        const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    useEffect(() => {
        if (!autoCheck || !markAutoChecksRan()) return;

        const runChecks = async () => {
            await checkMoodReminder();

            try {
                const { data } = await getStreak();
                const currentStreak = data?.currentStreak ?? 0;
                const lastActivityDate = data?.lastRegisteredAt;
                if (currentStreak > 0 && lastActivityDate) {
                    const hoursSince = (Date.now() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60);
                    if (hoursSince > 20) {
                        await checkStreakAlert(currentStreak, lastActivityDate);
                    }
                }
            } catch {
            }
        };

        runChecks();
    }, [autoCheck, markAutoChecksRan, checkMoodReminder, checkStreakAlert]);

    const notifyExerciseSaved = useCallback(
        (exerciseId, exerciseTitle) => checkExerciseReminder(exerciseId, exerciseTitle),
        [checkExerciseReminder]
    );

    return {
        notifications,
        unread,
        preferences,
        loading,
        preferencesLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        fetchPreferences,
        updatePreferences,
        toggleType,
        notifyExerciseSaved,
    };
};