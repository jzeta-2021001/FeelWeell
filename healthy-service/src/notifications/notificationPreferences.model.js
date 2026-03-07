import { Schema, model } from 'mongoose';

const NOTIFICATION_TYPES = ['MOOD_REMINDER', 'EXERCISE_REMINDER', 'STREAK_ALERT', 'GENERAL'];

const notificationPreferencesSchema = new Schema(
    {
        userId: {
            type: String,
            required: [true, 'El id de usuario es obligatorio'],
            unique: true,
            index: true
        },

        reminderTime: {
            type: String,
            default: '09:00',
            match: [/^\d{2}:\d{2}$/, 'El formato de hora debe ser HH:mm']
        },

        fcmToken: {
            type: String,
            default: null
        },

        activeTypes: {
            type: [String],
            enum: {
                values: NOTIFICATION_TYPES,
                message: 'Tipo de notificación no válido'
            },
            default: NOTIFICATION_TYPES
        },

        pushEnabled: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('NotificationPreferences', notificationPreferencesSchema);