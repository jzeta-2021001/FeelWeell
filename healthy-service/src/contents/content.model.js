import { Schema, model } from 'mongoose';

const CONTENT_TYPES = ['VIDEO', 'ARTÍCULO', 'RECURSO'];
const CONTENT_CATEGORIES = ['ESTRÉS', 'DEPRESIÓN', 'DESARROLLO PERSONAL', 'ANSIEDAD', 'BIENESTAR GENERAL'];

const contentSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'El título del contenido es obligatorio'],
            trim: true,
            maxLength: [150, 'El título no puede exceder de 150 caracteres']
        },
        description: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
            trim: true,
            maxLength: [600, 'La descripción no puede exceder de 600 caracteres']
        },
        type: {
            type: String,
            required: [true, 'El tipo de contenido es obligatorio'],
            enum: {
                values: CONTENT_TYPES,
                message: `Tipo de contenido no válido. Los tipos permitidos son: ${CONTENT_TYPES.join(', ')}`
            }
        },
        category: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            enum: {
                values: CONTENT_CATEGORIES,
                message: `Categoría no válida. Las categorías permitidas son: ${CONTENT_CATEGORIES.join(', ')}`
            }
        },
        url: {
            type: String,
            trim: true
        },

        photo: {
            type: String,
            default: 'uploads/contents/FeelWell_Logo_gbgakn'
        },

        photoUrl:{
            type: String,
            default: null
        },
        
        body: {
            type: String,
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Filtrar contenido eliminado por defecto en las consultas
contentSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

export default model('Content', contentSchema);
