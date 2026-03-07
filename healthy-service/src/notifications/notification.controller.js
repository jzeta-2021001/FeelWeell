import {logNotification,getUserPreferences,updatePreferences,toggleNotificationType,getNotificationByUser,markAsRead,scheduleMoodReminder,scheduleExerciseReminder,scheduleStreakAlert} from './notification.service.js';

export const log = async (req, res) => {
    try {
        const { userId, title, message, type, severity, metadata } = req.body;
        const result = await logNotification({ userId, title, message, type, severity, metadata });
        const status = result.skipped ? 200 : 201;
        res.status(status).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// validación anti-spam si ya existe una notificación del mismo
export const getPreferences = async (req, res) => {
    try {
        const preferences = await getUserPreferences(req.user.id);
        res.status(200).json({ success: true, data: preferences });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Actualiza la configuración de notificaciones del usuario
export const putPreferences = async (req, res) => {
    try {
        const preferences = await updatePreferences(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Preferencias actualizadas correctamente',
            data: preferences
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
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
        res.status(200).json({
            success: true,
            message: `Tipo ${type} ${active ? 'activado' : 'desactivado'} correctamente`,
            data: preferences
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

//Retorna todas las notificacionesde más reciente a más antigua
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await getNotificationByUser(req.user.id);
        res.status(200).json({
            success: true,
            total: notifications.length,
            unread: notifications.filter(n => !n.read).length,
            data: notifications
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Marca una notificación específica como leída
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await markAsRead(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Notificación marcada como leída',
            data: notification
        });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

// Manda la notificación de registro emocional 
export const scheduleMoodReminderHandler = async (req, res) => {
    try {
        const result = await scheduleMoodReminder({ userId: req.user.id });
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Manda la notificación de ejercicio pendiente
export const scheduleExerciseReminderHandler = async (req, res) => {
    try {
        const { exerciseId, exerciseTitle } = req.body;
        const result = await scheduleExerciseReminder({ userId: req.user.id, exerciseId, exerciseTitle });
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Manda notificación de que la racha esta en riesgo
export const scheduleStreakAlertHandler = async (req, res) => {
    try {
        const { currentStreak, lastActivityDate } = req.body;
        const result = await scheduleStreakAlert({ userId: req.user.id, currentStreak, lastActivityDate });
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};