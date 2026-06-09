import { channelManager } from './rabbitmq.channel-manager.js';
import { EXCHANGES } from './mood.events.js';
import { randomUUID } from 'crypto';
import { timeStamp } from 'console';

export const publishEvent = async(routingKey, payload, options = {})=>{
    const channel = channelManager.getChannelOrThrow();

    const envelope={
        eventId: randomUUID(),
        eventType: routingKey, 
        occurredAt: new Date().toISOString(),
        source: 'mood-tracking-service',
        version: '1.0',
        data: payload,
    };

    const buffer = Buffer.from(JSON.stringify(envelope));

    const publishOptions={
        persistent: true, //supervivencia a reinicios
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        messageId: envelope.eventId,
        timeStamp: Date.now(),
        appId: 'mood-tracking-service',
        ...options,
    };
    channel.publish(EXCHANGES.MOOD_EVENTS, routingKey, buffer, publishOptions);

    await channel.waitForConfirms();//Esperar confirmación del broker
    console.info(`Evento confirmado: ${routingKey}`,{
        eventId: envelope.eventId,
        userId: payload.userId,
    });

    return envelope.eventId;
}