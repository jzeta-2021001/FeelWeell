// client-mobile/src/features/notifications/hooks/useNotificationChecks.js
import { useEffect, useRef } from 'react';
import useNotifications from './useNotifications';

let hasCheckedThisSession = false;

export function useNotificationChecks({ todayMood, streak }) {
  const { scheduleMoodReminder, scheduleStreakAlert } = useNotifications();

  useEffect(() => {
    if (hasCheckedThisSession) return;
    hasCheckedThisSession = true;

    // Check 1: Recordatorio de estado de ánimo si no ha registrado hoy
    if (todayMood === false || todayMood === null) {
      scheduleMoodReminder();
    }

    // Check 2: Alerta de racha si pasaron más de 20 horas desde la última actividad
    if (streak && streak.currentStreak > 0 && streak.lastRegisteredAt) {
      const lastDate = new Date(streak.lastRegisteredAt).getTime();
      const now = new Date().getTime();
      const hoursDiff = (now - lastDate) / (1000 * 60 * 60);

      if (hoursDiff >= 20) {
        scheduleStreakAlert(streak.currentStreak, streak.lastRegisteredAt);
      }
    }
  }, [todayMood, streak, scheduleMoodReminder, scheduleStreakAlert]);
}

export default useNotificationChecks;
