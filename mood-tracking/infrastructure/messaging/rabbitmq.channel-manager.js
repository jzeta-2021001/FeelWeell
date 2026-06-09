import { assertTopology } from './rabbitmq.topology.js';

class RabbitMQChannelManager {
    #channel = null;
    #isInitializing = false;

    get channel() {
        return this.#channel;
    }

    get isReady() {
        return this.#channel !== null;
    }

    async initialize(connection) {
        if (this.#isInitializing) return;
        this.#isInitializing = true;

        try {
            this.#channel = await connection.createConfirmChannel();

            const prefetch = parseInt(process.env.RABBITMQ_PREFETCH) || 10;
            await this.#channel.prefetch(prefetch);//Limite de mensajes por consumidor

            await assertTopology(this.#channel);//Antes de operar se declara la topología
            this.#channel.on('error', (err) => {
                console.error('Error: ', err.message);
                this.#channel = null;
            });

            this.#channel.on('close', () => {
                console.log('Canal cerrado.');
                this.#channel = null;
            });
            console.info('Canal listo.');
        } catch (err) {
            console.error('Error al inicializar el canal de RabbitMQ', err.message);
            this.#channel = null;
        } finally {
            this.#isInitializing = false;
        }//try-catch
    }//Llama a RabbitConnection cada vez que haya una conexion activa

    getChannelOrThrow() {
        if (!this.#channel) {
            throw new Error(
                'Canal no disponible. El broker puede estar reconectando. Intenta de nuevo.'
            );
        }
        return this.#channel;
    }//Obtiene el canal consumiendo un publisher para acceder de forma segura
}

export const channelManager = new RabbitMQChannelManager();