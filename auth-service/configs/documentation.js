import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FeelWell API',
            version: '1.0.0',
            description: 'Documentación del servicio de autenticación y usuarios de FeelWell'
        },
        servers: [
            {
                url: 'http://localhost:3000', // ajusta si usas otro puerto
                description: 'Servidor local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }],
        tags: [
            {
                name: 'Auth',
                description: 'Autenticación y gestión de usuarios'
            }
        ]
    },

    // IMPORTANTE: aquí apuntas a tus routes documentadas
    apis: [
        './src/user.routes.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };