import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {exerciseSchemas} from '../src/exercises/exercise.schema.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FeelWeell - Healthy Service Documentation API',
            version: '1.0.0',
            description: 'Documentación de la API de aplicación de apoyo emociolan FeelWeell'
        },
        components: {
            schemas:{
                ...exerciseSchemas
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:3008',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./src/**/*.routes.js',
        './src/**/*.route.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };