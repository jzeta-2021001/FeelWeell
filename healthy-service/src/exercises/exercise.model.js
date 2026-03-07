import { Schema, model } from 'mongoose';

const EXERCISE_TYPES = ['RESPIRACIÓN', 'MEDITACIÓN', 'YOGA', 'RELAJACIÓN', 'MINDFULNESS', 'ESTIRAMIENTO'];
const PROFILE_TYPES = ['EQUILIBRADO', 'RESILIENTE', 'ANSIOSO', 'DEPRESIVO']

const exerciseSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'El título del ejercicio es obligatorio'],
            trim: true,
            maxLength: [100, 'El título no puede exceder de 100 caracteres']
        },
        photo: {
            type: String,
            default: null
        },
        photoUrl: {
            type: String,
            default: null
        },
        description: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
            trim: true,
            maxLength: [500, 'La descripción no puede exceder de 500 caracteres']
        },
        targetProfile: {
            type: String,
            required: [true, 'Obtener el perfil de emociones del usuario es obligatorio.'],
            enum: {
                values: PROFILE_TYPES,
                message: `Tipo de emoción no permitida. Los tipos permitidos son: ${PROFILE_TYPES.join(', ')}`
            }
        },
        type: {
            type: String,
            required: [true, 'El tipo de ejercicio es obligatorio'],
            enum: {
                values: EXERCISE_TYPES,
                message: `Tipo de ejercicio no válido. Los tipos permitidos son: ${EXERCISE_TYPES.join(', ')}`
            }
        },
        duration: {
            type: Number,
            required: [true, 'La duración es obligatoria'],
            min: [1, 'La duración mínima es 1 minuto']
        },
        instructions: {
            type: String,
            required: [true, 'Las instrucciones son obligatorias'],
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

export default model('Exercise', exerciseSchema);
