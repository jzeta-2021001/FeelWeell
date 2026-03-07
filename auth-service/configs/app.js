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

const BASE_PATH = '/feelWell/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/auth`, authRoutes);
    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'FeelWell Admin Server'
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

const seederAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Usuario administrador ya existe');
        } else {
            //ADMIN_ROLE: Administrador principal
            const hashedPassword = await hash('Admin123!FeelWell', 10);
            const admin = new User({
                firstName: 'Administrador',
                surname: 'Principal',
                email: 'admin@feelwell.com',
                phone: '42459699',
                username: 'admin',
                password: hashedPassword,
                role: 'ADMIN_ROLE',
                isActive: true
            });
            await admin.save();
            console.log('Usuario administrador creado exitosamente');
        }

        const adminUsersExists = await User.findOne({ username: 'admin-users' });
        if (adminUsersExists) {
            console.log('Usuario admin-users ya existe');
        } else {
            //Admin-Users: Administrador de los usuarios
            const hashedPassword = await hash('AdminUsers123!FeelWell', 10);
            const adminUsers = new User({
                firstName: 'Administrador',
                surname: 'Usuarios',
                email: 'admin.users@feelwell.com',
                phone: '42459700',
                username: 'admin-users',
                password: hashedPassword,
                role: 'ADMIN_USERS_ROLE',
                isActive: true
            });
            await adminUsers.save();
            console.log('Usuario admin-users creado exitosamente');
        }

        const adminMoodExists = await User.findOne({ username: 'admin-mood' });
        if (adminMoodExists) {
            console.log('Usuario admin-mood ya existe');
        } else {
            //Admin-MoodTracking
            const hashedPassword = await hash('AdminMood123!FeelWell', 10);
            const adminMood = new User({
                firstName: 'Administrador',
                surname: 'MoodTracking',
                email: 'admin.mood@feelwell.com',
                phone: '42459701',
                username: 'admin-mood',
                password: hashedPassword,
                role: 'ADMIN_MOODTRACKING_ROLE',
                isActive: true
            });
            await adminMood.save();
            console.log('Usuario admin-mood creado exitosamente');
        }

        const adminHealthyExists = await User.findOne({ username: 'admin-healthy' });
        if (adminHealthyExists) {
            console.log('Administrador de healthy ya existe')
        } else {
            const hashedPassword = await hash('AdminHealthy123!FeelWell', 10);
            const adminHealthy = new User({
                firstName: 'Administrador',
                surname: 'Healthy',
                email: 'admin.healthy@feelwell.com',
                phone: '42459702',
                username: 'admin-healthy',
                password: hashedPassword,
                role: 'ADMIN_HEALTHY_ROLE',
                isActive: true
            });
            await adminHealthy.save();
            console.log('Usuario admin-healthy creado exitosamente.')
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
        });
    } catch (e) {
        console.error(`Error al iniciar el servidor: ${e.message}`);
        process.exit(1);
    }
};