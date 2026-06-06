import { EXCHANGES, QUEUES, ROUTING_KEYS } from './mood.events.js';

//Deckara y garantiza la existencia de toda la topología, lo separa con la lógica de negocio.
export const assertTopology = async (channel) => {
    //Dead Letter Exchange (debe declararse ANTES que las queues que lo usan)
    await channel.assertExchange(EXCHANGES.MOOD_DLX, 'direct', { durable: true });

    //Exchange principal
    await channel.assertExchange(EXCHANGES.MOOD_EVENTS, 'topic', { durable: true });

    //Dead Letter Queues
    await channel.assertQueue(QUEUES.STREAK_NOTIFICATIONS_DLQ, { durable: true });
    await channel.assertQueue(QUEUES.REMINDER_NOTIFICATIONS_DLQ, { durable: true });
    await channel.assertQueue(QUEUES.ANALYTICS_EVENTS_DLQ, { durable: true });

    //Bindings de DLQs al DLX
    await channel.bindQueue(QUEUES.STREAK_NOTIFICATIONS_DLQ, EXCHANGES.MOOD_DLX, QUEUES.STREAK_NOTIFICATIONS);
    await channel.bindQueue(QUEUES.REMINDER_NOTIFICATIONS_DLQ, EXCHANGES.MOOD_DLX, QUEUES.REMINDER_NOTIFICATIONS);
    await channel.bindQueue(QUEUES.ANALYTICS_EVENTS_DLQ, EXCHANGES.MOOD_DLX, QUEUES.ANALYTICS_EVENTS);

    //Queues principales con DLX configurado
    const dlqOptions = (dlqRoutingKey) => ({
        durable: true,
        arguments: {
            'x-dead-letter-exchange': EXCHANGES.MOOD_DLX,
            'x-dead-letter-routing-key': dlqRoutingKey,
            'x-message-ttl': 86400000, // 24h TTL antes de ir a DLQ
        },
    });

    await channel.assertQueue(
        QUEUES.STREAK_NOTIFICATIONS,
        dlqOptions(QUEUES.STREAK_NOTIFICATIONS)
    );

    await channel.assertQueue(
        QUEUES.REMINDER_NOTIFICATIONS,
        dlqOptions(QUEUES.REMINDER_NOTIFICATIONS)
    );

    await channel.assertQueue(
        QUEUES.ANALYTICS_EVENTS,
        dlqOptions(QUEUES.ANALYTICS_EVENTS)
    );

    //Bindings:Queue via Routing Key
    await channel.bindQueue(
        QUEUES.STREAK_NOTIFICATIONS,
        EXCHANGES.MOOD_EVENTS,
        ROUTING_KEYS.STREAK_AT_RISK
    );

    await channel.bindQueue(
        QUEUES.REMINDER_NOTIFICATIONS,
        EXCHANGES.MOOD_EVENTS,
        ROUTING_KEYS.NOT_REGISTERED
    );

    await channel.bindQueue(
        QUEUES.ANALYTICS_EVENTS,
        EXCHANGES.MOOD_EVENTS,
        `mood.#` // wildcard: captura todos los eventos de mood
    );

    console.info('Topología declarada correctamente.');
};