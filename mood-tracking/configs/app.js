'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import moodRoute from '../src/mood-tracking/mood/mood.route.js';      
import streakRoutes from '../src/mood-tracking/streak/streak.route.js'; 
import adminRoutes from '../src/mood-tracking/admin/admin.router.js';
//import { connect as connectRabbit } from '../src/mood-tracking/rabbitmq.service.js'; // ← nuevo

const BASE_PATH = '/feelweell/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/moodTracking`, moodRoute);
    app.use(`${BASE_PATH}`, streakRoutes);
    app.use(`${BASE_PATH}/admin`, adminRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'Feel Weell Mood Tracking Services'
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
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLimit);
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        middlewares(app);
        await dbConnection();
        //await connectRabbit(); // ← nuevo
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Feel Weell - Mood Tracking Services running on port ${PORT}`);
            console.log(`Health: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    } catch (err) {
        console.error(`Error al iniciar servidor: ${err.message}`);
        process.exit(1);
    }
};