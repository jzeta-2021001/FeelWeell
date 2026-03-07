import { Router } from 'express';
import {log,getPreferences, putPreferences, toggleType, getMyNotifications, markNotificationAsRead, scheduleMoodReminderHandler, scheduleExerciseReminderHandler, scheduleStreakAlertHandler} from './notification.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Log de notificaciones
router.post(
    '/log',
    validateJWT,
     log
);

// Preferencias
router.get(
    '/preferences',
    validateJWT, 
    getPreferences
);

router.put(
    '/preferences',
    validateJWT, 
    putPreferences
);

router.patch(
    '/preferences/toggle',
    validateJWT,
     toggleType
);

// Notificaciones del usuario
router.get(
    '/my',
    validateJWT, 
    getMyNotifications
);
router.patch(
    '/:id/read',
    validateJWT, 
    markNotificationAsRead
);

// Schedules
router.post(
    '/schedule/mood-reminder',
    validateJWT, 
    scheduleMoodReminderHandler
);
router.post(
    '/schedule/exercise-reminder',
     validateJWT, 
     scheduleExerciseReminderHandler
);
router.post(
    '/schedule/streak-alert',
    validateJWT, 
    scheduleStreakAlertHandler
);

export default router;