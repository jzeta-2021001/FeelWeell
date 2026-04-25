import rateLimit from "express-rate-limit";

/**
 * Limitador de peticiones (Rate Limiting) para el servidor FeelWell.
 *
 * Configuración:
 * - Ventana de tiempo: 15 minutos
 * - Máximo de solicitudes por IP: 25
 *
 * Funcionalidad:
 * - Previene abuso de la API (fuerza bruta, spam, etc.)
 * - Responde con código HTTP 429 cuando se excede el límite
 *
 * Respuesta cuando se excede el límite:
 * - success: false
 * - message: mensaje descriptivo
 * - error: código interno (RATE_LIMIT_EXCEEDED)
 * - retryAfter: tiempo en segundos para volver a intentar
 */
export const requestLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 25, // máximo de 25 solicitudes por IP

    handler: (req, res) => {
        console.log(`Peticiones excedidas desde IP: ${req.ip}, Endpoint: ${req.path}`);

        res.status(429).json({
            success: false,
            message: 'Demasiadas peticiones desde esta IP. Por favor vuelva a intentarlo más tarde',
            error: 'RATE_LIMIT_EXCEEDED',
            retryAfter: req.rateLimit?.resetTime
                ? Math.round((req.rateLimit.resetTime - Date.now()) / 1000)
                : null
        });
    }
});