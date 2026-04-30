import { Router } from 'express';
import {
    log,
    getPreferences,
    putPreferences,
    toggleType,
    getMyNotifications,
    markNotificationAsRead,
    scheduleMoodReminderHandler,
    scheduleExerciseReminderHandler,
    scheduleStreakAlertHandler
} from './notification.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestión de notificaciones y preferencias del usuario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "664a1f2e8b3c4d0012345678"
 *         userId:
 *           type: string
 *           example: "663f0a1b2c3d4e0011223344"
 *         title:
 *           type: string
 *           example: "¿Cómo te sientes hoy?"
 *         message:
 *           type: string
 *           example: "Aún no has registrado tu estado de ánimo."
 *         type:
 *           type: string
 *           enum: [MOOD_REMINDER, EXERCISE_REMINDER, STREAK_ALERT]
 *           example: "MOOD_REMINDER"
 *         severity:
 *           type: string
 *           enum: [INFO, ADVERTENCIA]
 *           example: "INFO"
 *         read:
 *           type: boolean
 *           example: false
 *         metadata:
 *           type: object
 *           example: { "triggeredAt": "2024-05-20T08:00:00.000Z" }
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T08:00:00.000Z"
 *     NotificationPreferences:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "663f0a1b2c3d4e0011223344"
 *         reminderTime:
 *           type: string
 *           example: "08:00"
 *         fcmToken:
 *           type: string
 *           example: "dGhpcyBpcyBhIHRva2Vu..."
 *         pushEnabled:
 *           type: boolean
 *           example: true
 *         activeTypes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["MOOD_REMINDER", "EXERCISE_REMINDER", "STREAK_ALERT"]
 *     SkippedResponse:
 *       type: object
 *       properties:
 *         skipped:
 *           type: boolean
 *           example: true
 *         reason:
 *           type: string
 *           example: "Notificación ya enviada en las últimas 24 horas"
 *         existing:
 *           $ref: '#/components/schemas/Notification'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error interno del servidor"
 */

// ─── Log ──────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /healthyService/v1/notifications/log:
 *   post:
 *     summary: Registrar una notificación
 *     description: >
 *       Crea una nueva notificación para un usuario. Incluye validación anti-spam:
 *       si ya existe una notificación del mismo tipo para el mismo usuario en las
 *       últimas 24 horas, no se crea una nueva y se retorna `skipped: true`.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, title, message, type]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "663f0a1b2c3d4e0011223344"
 *               title:
 *                 type: string
 *                 example: "¿Cómo te sientes hoy?"
 *               message:
 *                 type: string
 *                 example: "Aún no has registrado tu estado de ánimo."
 *               type:
 *                 type: string
 *                 enum: [MOOD_REMINDER, EXERCISE_REMINDER, STREAK_ALERT]
 *                 example: "MOOD_REMINDER"
 *               severity:
 *                 type: string
 *                 enum: [INFO, ADVERTENCIA]
 *                 default: INFO
 *               metadata:
 *                 type: object
 *                 example: {}
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     skipped:
 *                       type: boolean
 *                       example: false
 *                     notification:
 *                       $ref: '#/components/schemas/Notification'
 *       200:
 *         description: Notificación omitida (ya existe una igual en las últimas 24 h)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SkippedResponse'
 *       400:
 *         description: Faltan campos requeridos (userId, title, message o type)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "userId, title, message y type son requeridos"
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
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/log', validateJWT, log);

// ─── Preferencias ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /healthyService/v1/notifications/preferences:
 *   get:
 *     summary: Obtener preferencias de notificación
 *     description: >
 *       Retorna la configuración de notificaciones del usuario autenticado.
 *       Si no existen preferencias previas, se crean automáticamente con valores por defecto.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferencias del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/NotificationPreferences'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Preferencias no encontradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Preferencias no encontradas"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/preferences', validateJWT, getPreferences);

