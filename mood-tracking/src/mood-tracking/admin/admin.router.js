import { Router } from 'express';
import * as adminController from './admin.controller.js';
import validateJWT from '../../../middlewares/validate-JWT.js';
import { validateRole } from '../../../middlewares/validate-role.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administración del sistema de mood tracking. Requiere rol ADMIN_MOODTRACKING_ROLE.
 */

// Solo ADMIN_MOODTRACKING_ROLE puede acceder
router.use(validateJWT);
router.use(validateRole('ADMIN_MOODTRACKING_ROLE'));

/**
 * @swagger
 * /feelweell/v1/admin/mood-entries:
 *   get:
 *     summary: Listar todos los registros de estado de ánimo
 *     description: |
 *       Devuelve todos los registros de estado de ánimo del sistema, con soporte de filtros opcionales por
 *       usuario y rango de fechas. Los resultados se ordenan del más reciente al más antiguo.
 *       Requiere rol ADMIN_MOODTRACKING_ROLE.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: ID del usuario para filtrar sus registros
 *         example: "user_abc123"
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango (ISO 8601)
 *         example: "2025-06-01"
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango (ISO 8601)
 *         example: "2025-06-30"
 *     responses:
 *       200:
 *         description: Lista de registros de estado de ánimo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MoodEntry'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error interno del servidor"
 */
router.get('/mood-entries', adminController.getAllMoodEntries);

/**
 * @swagger
 * /feelweell/v1/admin/mood-entries/{id}:
 *   delete:
 *     summary: Eliminar un registro de estado de ánimo
 *     description: |
 *       Elimina permanentemente un registro de estado de ánimo por su ID.
 *       Requiere rol ADMIN_MOODTRACKING_ROLE.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro de estado de ánimo (ObjectId)
 *         example: "664a1f2e8b3c4d0012345678"
 *     responses:
 *       200:
 *         description: Registro eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registro 664a1f2e8b3c4d0012345678 eliminado"
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Registro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Registro no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/mood-entries/:id', adminController.deleteMoodEntry);

/**
 * @swagger
 * /feelweell/v1/admin/streaks:
 *   get:
 *     summary: Listar todas las rachas del sistema
 *     description: |
 *       Devuelve todas las rachas registradas en el sistema, ordenadas de mayor a menor
 *       por `currentStreak`. Requiere rol ADMIN_MOODTRACKING_ROLE.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de rachas del sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Streak'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/streaks', adminController.getAllStreaks);

/**
 * @swagger
 * /feelweell/v1/admin/streaks/{userId}/reset:
 *   put:
 *     summary: Resetear la racha de un usuario
 *     description: |
 *       Reinicia el `currentStreak` de un usuario a `0` y borra su `lastRegisteredAt`.
 *       El `maxStreak` no se ve afectado. Requiere rol ADMIN_MOODTRACKING_ROLE.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario cuya racha se desea resetear
 *         example: "user_abc123"
 *     responses:
 *       200:
 *         description: Racha reseteada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Racha de user_abc123 reseteada"
 *                 data:
 *                   $ref: '#/components/schemas/Streak'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: El usuario no tiene una racha registrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/streaks/:userId/reset', adminController.resetUserStreak);

/**
 * @swagger
 * /feelweell/v1/admin/profiles:
 *   get:
 *     summary: Listar todos los perfiles emocionales
 *     description: |
 *       Devuelve todos los perfiles emocionales generados a partir del cuestionario inicial,
 *       ordenados del más reciente al más antiguo por `completedAt`.
 *       Requiere rol ADMIN_MOODTRACKING_ROLE.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de perfiles emocionales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuestionnaireResponse'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profiles', adminController.getAllProfiles);

/**
 * @swagger
 * /feelweell/v1/admin/profiles/{userId}:
 *   delete:
 *     summary: Eliminar el perfil emocional de un usuario
 *     description: |
 *       Elimina permanentemente el cuestionario y perfil emocional de un usuario.
 *       Requiere rol ADMIN_MOODTRACKING_ROLE.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario cuyo perfil se desea eliminar
 *         example: "user_abc123"
 *     responses:
 *       200:
 *         description: Perfil eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Perfil de user_abc123 eliminado"
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Perfil no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Perfil no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/profiles/:userId', adminController.deleteUserProfile);

/**
 * @swagger
 * /feelweell/v1/admin/stats:
 *   get:
 *     summary: Obtener estadísticas generales del sistema
 *     description: |
 *       Devuelve un resumen estadístico del sistema que incluye:
 *       - Totales de registros, rachas y perfiles
 *       - Top 5 emociones más registradas en todo el sistema
 *       - Distribución de perfiles emocionales por tipo
 *
 *       Requiere rol ADMIN_MOODTRACKING_ROLE.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SystemStats'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', adminController.getSystemStats);

export default router;