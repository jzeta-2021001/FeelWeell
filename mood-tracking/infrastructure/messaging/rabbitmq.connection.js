import amqp from 'amqplib';

//Gestiona el ciclo de vida de la conexion TCP con rabbit
const MAX_DELAY_MS = parseInt(process.env.RABBITMQ_RECONNECT_MAX_DELAY_MS) || 30000;
const BASE_DELAY_MS = parseInt(process.env.RABBITMQ_RECONNECT_DELAY_MS) || 1000;

class RabbitMQConnection {
    #connection = null; //Se pone # porque son atributos privados, exclusivamente para la clase de RabbitMQConnection
    #reconnectAttempts = 0;
    #isConnecting = false;
    #onConnectedCallbacks = [];

    onConnected(callback) {
        this.#onConnectedCallbacks.push(callback);
    }//Hace un callback cada vez que se establece una conexion

    get connection() {
        return this.#connection;
    }

    get isConnected() {
        return this.#connection !== null;
    }

    async connect() {
        if (this.#isConnecting) return;
        this.#isConnecting = true;

        while (true) {
            try {
                console.info(`Conectando... (intento ${this.#reconnectAttempts + 1})`);
                this.#connection = await amqp.connect(process.env.RABBITMQ_URL);
                this.#reconnectAttempts = 0;
                this.#isConnecting = false;

                console.log('RabbitMQ conectado exitosamente');

                this.#connection.on('error', (err) => {
                    console.error('Error en conexion: ', err.message);
                    this.#handleDisconnect();
                })

                this.#connection.on('close', () => {
                    console.warn('Conexión cerrada. Iniciando reconexión...');
                    this.#handleDisconnect();
                });

                for (const cb of this.#onConnectedCallbacks) {
                    await cb(this.#connection);
                }//Notificar a los listeners sobre que se esta estableciendo una conexion

                return this.#connection;
            } catch (err) {
                this.#reconnectAttempts++;
                const delay = this.#getBackoffDelay();
                console.error(`[RabbitMQ] No disponible. Reintentando en ${delay}ms...`);
                await this.#sleep(delay)
            }//try-catch
        }//while si se establece una conexion con RabbitMQ
    }//Conexion

    async #handleDisconnect() {
        this.#connection = null;
        this.#isConnecting = false;
        await this.connect();
    }

    #getBackoffDelay() {
        const exponential = BASE_DELAY_MS * Math.pow(2, this.#reconnectAttempts);
        const jitter = Math.random() * 1000;
        return Math.min(exponential + jitter, MAX_DELAY_MS);
    }//por cada reintento de reconectar aumenta el tiempo de espera para evitar de saturar al servicio

    #sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async close() {
        if (this.#connection) {
            await this.#connection.close();
            this.#connection = null;
            console.info('Conexión de RabbitMQ cerrada limpiamente.');
        }
    }
}//RabiitMQConection

export const rabbitConnection = new RabbitMQConnection(); //Una sola conexion por proceso.