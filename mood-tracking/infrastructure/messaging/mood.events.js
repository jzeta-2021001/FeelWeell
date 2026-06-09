// Se declara todas las constantes para el servicio de mensajería. 
// Cualquier cambio en la topología se realiza aqui para reflejarlo en todo el sistema
export const EXCHANGES = Object.freeze({
    MOOD_EVENTS: process.env.RABBITMQ_EXCHANGE || 'mood.events',
    MOOD_DLX: process.env.RABBITMQ_DLX || 'mood.events.dlx',
});

export const ROUTING_KEYS = Object.freeze({
    STREAK_AT_RISK: 'mood.streak_at_risk',
    NOT_REGISTERED: 'mood.not_registered',
    ENTRY_CREATED: 'mood.entry.created',
    QUESTIONNAIRE_COMPLETED: 'mood.questionnaire.completed',
});

export const QUEUES = Object.freeze({
    STREAK_NOTIFICATIONS: 'mood.streak.notifications',
    STREAK_NOTIFICATIONS_DLQ: 'mood.streak.notifications.dlq',
    REMINDER_NOTIFICATIONS: 'mood.reminder.notifications',
    REMINDER_NOTIFICATIONS_DLQ: 'mood.reminder.notifications.dlq',
    ANALYTICS_EVENTS: 'mood.analytics.events',
    ANALYTICS_EVENTS_DLQ: 'mood.analytics.events.dlq',
});

//Valida que routing keys(colas) son validas para publicarlas externamente
export const VALID_PUBLISHABLE_EVENTS = Object.values(ROUTING_KEYS);