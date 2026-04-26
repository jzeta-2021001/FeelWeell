'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { hash } from '@node-rs/bcrypt';
import User from '../src/user.model.js';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import authRoutes from '../src/user.routes.js';

// Swagger
import { swaggerSpec, swaggerUi } from './documentation.js';

const BASE_PATH = '/feelWell/v1';

const routes = (app) => {

    // Rutas principales
    app.use(`${BASE_PATH}/auth`, authRoutes);

    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    /**
     * @swagger
     * tags:
     *   name: Health
     *   description: Verificación del estado del servidor
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     HealthResponse:
     *       type: object
     *       properties:
     *         status:
     *           type: string
     *           example: "Healthy"
     *         timeStamp:
     *           type: string
     *           format: date-time
     *           example: "2025-06-01T00:00:00.000Z"
     *         service:
     *           type: string
     *           example: "FeelWell Admin Server"
     *     ErrorResponse:
     *       type: object
     *       properties:
     *         success:
     *           type: boolean
     *           example: false
     *         message:
     *           type: string
     *           example: "Descripción del error"
     */

    /**
     * @swagger
     * /feelWell/v1/health:
     *   get:
     *     summary: Verificar estado del servidor
     *     description: Devuelve el estado actual del servidor y su disponibilidad.
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Servidor funcionando correctamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/HealthResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *             example:
     *               success: false
     *               message: "Error interno del servidor"
     */
    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'FeelWell Admin Server'
        });
    });

    // 404
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

const seederAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await hash('Admin123!FeelWell', 10);
            await new User({
                firstName: 'Administrador',
                surname: 'Principal',
                email: 'admin@feelwell.com',
                phone: '42459699',
                username: 'admin',
                password: hashedPassword,
                role: 'ADMIN_ROLE',
                isActive: true
            }).save();
        }

        const adminUsersExists = await User.findOne({ username: 'admin-users' });
        if (!adminUsersExists) {
            const hashedPassword = await hash('AdminUsers123!FeelWell', 10);
            await new User({
                firstName: 'Administrador',
                surname: 'Usuarios',
                email: 'admin.users@feelwell.com',
                phone: '42459700',
                username: 'admin-users',
                password: hashedPassword,
                role: 'ADMIN_USERS_ROLE',
                isActive: true
            }).save();
        }

        const adminMoodExists = await User.findOne({ username: 'admin-mood' });
        if (!adminMoodExists) {
            const hashedPassword = await hash('AdminMood123!FeelWell', 10);
            await new User({
                firstName: 'Administrador',
                surname: 'MoodTracking',
                email: 'admin.mood@feelwell.com',
                phone: '42459701',
                username: 'admin-mood',
                password: hashedPassword,
                role: 'ADMIN_MOODTRACKING_ROLE',
                isActive: true
            }).save();
        }

        const adminHealthyExists = await User.findOne({ username: 'admin-healthy' });
        if (!adminHealthyExists) {
            const hashedPassword = await hash('AdminHealthy123!FeelWell', 10);
            await new User({
                firstName: 'Administrador',
                surname: 'Healthy',
                email: 'admin.healthy@feelwell.com',
                phone: '42459702',
                username: 'admin-healthy',
                password: hashedPassword,
                role: 'ADMIN_HEALTHY_ROLE',
                isActive: true
            }).save();
        }
    } catch (e) {
        console.error('Error al crear administradores:', e.message);
    }
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        middlewares(app);
        await dbConnection();
        await seederAdmin();
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`FeelWell Server running on port: ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
            console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
        });
    } catch (e) {
        console.error(`Error al iniciar el servidor: ${e.message}`);
        process.exit(1);
    }
};