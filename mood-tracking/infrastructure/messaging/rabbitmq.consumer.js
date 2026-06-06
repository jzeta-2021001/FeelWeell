import { channelManager } from './rabbitmq.channel-manager.js';

const MAX_RETRIES = parseInt(process.env.RABBITMQ_MAX_RETRIES) || 3;

export const consume = async (queue, handler) => {
    const channel = channelManager.getChannelOrThrow();
    await channel.consume(queue, async (msg) => {
        if (!msg) return; //Consumer cancelado por el broker

        let envelope;
        try {
            envelope = JSON.parse(msg.content.toString());
        } catch {
            console.error(`Mensaje no parseable en queu: ${queue}. Enviando a DLQ`);
            channel.nack(msg, false, false);//Lo manda al DLQ
            return;
        }

        const retryCount = (msg.properties.headers?.['x-retry-count'] || 0);

        try {
            await handler(envelope.data, envelope);
            channel.ack(msg);
            console.info(`[RabbitMQ Consumer] ACK: ${envelope.eventType} (${envelope.eventId})`);
        } catch (err) {
            console.error(
                `[RabbitMQ Consumer] Error procesando ${envelope.eventType}:`,
                err.message,
                { retryCount, eventId: envelope.eventId }
            );

            if (retryCount < MAX_RETRIES) {
                const retryOptions = {
                    persistent: true,
                    headers: { 'x-retry-count': retryCount + 1 },
                };//Reencolar con contador de reintentos incrementado
                // Re-publicar en la misma queue para reintento
                channel.nack(msg, false, false); // DLQ si se agotaron reintentos
            } else {
                console.warn(`[RabbitMQ Consumer] Reintentos agotados para ${envelope.eventId}. Enviando a DLQ.`);
                channel.nack(msg, false, false); // No requeue = DLQ
            }
        }
    });
    console.info(`Escuchando queue: ${queue}`);
}