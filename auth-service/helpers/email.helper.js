import nodemailer from 'nodemailer';

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('EMAIL_USER o EMAIL_PASS no están configurados en .env');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

export const sendActivationEmail = async (email, token, firstName) => {
    const activationLink = `${process.env.FRONTEND_URL || 'http://localhost:3007/feelWell/v1/auth'}/activate/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Activa tu cuenta - FeelWell',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #9C6BFF;">¡Bienvenido a FeelWell, ${firstName}!</h2>
                <p>Tu cuenta ha sido creada exitosamente. Para activarla y comenzar a disfrutar de nuestros servicios, haz clic en el siguiente enlace:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${activationLink}" 
                        style="background: linear-gradient(90deg, #6EA8FF, #B57CFF); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                        Activar mi cuenta
                    </a>
                </div>

                <p style="color: #666; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <p style="color: #6EA8FF; word-break: break-all;">${activationLink}</p>

                <hr style="border: none; border-top: 1px solid #E0E7FF; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
            </div>
        `
    };

    try {
        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar email:', error);
        throw new Error('Error al enviar el correo de activación');
    }
};

export const sendWelcomeEmail = async (email, firstName, username) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Bienvenido a FeelWell - Tu cuenta ha sido activada',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #9C6BFF;">¡Hola ${firstName}!</h2>
                <p>Tu cuenta en FeelWell ha sido activada exitosamente.</p>
                
                <div style="background-color: #EEF4FF; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #6EA8FF;">Tu nombre de usuario:</h3>
                    <p><strong style="color: #9C6BFF;">${username}</strong></p>
                </div>
                
                <p>Ya puedes iniciar sesión y comenzar a utilizar todos nuestros servicios.</p>
                
                <hr style="border: none; border-top: 1px solid #E0E7FF; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">Este es un correo automático, por favor no respondas.</p>
            </div>
        `
    };

    try {
        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar email de bienvenida:', error);
    }
};

export const sendPasswordResetEmail = async (email, token, username) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña - FeelWell',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #9C6BFF;">Hola ${username},</h2>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en FeelWell.</p>
                
                <p>Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                        style="background: linear-gradient(90deg, #B57CFF, #6EA8FF); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                        Restablecer mi contraseña
                    </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <p style="color: #6EA8FF; word-break: break-all;">${resetLink}</p>
                
                <p style="color: #B57CFF;"><strong>Este enlace expirará en 1 hora por seguridad.</strong></p>
                
                <hr style="border: none; border-top: 1px solid #E0E7FF; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">Si no solicitaste restablecer tu contraseña, ignora este correo. Tu contraseña permanecerá sin cambios.</p>
            </div>
        `
    };

    try {
        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar email de reset:', error);
        throw new Error('Error al enviar el correo de recuperación');
    }
};

export const sendPasswordChangedEmail = async (email, firstName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Tu contraseña ha sido cambiada - FeelWell',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #9C6BFF;">Hola ${firstName},</h2>
                <p>Te confirmamos que tu contraseña ha sido cambiada exitosamente.</p>
                
                <div style="background-color: #EEF4FF; border-left: 4px solid #6EA8FF; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #9C6BFF;">
                        Tu contraseña se actualizó el día ${new Date().toLocaleString('es-ES')}
                    </p>
                </div>
                
                <p style="color: #B57CFF;"><strong>Si no realizaste este cambio:</strong></p>
                <p>Por favor, contacta inmediatamente con nuestro equipo de soporte.</p>
                
                <hr style="border: none; border-top: 1px solid #E0E7FF; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">Este es un correo automático de seguridad.</p>
            </div>
        `
    };

    try {
        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar email de confirmación:', error);
    }
};