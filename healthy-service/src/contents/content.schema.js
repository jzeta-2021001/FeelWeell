export const contentSchemas = {
    Content: {
        type: "object",
        required: [
            "title",
            "description",
            "type",
            "category"
        ],
        properties: {
            _id: {
                type: "string",
                example: "664f1a2b3c4d5e6f7a8b9c0d"
            },
            title: {
                type: "string",
                maxLength: 150,
                example: "Cómo manejar el estrés cotidiano"
            },
            description: {
                type: "string",
                maxLength: 600,
                example: "Artículo con técnicas prácticas para reducir el estrés en el día a día"
            },
            type: {
                type: "string",
                enum: ["VIDEO", "ARTÍCULO", "RECURSO"],
                example: "ARTÍCULO"
            },
            category: {
                type: "string",
                enum: ["ESTRÉS", "DEPRESIÓN", "DESARROLLO PERSONAL", "ANSIEDAD", "BIENESTAR GENERAL"],
                example: "ESTRÉS"
            },
            url: {
                type: "string",
                nullable: true,
                example: "https://example.com/articulo-estres"
            },
            photo: {
                type: "string",
                nullable: true,
                example: "uploads/contents/content_123"
            },
            photoUrl: {
                type: "string",
                nullable: true,
                example: "https://res.cloudinary.com/demo/image/upload/uploads/contents/content_123"
            },
            body: {
                type: "string",
                nullable: true,
                example: "El estrés es una respuesta natural del organismo ante situaciones de presión..."
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