/**
 * @swagger
 * /healthyService/v1/notifications/preferences:
 *   put:
 *     summary: Actualizar preferencias de notificación
 *     description: >
 *       Actualiza la configuración de notificaciones del usuario autenticado.
 *       Solo se permiten modificar los campos `reminderTime`, `fcmToken` y `pushEnabled`.
 *       Los demás campos del body serán ignorados.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reminderTime:
 *                 type: string
 *                 example: "08:00"
 *               fcmToken:
 *                 type: string
 *                 example: "dGhpcyBpcyBhIHRva2Vu..."
 *               pushEnabled:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Preferencias actualizadas correctamente
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
 *                   example: "Preferencias actualizadas correctamente"
 *                 data:
 *                   $ref: '#/components/schemas/NotificationPreferences'
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
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/preferences', validateJWT, putPreferences);

/**
 * @swagger
 * /healthyService/v1/notifications/preferences/toggle:
 *   patch:
 *     summary: Activar o desactivar un tipo de notificación
 *     description: >
 *       Agrega o elimina un tipo específico de la lista `activeTypes` del usuario.
 *       Si `active` es `true` y el tipo no existe, se agrega. Si es `false`, se elimina.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, active]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [MOOD_REMINDER, EXERCISE_REMINDER, STREAK_ALERT]
 *                 example: "MOOD_REMINDER"
 *               active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Tipo de notificación actualizado correctamente
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
 *                   example: "Tipo MOOD_REMINDER desactivado correctamente"
 *                 data:
 *                   $ref: '#/components/schemas/NotificationPreferences'
 *       400:
 *         description: Faltan los campos "type" o "active"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Se requieren los campos \"type\" y \"active\""
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
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/preferences/toggle', validateJWT, toggleType);

// ─── Notificaciones del usuario ───────────────────────────────────────────────

/**
 * @swagger
 * /healthyService/v1/notifications/my:
 *   get:
 *     summary: Obtener las notificaciones del usuario autenticado
 *     description: >
 *       Retorna todas las notificaciones del usuario autenticado,
 *       ordenadas de más reciente a más antigua.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario
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
 *                   example: 5
 *                 unread:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/my', validateJWT, getMyNotifications);

/**
 * @swagger
 * /healthyService/v1/notifications/{id}/read:
 *   patch:
 *     summary: Marcar una notificación como leída
 *     description: >
 *       Marca una notificación específica como leída (`read: true`).
 *       Valida que la notificación pertenezca al usuario autenticado antes de actualizarla.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación (MongoDB ObjectId)
 *         example: "664a1f2e8b3c4d0012345678"
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
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
 *                   example: "Notificación marcada como leída"
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notificación no encontrada o no pertenece al usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Notificación no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/read', validateJWT, markNotificationAsRead);

// ─── Schedules ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /healthyService/v1/notifications/schedule/mood-reminder:
 *   post:
 *     summary: Programar recordatorio de estado de ánimo
 *     description: >
 *       Envía una notificación de tipo `MOOD_REMINDER` al usuario autenticado,
 *       recordándole registrar su estado emocional del día.
 *       Se omite si el tipo está desactivado en sus preferencias o si ya recibió
 *       una notificación del mismo tipo en las últimas 24 horas.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificación enviada u omitida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/SkippedResponse'
 *                     - type: object
 *                       properties:
 *                         skipped:
 *                           type: boolean
 *                           example: false
 *                         notification:
 *                           $ref: '#/components/schemas/Notification'
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
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/schedule/mood-reminder', validateJWT, scheduleMoodReminderHandler);

/**
 * @swagger
 * /healthyService/v1/notifications/schedule/exercise-reminder:
 *   post:
 *     summary: Programar recordatorio de ejercicio pendiente
 *     description: >
 *       Envía una notificación de tipo `EXERCISE_REMINDER` si el usuario tiene
 *       un ejercicio guardado para después y aún no lo ha completado.
 *       Se omite si el ejercicio ya fue completado, no está guardado,
 *       o si el tipo está desactivado en las preferencias del usuario.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exerciseId, exerciseTitle]
 *             properties:
 *               exerciseId:
 *                 type: string
 *                 example: "665b2c3d4e5f6a0023456789"
 *               exerciseTitle:
 *                 type: string
 *                 example: "Respiración diafragmática"
 *     responses:
 *       200:
 *         description: Notificación enviada u omitida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/SkippedResponse'
 *                     - type: object
 *                       properties:
 *                         skipped:
 *                           type: boolean
 *                           example: false
 *                         notification:
 *                           $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Faltan los campos exerciseId o exerciseTitle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "exerciseId y exerciseTitle son requeridos"
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
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/schedule/exercise-reminder', validateJWT, scheduleExerciseReminderHandler);

/**
 * @swagger
 * /healthyService/v1/notifications/schedule/streak-alert:
 *   post:
 *     summary: Programar alerta de racha en riesgo
 *     description: >
 *       Envía una notificación de tipo `STREAK_ALERT` advirtiendo al usuario
 *       que su racha de actividad está en peligro.
 *       Se omite si el tipo está desactivado en sus preferencias o si ya recibió
 *       una notificación del mismo tipo en las últimas 24 horas.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentStreak, lastActivityDate]
 *             properties:
 *               currentStreak:
 *                 type: number
 *                 example: 7
 *               lastActivityDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-05-19T20:00:00.000Z"
 *     responses:
 *       200:
 *         description: Notificación enviada u omitida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/SkippedResponse'
 *                     - type: object
 *                       properties:
 *                         skipped:
 *                           type: boolean
 *                           example: false
 *                         notification:
 *                           $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Faltan los campos currentStreak o lastActivityDate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "currentStreak y lastActivityDate son requeridos"
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
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/schedule/streak-alert', validateJWT, scheduleStreakAlertHandler);

export default router;