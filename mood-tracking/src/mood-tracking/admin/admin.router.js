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

router.use(validateJWT);
router.use(validateRole('ADMIN_MOODTRACKING_ROLE'));

/**
 * @swagger
 * /feelweell/v1/admin/mood-entries:
 *   get:
 *     summary: Listar todos los registros de estado de ánimo
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de registros de estado de ánimo
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *       500:
 *         description: Error interno del servidor
 */
router.get('/mood-entries', adminController.getAllMoodEntries);

/**
 * @swagger
 * /feelweell/v1/admin/mood-entries/{id}:
 *   delete:
 *     summary: Eliminar un registro de estado de ánimo
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro eliminado exitosamente
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/mood-entries/:id', adminController.deleteMoodEntry);

/**
 * @swagger
 * /feelweell/v1/admin/streaks:
 *   get:
 *     summary: Listar todas las rachas del sistema
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de rachas del sistema
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *       500:
 *         description: Error interno del servidor
 */
router.get('/streaks', adminController.getAllStreaks);

/**
 * @swagger
 * /feelweell/v1/admin/streaks/{userId}/reset:
 *   put:
 *     summary: Resetear la racha de un usuario
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Racha reseteada exitosamente
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *       404:
 *         description: El usuario no tiene una racha registrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/streaks/:userId/reset', adminController.resetUserStreak);

/**
 * @swagger
 * /feelweell/v1/admin/profiles:
 *   get:
 *     summary: Listar todos los perfiles emocionales
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de perfiles emocionales
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *       500:
 *         description: Error interno del servidor
 */
router.get('/profiles', adminController.getAllProfiles);

/**
 * @swagger
 * /feelweell/v1/admin/profiles/{userId}/reset:
 *   put:
 *     summary: Resetear el perfil emocional de un usuario
 *     description: |
 *       Resetea el cuestionario y perfil emocional de un usuario a SIN_PERFIL,
 *       permitiéndole volver a completar el cuestionario.
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
 *     responses:
 *       200:
 *         description: Perfil reseteado exitosamente
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *       404:
 *         description: Perfil no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/profiles/:userId/reset', adminController.resetUserProfile);

/**
 * @swagger
 * /feelweell/v1/admin/stats:
 *   get:
 *     summary: Obtener estadísticas generales del sistema
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *       403:
 *         description: El usuario no tiene el rol ADMIN_MOODTRACKING_ROLE
 *       500:
 *         description: Error interno del servidor
 */
router.get('/stats', adminController.getSystemStats);

export default router;