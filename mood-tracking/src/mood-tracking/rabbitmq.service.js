import amqp from 'amqplib';

let channel = null;

export const connect = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange('mood_exchange', 'topic', { durable: true });
        console.log('RabbitMQ conectado');

        connection.on('close', () => {
            console.warn('⚠️ RabbitMQ desconectado, reconectando...');
            channel = null;
            setTimeout(connect, 5000);
        });

        connection.on('error', (err) => {
            console.error('Error RabbitMQ:', err.message);
            channel = null;
            setTimeout(connect, 5000);
        });

    } catch (err) {
        console.error('RabbitMQ no disponible, reintentando en 5s...', err.message);
        channel = null;
        setTimeout(connect, 5000);
    }
};

export const publishMoodEvent = async (routingKey, payload) => {
    if (!channel) {
        throw new Error('RabbitMQ no está conectado, intenta de nuevo en unos segundos');
    }
    const message = Buffer.from(JSON.stringify(payload));
    channel.publish('mood_exchange', routingKey, message, { persistent: true });
    console.log(`Evento publicado: ${routingKey}`, payload);
};


//Esto se utilizará mas adelante cuando se implemente la integración con RabbitMQ para publicar eventos de estado de ánimo. Por ahora, el código está comentado para evitar errores si RabbitMQ no está configurado o disponible durante el desarrollo inicial.
//Con la existencia del front. 