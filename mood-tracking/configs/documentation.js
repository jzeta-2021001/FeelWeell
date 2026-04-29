import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// ─── Schemas ─────────────────────────────────────────────────────────────────

const moodSchemas = {

    MoodEntry: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1f2e8b3c4d0012345678' },
            userId: { type: 'string', example: 'user_abc123' },
            emotion: {
                type: 'string',
                enum: [
                    'FELIZ', 'TRISTE', 'ENOJADO', 'ANSIOSO', 'CALMADO',
                    'EMOCIONADO', 'FRUSTRADO', 'NEUTRAL', 'ABRUMADO', 'DESMOTIVADO',
                    'CONFUNDIDO', 'IRRITADO', 'DESCONFIADO', 'APATICO', 'PREOCUPADO',
                    'CULPABLE', 'VERGONZOSO', 'DESCONSOLADO', 'ALTERADO', 'NOSTALGICO',
                    'VULNERABLE', 'ESPERANZADO', 'MELANCOLICO', 'AGOBIADO', 'INSEGURO'
                    // (lista completa definida en moodEntry.model.js)
                ],
                example: 'FELIZ'
            },
            intensity: {
                type: 'integer',
                minimum: 1,
                maximum: 10,
                example: 8
            },
            note: {
                type: 'string',
                maxLength: 500,
                example: 'Tuve un gran día en el trabajo'
            },
            date: {
                type: 'string',
                format: 'date-time',
                example: '2025-06-15T10:30:00.000Z'
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' }
        }
    },

    MoodEntryInput: {
        type: 'object',
        required: ['emotion', 'intensity'],
        properties: {
            emotion: {
                type: 'string',
                description: 'Emoción del usuario. Debe ser uno de los valores del enum definido en el modelo.',
                example: 'FELIZ'
            },
            intensity: {
                type: 'integer',
                minimum: 1,
                maximum: 10,
                description: 'Intensidad de la emoción (1 mínimo, 10 máximo)',
                example: 8
            },
            note: {
                type: 'string',
                maxLength: 500,
                description: 'Nota opcional sobre el estado de ánimo (máximo 500 caracteres)',
                example: 'Tuve un gran día en el trabajo'
            }
        }
    },

    QuestionnaireQuestion: {
        type: 'object',
        properties: {
            questionId: { type: 'integer', example: 1 },
            text: {
                type: 'string',
                example: '¿Con qué frecuencia te sientes abrumado/a?'
            },
            options: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        value: { type: 'integer', minimum: 1, maximum: 5, example: 1 },
                        label: { type: 'string', example: 'Nunca' }
                    }
                }
            }
        }
    },

    QuestionnaireInput: {
        type: 'object',
        required: ['answers'],
        properties: {
            answers: {
                type: 'array',
                minItems: 1,
                description: 'Arreglo de respuestas al cuestionario',
                items: {
                    type: 'object',
                    required: ['questionId', 'answer'],
                    properties: {
                        questionId: {
                            type: 'integer',
                            minimum: 1,
                            description: 'ID de la pregunta respondida',
                            example: 1
                        },
                        answer: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            description: 'Valor de la respuesta (1 al 5)',
                            example: 3
                        }
                    }
                }
            }
        }
    },

    QuestionnaireResult: {
        type: 'object',
        properties: {
            emotionalProfile: {
                type: 'string',
                enum: [
                    'ALEGRE', 'NEUTRAL', 'PROBLEMA_DE_ANSIEDAD', 'PROBLEMA_DE_TRISTEZA',
                    'PROBLEMA_DE_IRA', 'PROBLEMA_DE_CULPABILIDAD', 'AMOROSO',
                    'PROBLEMA_DE_DISOSACION', 'PROBLEMA_DE_AISLAMIENTO', 'SIN_PERFIL'
                ],
                example: 'NEUTRAL'
            },
            response: {
                $ref: '#/components/schemas/QuestionnaireResponse'
            }
        }
    },

    QuestionnaireResponse: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1f2e8b3c4d0012345678' },
            userId: { type: 'string', example: 'user_abc123' },
            answers: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        questionId: { type: 'integer', example: 1 },
                        answer: { type: 'integer', minimum: 1, maximum: 5, example: 3 }
                    }
                }
            },
            emotionalProfile: {
                type: 'string',
                enum: [
                    'ALEGRE', 'NEUTRAL', 'PROBLEMA_DE_ANSIEDAD', 'PROBLEMA_DE_TRISTEZA',
                    'PROBLEMA_DE_IRA', 'PROBLEMA_DE_CULPABILIDAD', 'AMOROSO',
                    'PROBLEMA_DE_DISOSACION', 'PROBLEMA_DE_AISLAMIENTO', 'SIN_PERFIL'
                ],
                example: 'NEUTRAL'
            },
            completedAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' }
        }
    },

    UserProfile: {
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'user_abc123' },
            emotionalProfile: {
                type: 'string',
                enum: [
                    'ALEGRE', 'NEUTRAL', 'PROBLEMA_DE_ANSIEDAD', 'PROBLEMA_DE_TRISTEZA',
                    'PROBLEMA_DE_IRA', 'PROBLEMA_DE_CULPABILIDAD', 'AMOROSO',
                    'PROBLEMA_DE_DISOSACION', 'PROBLEMA_DE_AISLAMIENTO', 'SIN_PERFIL'
                ],
                example: 'NEUTRAL'
            },
            completedQuestionnaire: {
                type: 'boolean',
                description: 'Indica si el usuario ya completó el cuestionario inicial',
                example: true
            },
            completedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha en que completó el cuestionario (presente solo si completedQuestionnaire es true)',
                example: '2025-06-15T10:30:00.000Z'
            }
        }
    }
};

