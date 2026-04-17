'use strict';

import { sendMessage } from './chat.service.js';

export const chat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { mensaje } = req.body;

        const result = await sendMessage(userId, mensaje);

        res.status(200).json({
            success: true,
            tipo: 'RESPUESTA',
            respuesta: result.respuesta
        });
    } catch (e) {
        if (e.message?.includes('SAFETY')) {
            return res.status(200).json({
                success: true,
                tipo: 'BLOQUEADO',
                respuesta:
                    'No puedo responder a eso, amigo/a. Pero estoy aquí para escucharte. ' +
                    '¿Cómo te sientes en este momento?'
            });
        }
        res.status(500).json({ success: false, message: e.message });
    }
};