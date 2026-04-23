import {
    createUserRecord,
    activateUserAccount,
    loginUser,
    changePassword,
    requestPasswordReset,
    resetPassword
} from "./user.services.js";
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    try {
        const user = await createUserRecord({ userData: req.body });

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente. Revisa tu correo para activar tu cuenta.',
            data: user
        });

    } catch (e) {
        // Si el error viene del envío de correo, el usuario YA fue guardado en BD.
        // Reportamos qué falló exactamente para que sea fácil de diagnosticar.
        if (e.message.includes('correo') || e.message.includes('EMAIL') || e.message.includes('nodemailer')) {
            return res.status(500).json({
                success: false,
                message: 'Usuario creado pero no se pudo enviar el correo de activación.',
                error: e.message,
                hint: 'Verifica que EMAIL_USER, EMAIL_PASS y FRONTEND_URL estén configurados correctamente en el .env'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario',
            error: e.message
        });
    }
};


//Activar cuenta
export const activateAccount = async (req, res) => {
    try {
        const { token } = req.params;
        await activateUserAccount(token);

        return res.status(200).json({
            success: true,
            message: 'Cuenta activada exitosamente. Ya puedes iniciar sesión.'
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Error al activar la cuenta',
            error: e.message
        });
    }
};


//Login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await loginUser(username, password);

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h',
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE
            }
        );

        //poder relacionar los mensajes realizados en .net
        let dailyMessage = null;
        try {
            const mgResponse = await fetch(
                `http://localhost:5001/api/daily-message/today/${user._id}`,
                {
                    headers:{
                        //============FIX=============
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if(mgResponse.ok){
                const msgData = await mgResponse.json();
                dailyMessage = msgData.data;
            }else{
                console.error('daily-service respondió con status:', mgResponse.status);
            }
        } catch (err) {
            console.error('daily-positive-service no esta disponible', err.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: { user, token, dailyMessage }
        });

    } catch (e) {
        return res.status(401).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: e.message
        });
    }
};

//Actualizar Contraseña
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        await changePassword(userId, currentPassword, newPassword);

        return res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Error al cambiar la contraseña',
            error: e.message
        });
    }
};


//Recuperar contraseña(olvidada)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await requestPasswordReset(email);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Error al procesar la solicitud',
            error: e.message
        });
    }
};


//Restablecer contraseña
export const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const result = await resetPassword(token, newPassword);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Error al restablecer la contraseña',
            error: e.message
        });
    }
};


//Crear Admin 
export const createAdmin = async (req, res) => {
    try {
        const user = await createUserRecord({ 
            userData: { ...req.body, role: 'ADMIN_ROLE' }  // fuerza el rol admin
        });

        return res.status(201).json({
            success: true,
            message: 'Admin creado exitosamente.',
            data: user
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el admin',
            error: e.message
        });
    }
};

//Crear Admin Mood Tracking
export const createAdminMood = async (req, res) => {
    try {
        const user = await createUserRecord({ 
            userData: { ...req.body, role: 'ADMIN_MOODTRACKING_ROLE' }
        });

        return res.status(201).json({
            success: true,
            message: 'Admin de mood tracking creado exitosamente.',
            data: user
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el admin de mood tracking',
            error: e.message
        });
    }
};

//Crear Admin Healthy Service
export const createAdminHealthy = async (req, res) => {
    try {
        const user = await createUserRecord({ 
            userData: { ...req.body, role: 'ADMIN_HEALTHY_ROLE' }
        });

        return res.status(201).json({
            success: true,
            message: 'Admin de healthy service creado exitosamente.',
            data: user
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el admin de healthy service',
            error: e.message
        });
    }
};