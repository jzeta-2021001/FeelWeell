import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.error(`Mongo DB | Error de conexión`);
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log(`Mongo DB | Intentando conectar a Mongo DB...`);
        });
        mongoose.connection.on('connected', () => {
            console.log(`Mongo DB | Conectado a Mongo DB`);
        });
        mongoose.connection.on('open', () => {
            console.log(`Mongo DB | Conectado a la base de datos de FeelWell`);
        });
        mongoose.connection.on('reconnected', () => {
            console.log(`Mongo DB | Reconectando a Mongo DB...`);
        });
        mongoose.connection.on('disconnected', () => {
            console.log(`Mongo DB | Desconectado de Mongo DB`);
        });

        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
    } catch (e) {
        console.error(`Healthy Service - Error al conectar a la base de datos: ${e.message}, cerrando conexión a Mongo DB...`);
        process.exit(1);
    }
};

const gracefulShutdown = async (signal) => {
    console.log(`Mongo DB | Señal recibida de ${signal}, cerrando conexión a Mongo DB...`);
    try {
        await mongoose.disconnect();
        process.exit(0);
    } catch (e) {
        console.error(`Mongo DB | Error durante el cierre de la conexión: ${e.message}`);
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
