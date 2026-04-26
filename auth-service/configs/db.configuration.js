import mongoose from "mongoose";

/**
 * Configuración de conexión a MongoDB para el servidor FeelWell.
 *
 * Funcionalidades:
 * - Manejo de eventos de conexión (connecting, connected, error, disconnected, etc.)
 * - Configuración de timeout y pool de conexiones
 * - Manejo de errores críticos que detienen la aplicación
 */
export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.error(`MongoDB | Error de conexión`);
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', () => {
            console.log(`MongoDB | Intentando conectar a MongoDB...`);
        });

        mongoose.connection.on('connected', () => {
            console.log(`MongoDB | Conectado a MongoDB`);
        });

        mongoose.connection.on('open', () => {
            console.log(`MongoDB | Conectado a la base de datos de FeelWell`);
        });

        mongoose.connection.on('reconnected', () => {
            console.log(`MongoDB | Reconectando a MongoDB...`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log(`MongoDB | Desconectado de MongoDB`);
        });

        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });

    } catch (e) {
        console.error(`FeelWell - Error al conectar a la base de datos: ${e.message}`);
        process.exit(1);
    }
};

/**
 * Cierre controlado de la conexión a MongoDB.
 *
 * Se ejecuta cuando el proceso recibe señales del sistema:
 * - SIGINT (Ctrl + C)
 * - SIGTERM (apagado del sistema o contenedor)
 * - SIGUSR2 (reinicio por nodemon)
 */
const gracefulShutdown = async (signal) => {
    console.log(`MongoDB | Señal ${signal} recibida, cerrando conexión...`);
    try {
        await mongoose.disconnect();
        console.log(`MongoDB | Conexión cerrada correctamente`);
        process.exit(0);
    } catch (e) {
        console.error(`MongoDB | Error al cerrar la conexión: ${e.message}`);
        process.exit(1);
    }
};

// Manejo de señales del sistema
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));