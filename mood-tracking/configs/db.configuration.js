import mongoose from 'mongoose'; 

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.error(`Mongo DB | No se pudo conectar a Mongo DB`);
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => console.log(`Mongo DB | Conectando...`));
        mongoose.connection.on('connected', () => console.log(`Mongo DB | Conectado`));
        mongoose.connection.on('disconnected', () => console.log(`Mongo DB | Desconectado`));

        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });
    } catch (err) {
        console.error(`Error al conectar a la base de datos: ${err.message}`);
        process.exit(1);
    }
};

const gracefulShutdown = async (signal) => {
    console.log(`Mongo DB | Señal ${signal}, cerrando conexión...`);
    try {
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));