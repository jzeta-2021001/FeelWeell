import { Router } from 'express';
import * as moodController from './mood.controller.js';
import { validateJWT } from '../../../middlewares/validate-JWT.js';
import { validateRole } from '../../../middlewares/validate-role.js';
import {
    validateMoodEntry,
    validateMoodHistory,
    validateQuestionnaire,
    validateMoodEvent
} from '../../../middlewares/mood-validator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mood Tracking
 *   description: Registro diario de estado de ánimo, cuestionario inicial y perfil emocional del usuario
 */

router.use(validateJWT);
router.use(validateRole('USER_ROLE', 'ADMIN_ROLE', 'ADMIN_MOODTRACKING_ROLE'));

/**
 * @swagger
 * /feelweell/v1/moodTracking/mood:
 *   post:
 *     summary: Registrar estado de ánimo del día
 *     description: |
 *       Permite al usuario autenticado registrar su estado de ánimo para el día actual.
 *       - Solo se permite un registro por día. Si ya existe uno, se rechaza la solicitud.
 *       - Al registrar, se actualiza automáticamente la racha del usuario.
 *       - `emotion` debe ser uno de los valores del enum definido en el modelo.
 *       - `intensity` debe ser un número entre 1 y 10.
 *       - `note` es opcional (máximo 500 caracteres).
 *     tags: [Mood Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MoodEntryInput'
 *           example:
 *             emotion: "FELIZ"
 *             intensity: 8
 *             note: "Tuve un gran día en el trabajo"
 *     responses:
 *       201:
 *         description: Estado de ánimo registrado exitosamente
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
 *                   example: "Estado registrado"
 *                 data:
 *                   $ref: '#/components/schemas/MoodEntry'
 *       400:
 *         description: Error de validación o ya existe un registro para hoy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               yaRegistrado:
 *                 summary: Ya se registró el estado de ánimo hoy
 *                 value:
 *                   success: false
 *                   message: "Ya se ha registrado el estado de ánimo para hoy"
 *               camposRequeridos:
 *                 summary: Faltan campos obligatorios
 *                 value:
 *                   success: false
 *                   message: "emotion e intensity son requeridos"
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
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
router.post('/mood', validateMoodEntry, moodController.registerMoodEntry);

/**
 * @swagger
 * /feelweell/v1/moodTracking/mood/today:
 *   get:
 *     summary: Obtener el registro de estado de ánimo de hoy
 *     description: |
 *       Devuelve el registro de estado de ánimo del usuario para el día actual, si existe.
 *       El campo `registered` indica si ya hay un registro para hoy.
 *     tags: [Mood Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de ánimo de hoy consultado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 registered:
 *                   type: boolean
 *                   description: Indica si el usuario ya registró su estado de ánimo hoy
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/MoodEntry'
 *                     - type: "null"
 *                       description: null si no hay registro para hoy
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
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
router.get('/mood/today', moodController.getTodayMoodEntry);

/**
 * @swagger
 * /feelweell/v1/moodTracking/mood/history:
 *   get:
 *     summary: Obtener historial de estados de ánimo
 *     description: |
 *       Devuelve el historial de registros de estado de ánimo del usuario autenticado,
 *       ordenado del más reciente al más antiguo. Se pueden aplicar filtros opcionales de fecha.
 *     tags: [Mood Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango (formato YYYY-MM-DD)
 *         example: "2025-06-01"
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango (formato YYYY-MM-DD)
 *         example: "2025-06-30"
 *     responses:
 *       200:
 *         description: Historial de estados de ánimo del usuario
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
 *                   example: 12
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MoodEntry'
 *       400:
 *         description: Formato de fechas inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "La fecha \"from\" debe tener formato válido (YYYY-MM-DD)"
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
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
router.get('/mood/history', validateMoodHistory, moodController.getMoodHistory);

/**
 * @swagger
 * /feelweell/v1/moodTracking/questionnaire:
 *   get:
 *     summary: Obtener el cuestionario inicial
 *     description: |
 *       Devuelve la lista de preguntas del cuestionario inicial de evaluación emocional.
 *       Cada pregunta contiene opciones con valores del 1 al 5.
 *     tags: [Mood Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuestionario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuestionnaireQuestion'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No hay cuestionario configurado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "No hay cuestionario configurado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/questionnaire', moodController.getInitialQuestionnaire);

/**
 * @swagger
 * /feelweell/v1/moodTracking/questionnaire:
 *   post:
 *     summary: Enviar respuestas del cuestionario inicial
 *     description: |
 *       Permite al usuario enviar sus respuestas al cuestionario inicial.
 *       A partir del promedio de respuestas se calcula y asigna un perfil emocional:
 *       - `≤ 2` → `ALEGRE`
 *       - `≤ 3` → `NEUTRAL`
 *       - `≤ 4` → `PROBLEMA_DE_ANSIEDAD`
 *       - `> 4` → `PROBLEMA_DE_TRISTEZA`
 *
 *       Si el usuario ya tiene un perfil, este se actualiza (upsert).
 *     tags: [Mood Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionnaireInput'
 *           example:
 *             answers:
 *               - questionId: 1
 *                 answer: 3
 *               - questionId: 2
 *                 answer: 2
 *               - questionId: 3
 *                 answer: 4
 *     responses:
 *       201:
 *         description: Cuestionario enviado y perfil emocional generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/QuestionnaireResult'
 *       400:
 *         description: Error de validación en las respuestas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "answers debe ser un array"
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
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
router.post('/questionnaire', validateQuestionnaire, moodController.submitQuestionnaire);

/**
 * @swagger
 * /feelweell/v1/moodTracking/profile:
 *   get:
 *     summary: Obtener el perfil emocional del usuario
 *     description: |
 *       Devuelve el perfil emocional del usuario autenticado derivado del cuestionario inicial.
 *       Si el usuario aún no ha completado el cuestionario, retorna `completedQuestionnaire: false`
 *       con perfil `SIN_PERFIL` en lugar de un error 404.
 *     tags: [Mood Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil emocional del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
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
router.get('/profile', moodController.getUserProfile);

/**
 * @swagger
 * /feelweell/v1/moodTracking/events/publish:
 *   post:
 *     summary: Publicar un evento de mood a RabbitMQ
 *     description: |
 *       Publica un evento relacionado con el estado de ánimo del usuario en el broker RabbitMQ.
 *       Los eventos válidos son:
 *       - `mood.streak_at_risk`: La racha del usuario está en riesgo de perderse.
 *       - `mood.not_registered`: El usuario no ha registrado su estado de ánimo hoy.
 *     tags: [Mood Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventType
 *             properties:
 *               eventType:
 *                 type: string
 *                 enum: [mood.streak_at_risk, mood.not_registered]
 *                 description: Tipo de evento a publicar en el broker
 *                 example: "mood.streak_at_risk"
 *           example:
 *             eventType: "mood.streak_at_risk"
 *     responses:
 *       200:
 *         description: Evento publicado exitosamente
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
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     eventType:
 *                       type: string
 *                       example: "mood.streak_at_risk"
 *                     userId:
 *                       type: string
 *                       example: "user_abc123"
 *       400:
 *         description: eventType inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               eventTypeRequerido:
 *                 summary: Campo eventType faltante
 *                 value:
 *                   success: false
 *                   message: "eventType es requerido"
 *               eventoInvalido:
 *                 summary: Tipo de evento no reconocido
 *                 value:
 *                   success: false
 *                   message: "Evento inválido. Usa: mood.streak_at_risk, mood.not_registered"
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
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
router.post('/events/publish', validateMoodEvent, moodController.publishMoodEvents);

export default router;