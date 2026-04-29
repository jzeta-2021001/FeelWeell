import { Router } from 'express';
import { chat } from './chat.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateChatMessage } from '../../middlewares/chat.validator.js';
import { detectCrisis } from '../../middlewares/crisis-detector.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Conversación con Tiyú, el asistente de apoyo emocional impulsado por IA
 */

/**
 * @swagger
 * /feelWell/v1/chat:
 *   post:
 *     summary: Enviar un mensaje al asistente de IA
 *     description: |
 *       Permite al usuario autenticado enviar un mensaje a Tiyú, el asistente de apoyo emocional.
 *       El pipeline de procesamiento es el siguiente:
 *       1. **Validación JWT** — verifica que el token sea válido.
 *       2. **Validación del mensaje** — `mensaje` es requerido, debe ser texto y tener entre 1 y 2000 caracteres.
 *       3. **Detección de crisis** — analiza el mensaje en busca de palabras clave de riesgo
 *          (autolesión, suicidio, etc.). Si se detecta una crisis:
 *          - Se guarda una alerta en la base de datos (`CrisisAlert`).
 *          - Se retorna inmediatamente con `tipo: "EMERGENCIA"` y un mensaje de apoyo con recursos de ayuda.
 *          - La conversación con la IA no se procesa.
 *       4. **Respuesta de la IA** — si no hay crisis, el mensaje se envía al modelo `llama-3.1-8b-instant`
 *          via Groq. El historial de conversación del usuario se mantiene en MongoDB (máximo 50 mensajes,
 *          con TTL de 30 días).
 *
 *       El campo `tipo` en la respuesta indica el origen de la misma:
 *       - `RESPUESTA` → respuesta normal de la IA.
 *       - `EMERGENCIA` → mensaje de crisis detectado, respuesta de apoyo inmediata.
 *       - `BLOQUEADO` → contenido bloqueado por filtros de seguridad de la IA.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatInput'
 *           example:
 *             mensaje: "Me siento muy agobiado con el trabajo últimamente"
 *     responses:
 *       200:
 *         description: Respuesta del asistente generada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *             examples:
 *               respuestaNormal:
 *                 summary: Respuesta normal de la IA
 *                 value:
 *                   success: true
 *                   tipo: "RESPUESTA"
 *                   respuesta: "Entiendo que el trabajo puede ser muy pesado a veces. ¿Quieres contarme más sobre lo que está pasando?"
 *               respuestaCrisis:
 *                 summary: Mensaje de crisis detectado
 *                 value:
 *                   success: true
 *                   tipo: "EMERGENCIA"
 *                   respuesta: "Te escucho y me importas mucho. No tienes que pasar por esto solo/a. Por favor, contacta a una línea de ayuda ahora mismo: llama al 110 (Guatemala) o al número de crisis de tu país. 💙"
 *               respuestaBloqueada:
 *                 summary: Contenido bloqueado por filtros de seguridad
 *                 value:
 *                   success: true
 *                   tipo: "BLOQUEADO"
 *                   respuesta: "No puedo responder a eso, amigo/a. Pero estoy aquí para escucharte. ¿Cómo te sientes en este momento?"
 *       400:
 *         description: Error de validación en el mensaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               mensajeVacio:
 *                 summary: Mensaje vacío o no proporcionado
 *                 value:
 *                   success: false
 *                   errors:
 *                     - msg: "El mensaje es requerido"
 *                       path: "mensaje"
 *               mensajeLargo:
 *                 summary: Mensaje supera el límite de caracteres
 *                 value:
 *                   success: false
 *                   errors:
 *                     - msg: "El mensaje debe tener entre 1 y 2000 caracteres"
 *                       path: "mensaje"
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenFaltante:
 *                 summary: No se proporcionó token
 *                 value:
 *                   success: false
 *                   message: "No se proporcionó un token"
 *                   error: "MISSING_TOKEN"
 *               tokenExpirado:
 *                 summary: Token expirado
 *                 value:
 *                   success: false
 *                   message: "El token ha expirado"
 *                   error: "TOKEN_EXPIRED"
 *               tokenInvalido:
 *                 summary: Token inválido
 *                 value:
 *                   success: false
 *                   message: "Token inválido"
 *                   error: "INVALID_TOKEN"
 *       500:
 *         description: Error interno del servidor o fallo en la IA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error interno del servidor"
 */
router.post(
    '/',
    validateJWT,
    validateChatMessage,
    detectCrisis,
    chat
);

export default router;