'use strict';

import { saveCrisisAlert } from '../src/crisis/crisis.service.js';

const PALABRAS_RIESGO = [
    'SUICIDIO', 'SUICIDARME', 'MATARME', 'QUITARME LA VIDA',
    'AUTOLESION', 'AUTOLESIÓN', 'HACERME DAÑO', 'NO QUIERO VIVIR',
    'MEJOR MUERTO', 'MEJOR MUERTA', 'TERMINAR CON TODO',
    'QUIERO MORIR', 'DESAPARECER PARA SIEMPRE'
];

const RESPUESTA_CRISIS =
    'Te escucho y me importas mucho. No tienes que pasar por esto solo/a. ' +
    'Por favor, contacta a una línea de ayuda ahora mismo: llama al 110 (Guatemala) ' +
    'o al número de crisis de tu país. Estoy aquí para acompañarte, ' +
    'pero ellos pueden darte el apoyo humano que necesitas ya mismo. 💙';

export const detectCrisis = async (req, res, next) => {
    const { mensaje } = req.body;
    const textoUpper = mensaje.toUpperCase();

    const keywordsDetectadas = PALABRAS_RIESGO.filter((palabra) =>
        textoUpper.includes(palabra)
    );

    if (keywordsDetectadas.length > 0) {
        const userId = req.user?.id || 'anonymous';

        // Guardamos la alerta en BD de forma no bloqueante
        saveCrisisAlert({
            userId,
            triggerMessage: mensaje,
            detectedKeywords: keywordsDetectadas,
            responseGiven: RESPUESTA_CRISIS
        });

        return res.status(200).json({
            success: true,
            tipo: 'EMERGENCIA',
            respuesta: RESPUESTA_CRISIS
        });
    }

    next();
};