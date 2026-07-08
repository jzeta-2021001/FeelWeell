'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from '../middlewares/rateLimit.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import exerciseRoutes from '../src/exercises/exercise.routes.js';
// Inyección: Importar rutas del reto diario
import dailyChallengeRoutes from '../src/exercises/dailyChallenge.routes.js';
import contentRoutes from '../src/contents/content.routes.js';
import notificationRoutes from '../src/notifications/notification.route.js';
import { swaggerSpec, swaggerUi } from './documentation.js';

// Inyección: Importar el seeder de retos diarios
import { seedDailyChallenges } from '../src/exercises/exercise.seeder.js';

const BASE_PATH = '/feelWeell/v1';

const routes = (app) => {
    // 1. CORRECCIÓN DE PRECEDENCIA: Registrar primero el endpoint específico
    app.use(`${BASE_PATH}/exercises/daily-challenge`, dailyChallengeRoutes);
    
    // 2. Registrar después el endpoint general (evita el Route Shadowing)
    app.use(`${BASE_PATH}/exercises`, exerciseRoutes);
    
    app.use(`${BASE_PATH}/contents`, contentRoutes);
    app.use(`${BASE_PATH}/notifications`, notificationRoutes);
    app.use(`${BASE_PATH}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'Healthy Service'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    });
};

const middlewares = (app) => {
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(requestLimit);
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        middlewares(app);
        
        // 1. Conexión a Base de Datos
        await dbConnection();
        
        // 2. Inyección: Ejecutar la carga de retos iniciales
        await seedDailyChallenges();

        // 3. Inicialización de Rutas
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Healthy Service running on port: ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
            console.log(`Swagger docs: http://localhost:${PORT}${BASE_PATH}/api-docs`);
        });
    } catch (e) {
        console.error(`Error al iniciar el servidor: ${e.message}`);
        process.exit(1);
    }
};