const streakSchemas = {

    Streak: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '664a1f2e8b3c4d0098765432' },
            userId: { type: 'string', example: 'user_abc123' },
            currentStreak: {
                type: 'integer',
                minimum: 0,
                description: 'Días consecutivos actuales de registro',
                example: 7
            },
            maxStreak: {
                type: 'integer',
                minimum: 0,
                description: 'Racha máxima histórica del usuario',
                example: 14
            },
            lastRegisteredAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                description: 'Fecha del último registro de estado de ánimo',
                example: '2025-06-15T10:30:00.000Z'
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-05-01T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-06-15T10:30:00.000Z' }
        }
    },

    StreakSummary: {
        type: 'object',
        description: 'Resumen de racha retornado por GET /streak',
        properties: {
            currentStreak: {
                type: 'integer',
                example: 7
            },
            maxStreak: {
                type: 'integer',
                example: 14
            },
            lastRegisteredAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '2025-06-15T10:30:00.000Z'
            }
        }
    },

    StreakAtRisk: {
        type: 'object',
        description: 'Resultado de la verificación de riesgo de racha',
        properties: {
            atRisk: {
                type: 'boolean',
                description: 'true si el usuario lleva más de 20 horas sin registrar',
                example: true
            },
            hoursWithoutRegister: {
                type: 'integer',
                description: 'Horas transcurridas desde el último registro',
                example: 22
            }
        }
    }
};

const adminSchemas = {

    SystemStats: {
        type: 'object',
        description: 'Estadísticas generales del sistema de mood tracking',
        properties: {
            totalEntries: {
                type: 'integer',
                description: 'Total de registros de estado de ánimo en el sistema',
                example: 1250
            },
            totalStreaks: {
                type: 'integer',
                description: 'Total de rachas registradas en el sistema',
                example: 85
            },
            totalProfiles: {
                type: 'integer',
                description: 'Total de perfiles emocionales generados',
                example: 60
            },
            topEmotions: {
                type: 'array',
                description: 'Top 5 emociones más registradas en el sistema',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Nombre de la emoción',
                            example: 'FELIZ'
                        },
                        count: {
                            type: 'integer',
                            description: 'Cantidad de veces registrada',
                            example: 320
                        }
                    }
                }
            },
            profileDistribution: {
                type: 'array',
                description: 'Distribución de usuarios por perfil emocional',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Tipo de perfil emocional',
                            example: 'NEUTRAL'
                        },
                        count: {
                            type: 'integer',
                            description: 'Cantidad de usuarios con ese perfil',
                            example: 25
                        }
                    }
                }
            }
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
            title: 'Feel Weell — Mood Tracking Service',
            version: '1.0.0',
            description: 'Documentación del servicio de seguimiento de estado de ánimo de Feel Weell'
        },
        servers: [
            {
                url: 'http://localhost:3020/feelweell/v1',
                description: 'Servidor local'
            }
        ],
        components: {
            schemas: {
                ...moodSchemas,
                ...streakSchemas,
                ...adminSchemas,
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
            { name: 'Mood Tracking', description: 'Registro diario de estado de ánimo, cuestionario inicial y perfil emocional' },
            { name: 'Streak',        description: 'Gestión de rachas diarias de registro de estado de ánimo' },
            { name: 'Admin',         description: 'Administración del sistema. Requiere rol ADMIN_MOODTRACKING_ROLE' }
        ]
    },
    apis: [
        './src/mood-tracking/mood/mood.route.js',
        './src/mood-tracking/streak/streak.route.js',
        './src/mood-tracking/admin/admin.router.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };