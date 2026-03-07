import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio. Ingrese uno por favor.'],
        trim: true,
        maxLength: [35, 'El nombre no puede tener más de 35 caracteres']
    },
    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio.'],
        trim: true,
        maxLength: [35, 'El apellido no puede tener más de 35 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: [true, 'Este correo electrónico ya existe. Ingrese uno diferente por favor.']
    },
    phone: {
        type: String,
        maxLength: [16, 'El número de teléfono no puede exceder los 16 caracteres']
    },
    username: {
        type: String,
        required: [true, 'Nombre de usuario requerido. Ingrese uno por favor.'],
        trim: true,
        unique: [true, 'Este nombre de usuario ya existe. Ingrese uno diferente por favor.'],
        maxLength: [40, 'El nombre de usuario no puede exceder los 40 caracteres.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria. Ingrese una por favor.'],
        trim: true
    },
    role: {
        type: String,
        enum: {
            values: ['ADMIN_ROLE', 'ADMIN_USERS_ROLE', 'ADMIN_MOODTRACKING_ROLE', 'USER_ROLE', 'ADMIN_HEALTHY_ROLE'],
            message: 'Rol no permitido. Ingrese un rol válido.'
        },
        default: 'USER_ROLE'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
},
    {
        timestamps: true,
        versionKey: false,
    });

export default model('User', userSchema);