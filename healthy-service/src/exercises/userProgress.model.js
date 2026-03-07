import { Schema, model } from 'mongoose';

const userProgressSchema = new Schema(
    {
        userId: {
            type: String,
            required: [true, 'El ID de usuario es obligatorio'],
            index: true
        },
        exerciseId: {
            type: Schema.Types.ObjectId,
            ref: 'Exercise',
            required: [true, 'El ID del ejercicio es obligatorio']
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date,
            default: null
        },
        savedForLater: {
            type: Boolean,
            default: false
        },
        savedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

//Un usuario solo puede tener un registro por ejercicio
userProgressSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

export default model('UserProgress', userProgressSchema);
