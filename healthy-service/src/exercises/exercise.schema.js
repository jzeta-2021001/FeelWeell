export const exerciseSchemas = {
    Exercise: {
        type: "object",
        required: [
            "title",
            "description",
            "targetProfile",
            "type",
            "duration",
            "instructions"
        ],
        properties: {
            _id: {
                type: "string",
                example: "664f1a2b3c4d5e6f7a8b9c0d"
            },
            title: {
                type: "string",
                maxLength: 100,
                example: "Ejercicio de respiración profunda"
            },
            photo: {
                type: "string",
                nullable: true,
                example: "exercise_123.jpg"
            },
            photoUrl: {
                type: "string",
                nullable: true,
                example: "https://res.cloudinary.com/demo/image/upload/exercise.jpg"
            },
            description: {
                type: "string",
                maxLength: 500,
                example: "Ejercicio diseñado para reducir el estrés mediante respiración controlada"
            },
            targetProfile: {
                type: "string",
                enum: ["EQUILIBRADO", "RESILIENTE", "ANSIOSO", "DEPRESIVO"],
                example: "ANSIOSO"
            },
            type: {
                type: "string",
                enum: ["RESPIRACIÓN", "MEDITACIÓN", "YOGA", "RELAJACIÓN", "MINDFULNESS", "ESTIRAMIENTO"],
                example: "RESPIRACIÓN"
            },
            duration: {
                type: "number",
                minimum: 1,
                example: 10
            },
            instructions: {
                type: "string",
                example: "Inhala profundamente por 4 segundos, mantén por 4 segundos y exhala lentamente por 6 segundos"
            },
            isDeleted: {
                type: "boolean",
                example: false
            },
            deletedAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                example: null
            },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2024-06-01T09:50:00.000Z"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2024-06-01T10:00:00.000Z"
            }
        }
    }
};