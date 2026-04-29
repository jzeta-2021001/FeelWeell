import { Router } from 'express';
import * as streakController from './streak.controller.js';
import validateJWT from '../../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Streak
 *   description: Gestión de rachas diarias de registro de estado de ánimo
 */

router.use(validateJWT);

/**
 * @swagger
 * /feelweell/v1/streak:
 *   get:
 *     summary: Obtener la racha actual del usuario
 *     description: |
 *       Devuelve la racha actual del usuario autenticado.
 *       Si el usuario aún no tiene una racha registrada, se crea automáticamente con valores en 0.
 *     tags: [Streak]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Racha del usuario obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StreakSummary'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.get('/streak', streakController.getCurrentStreak);

/**
 * @swagger
 * /feelweell/v1/streak:
 *   put:
 *     summary: Actualizar la racha del usuario
 *     description: |
 *       Recalcula y actualiza la racha del usuario autenticado según la lógica de días consecutivos:
 *       - Si el último registro fue hace **menos de 24 horas**: no se modifica la racha.
 *       - Si el último registro fue hace **entre 24 y 48 horas**: la racha incrementa en 1.
 *       - Si el último registro fue hace **más de 48 horas**: la racha se reinicia a 1.
 *       - Si `currentStreak` supera a `maxStreak`, este último se actualiza automáticamente.
 *
 *       Este endpoint es llamado automáticamente al registrar un estado de ánimo (`POST /mood`).
 *     tags: [Streak]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Racha actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Racha actualizada"
 *                 streak:
 *                   $ref: '#/components/schemas/Streak'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.put('/streak', streakController.updateStreak);

/**
 * @swagger
 * /feelweell/v1/streak/at-risk:
 *   get:
 *     summary: Verificar si la racha está en riesgo
 *     description: |
 *       Comprueba si el usuario lleva más de 20 horas sin registrar su estado de ánimo,
 *       lo que indica que su racha está en riesgo de perderse.
 *       Si el usuario no tiene racha, devuelve `atRisk: false`.
 *     tags: [Streak]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de riesgo de la racha consultado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StreakAtRisk'
 *             examples:
 *               enRiesgo:
 *                 summary: La racha está en riesgo
 *                 value:
 *                   atRisk: true
 *                   hoursWithoutRegister: 22
 *               sinRiesgo:
 *                 summary: La racha está bien
 *                 value:
 *                   atRisk: false
 *                   hoursWithoutRegister: 5
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.get('/streak/at-risk', streakController.checkStreakAtRisk);

export default router;