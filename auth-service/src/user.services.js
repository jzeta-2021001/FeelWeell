import User from './user.model.js';
import { hash, verify } from '@node-rs/bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendActivationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from '../helpers/email.helper.js';

export const createUserRecord = async ({ userData }) => {
    const hashedPassword = await hash(userData.password, 10);
    const activationToken = uuidv4();

    const user = new User({
        ...userData,
        role: userData.role || 'USER_ROLE',
        password: hashedPassword,
        activationToken,
        isActive: false
    });

    await user.save();

    await sendActivationEmail(
        user.email,
        activationToken,
        user.firstName
    );

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.activationToken;

    return userObject;
};


//Activate count
export const activateUserAccount = async (token) => {
    const user = await User.findOne({ activationToken: token });

    if (!user) {
        const error = new Error('Este enlace ya fue usado o expiro. Si tu cuenta ya esta activa, puedes iniciar sesion.');
        error.code = 'ACTIVATION_TOKEN_INVALID';
        throw error;
    }

    if (user.isActive) {
        return {
            alreadyActive: true,
            user
        };
    }

    user.isActive = true;
    user.activationToken = undefined;

    await user.save();

    return {
        alreadyActive: false,
        user
    };
};


//Login
export const loginUser = async (username, password) => {
    const user = await User.findOne({
        $or: [{ username }, { email: username }]
    });

    if (!user) {
        throw new Error('Credenciales incorrectas');
    }

    if (!user.isActive) {
        throw new Error('Cuenta no activada. Por favor revisa tu correo electrónico');
    }

    const isPasswordValid = await verify(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Credenciales incorrectas');
    }

    const isFirstLogin = user.createdAt.getTime() === user.updatedAt.getTime();

    if (isFirstLogin) {
        try {
            await sendWelcomeEmail(
                user.email,
                user.firstName,
                user.username
            );
        } catch (error) {
            console.error('Error al enviar email de bienvenida:', error);
        }
    }

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.activationToken;

    return userObject;
};


//cambiar contra
export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await verify(currentPassword, user.password);

    if (!isPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await sendPasswordChangedEmail(
        user.email,
        user.firstName
    );

    return { message: 'Contraseña actualizada exitosamente' };
};


//Solicitud de restablecimiento de contra
export const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('No existe un usuario con ese correo electrónico');
    }

    if (!user.isActive) {
        throw new Error('La cuenta no está activada');
    }

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;

    await user.save();

    await sendPasswordResetEmail(
        user.email,
        resetToken,
        user.firstName
    );

    return {
        message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña'
    };
};

//restablecer contra
export const resetPassword = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error('Token de recuperación inválido o expirado');
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    await sendPasswordChangedEmail(
        user.email,
        user.firstName
    );

    return { message: 'Contraseña restablecida exitosamente' };
};

// Agregar al final de user.services.js

export const updateProfileRecord = async (userId, profileData) => {
    const { firstName, surname, phone, email, username } = profileData;

    if (email) {
        const existing = await User.findOne({ email, _id: { $ne: userId } });
        if (existing) {
            const e = new Error('El correo ya está registrado por otro usuario');
            e.statusCode = 409;
            throw e;
        }
    }

    if (username) {
        const existing = await User.findOne({ username, _id: { $ne: userId } });
        if (existing) {
            const e = new Error('El username ya está registrado por otro usuario');
            e.statusCode = 409;
            throw e;
        }
    }

    const updated = await User.findByIdAndUpdate(
        userId,
        { firstName, surname, phone, email, username },
        { new: true, runValidators: true }
    ).select('-password -activationToken -resetPasswordToken -resetPasswordExpires');

    if (!updated) {
        const e = new Error('Usuario no encontrado');
        e.statusCode = 404;
        throw e;
    }

    return updated;
};

export const getAllUsersRecord = async ({ page = 1, limit = 20 } = {}) => {
    const safeLimit = Math.min(Number(limit) || 20, 100);
    const safePage = Math.max(Number(page) || 1, 1);

    const [users, total] = await Promise.all([
        User.find()
            .select('-password -activationToken -resetPasswordToken -resetPasswordExpires')
            .sort({ createdAt: -1 })
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit)
            .lean(),
        User.countDocuments()
    ]);

    return {
        users,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit)
        }
    };
};

export const toggleUserStatusRecord = async (id) => {
    const user = await User.findById(id).select('-password -activationToken -resetPasswordToken -resetPasswordExpires');
    if (!user) {
        const e = new Error('Usuario no encontrado');
        e.statusCode = 404;
        throw e;
    }
    user.isActive = !user.isActive;
    await user.save();
    return user;
};

export const deleteUserRecord = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        const e = new Error('Usuario no encontrado');
        e.statusCode = 404;
        throw e;
    }
    return { message: 'Usuario eliminado correctamente' };
};