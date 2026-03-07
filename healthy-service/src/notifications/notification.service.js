import Notification from './notification.model.js';
import NotificationPreferences from './notificationPreferences.model.js';
import UserProgress from '../exercises/userProgress.model.js';

const createNotification = async ({ userId, title, message, type, severity = 'INFO', metadata = {} }) => {
    const notification = new Notification({ userId, title, message, type, severity, metadata });
    await notification.save();
    return notification;
};

// Log de notificación 
export const logNotification = async ({ userId, title, message, type, severity = 'INFO', metadata = {} }) => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await Notification.findOne({ userId, type, createdAt: { $gte: since } });

    if (recent) {
        return { skipped: true, reason: 'Notificación ya enviada en las últimas 24 horas', existing: recent };
    }

    const notification = await createNotification({ userId, title, message, type, severity, metadata });
    return { skipped: false, notification };
};

// Preferencias
export const getUserPreferences = async (userId) => {
    let preferences = await NotificationPreferences.findOne({ userId });
    if (!preferences) {
        preferences = await NotificationPreferences.create({ userId });
    }
    return preferences;
};

// Actualiza horarios y configuración de notificaciones.
export const updatePreferences = async (userId, updates) => {
    const allowedFields = ['reminderTime', 'fcmToken', 'pushEnabled'];
    const sanitized = {};

    for (const key of allowedFields) {
        if (updates[key] !== undefined) sanitized[key] = updates[key];
    }

    const preferences = await NotificationPreferences.findOneAndUpdate(
        { userId },
        { $set: sanitized },
        { new: true, upsert: true, runValidators: true }
    );

    return preferences;
};

// Activa o desactiva un tipo específico de notificación.
export const toggleNotificationType = async (userId, type, active) => {
    let preferences = await NotificationPreferences.findOne({ userId });

    if (!preferences) {
        preferences = await NotificationPreferences.create({ userId });
    }

    if (active) {
        if (!preferences.activeTypes.includes(type)) {
            preferences.activeTypes.push(type);
        }
    } else {
        preferences.activeTypes = preferences.activeTypes.filter(t => t !== type);
    }

    await preferences.save();
    return preferences;
};

// Retorna todas las notificaciones del usuario, de más reciente a más antigua.
export const getNotificationByUser = async (userId) => {
    return Notification.find({ userId }).sort({ createdAt: -1 });
};

// Marca una notificación como leída, validando que pertenezca al usuario.
export const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
    );

    if (!notification) {
        throw new Error('Notificación no encontrada o no pertenece al usuario');
    }

    return notification;
};

//  Recordatorio diario del registro emocional.
export const scheduleMoodReminder = async ({ userId }) => {
    const preferences = await NotificationPreferences.findOne({ userId });

    if (preferences && !preferences.activeTypes.includes('MOOD_REMINDER')) {
        return { skipped: true, reason: 'Tipo MOOD_REMINDER desactivado por el usuario' };
    }

    return await logNotification({
        userId,
        title: '¿Cómo te sientes hoy?',
        message: 'Aún no has registrado tu estado de ánimo. Tómate un momento para hacerlo.',
        type: 'MOOD_REMINDER',
        severity: 'INFO',
        metadata: { triggeredAt: new Date().toISOString() }
    });
};

// Recordatorio para ejercicio guardado pero no completado.
export const scheduleExerciseReminder = async ({ userId, exerciseId, exerciseTitle, savedAt }) => {
    const progress = await UserProgress.findOne({ userId, exerciseId });

    if (!progress || progress.completed || !progress.savedForLater) {
        return { skipped: true, reason: 'El ejercicio no está pendiente para este usuario' };
    }

    const preferences = await NotificationPreferences.findOne({ userId });

    if (preferences && !preferences.activeTypes.includes('EXERCISE_REMINDER')) {
        return { skipped: true, reason: 'Tipo EXERCISE_REMINDER desactivado por el usuario' };
    }

    return await logNotification({
        userId,
        title: '¡No olvides tu ejercicio pendiente!',
        message: `Tienes el ejercicio "${exerciseTitle}" guardado para después. ¿Lo completamos?`,
        type: 'EXERCISE_REMINDER',
        severity: 'INFO',
        metadata: { exerciseId, exerciseTitle, savedAt: savedAt ?? progress.savedAt }
    });
};

// Alerta cuando la racha está en riesgo. 
export const scheduleStreakAlert = async ({ userId, currentStreak, lastActivityDate }) => {
    const preferences = await NotificationPreferences.findOne({ userId });

    if (preferences && !preferences.activeTypes.includes('STREAK_ALERT')) {
        return { skipped: true, reason: 'Tipo STREAK_ALERT desactivado por el usuario' };
    }

    return await logNotification({
        userId,
        title: '¡Tu racha está en riesgo!',
        message: `Llevas ${currentStreak} días seguidos. No pierdas tu racha, registra tu actividad de hoy.`,
        type: 'STREAK_ALERT',
        severity: 'ADVERTENCIA',
        metadata: { currentStreak, lastActivityDate }
    });
};