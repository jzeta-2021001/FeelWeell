import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// ─── Schemas ─────────────────────────────────────────────────────────────────

const chatSchemas = {

    ChatInput: {
        type: 'object',
        required: ['mensaje'],
        properties: {
            mensaje: {
                type: 'string',
                minLength: 1,
                maxLength: 2000,
                description: 'Mensaje del usuario dirigido al asistente de IA (máximo 2000 caracteres)',
                example: 'Me siento muy agobiado con el trabajo últimamente'
            }
        }
    },

    ChatResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true
            },
            tipo: {
                type: 'string',
                enum: ['RESPUESTA', 'EMERGENCIA', 'BLOQUEADO'],
                description: [
                    'Indica el origen de la respuesta:',
                    '- `RESPUESTA`: respuesta normal generada por la IA.',
                    '- `EMERGENCIA`: mensaje de crisis detectado, respuesta de apoyo inmediata.',
                    '- `BLOQUEADO`: contenido bloqueado por filtros de seguridad de la IA.'
                ].join(' '),
                example: 'RESPUESTA'
            },
            respuesta: {
                type: 'string',
                description: 'Texto de respuesta del asistente',
                example: 'Entiendo que el trabajo puede ser muy pesado a veces. ¿Quieres contarme más sobre lo que está pasando?'
            }
        }
    },

    ConversationMessage: {
        type: 'object',
        properties: {
            role: {
                type: 'string',
                enum: ['USER', 'ASSISTANT'],
                description: 'Rol del emisor del mensaje',
                example: 'USER'
            },
            parts: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        text: {
                            type: 'string',
                            description: 'Contenido del mensaje',
                            example: 'Me siento muy agobiado con el trabajo'
                        }
                    }
                }
            }
        }
    },

    Conversation: {
        type: 'object',
        description: 'Historial de conversación del usuario con la IA (máximo 50 mensajes, TTL de 30 días)',
        properties: {
            _id: { type: 'string', example: '664a1f2e8b3c4d0012345678' },
            userId: {
                type: 'string',
                description: 'ID del usuario dueño de la conversación',
                example: 'user_abc123'
            },
            messages: {
                type: 'array',
                maxItems: 50,
                items: { $ref: '#/components/schemas/ConversationMessage' }
            },
            lastInteraction: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de la última interacción (usada para el TTL de 30 días)',
                example: '2025-06-15T10:30:00.000Z'
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-06-01T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' }
        }
    },

    CrisisAlert: {
        type: 'object',
        description: 'Alerta generada cuando se detectan palabras clave de riesgo en un mensaje',
        properties: {
            _id: { type: 'string', example: '664a1f2e8b3c4d0098765432' },
            userId: {
                type: 'string',
                description: 'ID del usuario que envió el mensaje de crisis',
                example: 'user_abc123'
            },
            triggerMessage: {
                type: 'string',
                description: 'Mensaje original que activó la detección de crisis',
                example: 'No quiero vivir más'
            },
            detectedKeywords: {
                type: 'array',
                description: 'Palabras clave de riesgo detectadas en el mensaje',
                items: { type: 'string' },
                example: ['NO QUIERO VIVIR']
            },
            responseGiven: {
                type: 'string',
                description: 'Respuesta de apoyo entregada al usuario',
                example: 'Te escucho y me importas mucho. No tienes que pasar por esto solo/a...'
            },
            resolved: {
                type: 'boolean',
                description: 'Indica si la alerta fue atendida por un operador',
                default: false,
                example: false
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' }
        }
    }
};

const commonSchemas = {
    ErrorResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Descripción del error' },
            error: { type: 'string', example: 'ERROR_CODE' }
        }
    }
};

// ─── Swagger config ───────────────────────────────────────────────────────────

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Feel Well — AI Chat Service',
            version: '1.0.0',
            description: 'Documentación del servicio de chat con IA de apoyo emocional Feel Well. Powered by Groq (llama-3.1-8b-instant).'
        },
        servers: [
            {
                url: 'http://localhost:3025/feelWell/v1',
                description: 'Servidor local'
            }
        ],
        components: {
            schemas: {
                ...chatSchemas,
                ...commonSchemas
            },
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
                name: 'Chat',
                description: 'Conversación con Tiyú, el asistente de apoyo emocional impulsado por IA'
            }
        ]
    },
    apis: [
        './src/chat/chat.routes.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };