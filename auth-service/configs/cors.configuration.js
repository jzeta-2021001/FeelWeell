/**
 * Configuración de CORS para el servidor FeelWell.
 *
 * Permite:
 * - Acceso desde cualquier origen (origin: true)
 * - Envío de credenciales (cookies, headers de autenticación)
 * - Métodos HTTP permitidos: GET, POST, PUT, PATCH
 * - Headers permitidos: Content-Type y Authorization
 *
 * Esta configuración es utilizada globalmente en la aplicación
 * para controlar las políticas de acceso entre dominios.
 */
export const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    allowedHeaders:['Content-Type', 'Authorization']
};