import mongoose, { mongo } from "mongoose";

export const dbConnection = async()=>{
    try{
        mongoose.connection.on('error', ()=>{
            console.error(`MongoDB | Error de conexión`);//Alt+124
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', ()=>{
            console.log(`MongoDB | Intentando conectar a MongoDB...`);
        });
        mongoose.connection.on('connecting', ()=>{
            console.log(`MongoDB | Conectado a MongoDB`);
        });
        mongoose.connection.on('open', ()=>{
            console.log(`MongoDB | Conectado a la base de datos de FeelWell`);
        });
        mongoose.connection.on('reconnected', ()=>{
            console.log(`MongoDB | Reconectando a MongoDB...`);
        });
        mongoose.connection.on('reconnected', ()=>{
            console.log(`MongoDB | Desconectando de MongoDB...`);
        });
        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
    }catch(e){
        console.error(`FeelWell - Error al conectar a la base de datos: ${e.message}, cerrando conexión a MongoDB...`);
        process.exit(1);
    }
}

const graceFulShutdown = async(signal)=>{
    console.log(`MongoDB | Señal recibida de ${signal}, cerrando conexión a MongoDB...`);
    try{
        await mongoose.disconnect();
        process.exit(0);
    }catch(e){
        console.error(`MongoDB | Error durante el cierre de la conexión: ${e.message}`);
        process.exit(1);
    }
}

process.on('SIGINT', ()=>graceFulShutdown('SIGINT'));
process.on('SIGTERM', ()=>graceFulShutdown('SIGTERM'));
process.on('SIGUSR2', ()=> graceFulShutdown('SIGUSR2'));