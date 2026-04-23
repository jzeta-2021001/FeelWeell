import {logNotification,getUserPreferences,updatePreferences,toggleNotificationType,getNotificationByUser,markAsRead,scheduleMoodReminder,scheduleExerciseReminder,scheduleStreakAlert} from './notification.service.js';

export const log = async (req, res) => {
    try {
        const { userId, title, message, type, severity, metadata } = req.body;
        if (!userId || !title || !message || !type) {
            return res.status(400).json({ success: false, message: 'userId, title, message y type son requeridos' });
        }
        const result = await logNotification({ userId, title, message, type, severity, metadata });
        const status = result.skipped ? 200 : 201;
        return res.status(status).json({ success: true, data: result });
    } catch (err) {
        console.error('[log]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// validación anti-spam si ya existe una notificación del mismo
export const getPreferences = async (req, res) => {
    try {
        const preferences = await getUserPreferences(req.user.id);
        if (!preferences) {
            return res.status(404).json({ success: false, message: 'Preferencias no encontradas' });
        }
        return res.status(200).json({ success: true, data: preferences });
    } catch (err) {
        console.error('[getPreferences]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Actualiza la configuración de notificaciones del usuario
export const putPreferences = async (req, res) => {
    try {
        const preferences = await updatePreferences(req.user.id, req.body);
        return res.status(200).json({
            success: true,
            message: 'Preferencias actualizadas correctamente',
            data: preferences
        });
    } catch (err) {
        console.error('[putPreferences]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Activa o desactiva un tipo específico de notificación
export const toggleType = async (req, res) => {
    try {
        const { type, active } = req.body;

        if (!type || active === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren los campos "type" y "active"'
            });
        }

        const preferences = await toggleNotificationType(req.user.id, type, active);
        return res.status(200).json({
            success: true,
            message: `Tipo ${type} ${active ? 'activado' : 'desactivado'} correctamente`,
            data: preferences
        });
    } catch (err) {
        console.error('[toggleType]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

//Retorna todas las notificaciones de más reciente a más antigua
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await getNotificationByUser(req.user.id);
        return res.status(200).json({
            success: true,
            total: notifications.length,
            unread: notifications.filter(n => !n.read).length,
            data: notifications
        });
    } catch (err) {
        console.error('[getMyNotifications]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Marca una notificación específica como leída
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await markAsRead(req.params.id, req.user.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
        }
        return res.status(200).json({
            success: true,
            message: 'Notificación marcada como leída',
            data: notification
        });
    } catch (err) {
        console.error('[markNotificationAsRead]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Manda la notificación de registro emocional
export const scheduleMoodReminderHandler = async (req, res) => {
    try {
        const result = await scheduleMoodReminder({ userId: req.user.id });
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error('[scheduleMoodReminderHandler]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Manda la notificación de ejercicio pendiente
export const scheduleExerciseReminderHandler = async (req, res) => {
    try {
        const { exerciseId, exerciseTitle } = req.body;
        if (!exerciseId || !exerciseTitle) {
            return res.status(400).json({ success: false, message: 'exerciseId y exerciseTitle son requeridos' });
        }
        const result = await scheduleExerciseReminder({ userId: req.user.id, exerciseId, exerciseTitle });
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error('[scheduleExerciseReminderHandler]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Manda notificación de que la racha esta en riesgo
export const scheduleStreakAlertHandler = async (req, res) => {
    try {
        const { currentStreak, lastActivityDate } = req.body;
        if (!currentStreak || !lastActivityDate) {
            return res.status(400).json({ success: false, message: 'currentStreak y lastActivityDate son requeridos' });
        }
        const result = await scheduleStreakAlert({ userId: req.user.id, currentStreak, lastActivityDate });
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error('[scheduleStreakAlertHandler]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};