import { Router } from 'express';
import { createExercise, updateExercise, deleteExercise, listExercises, getExerciseById, markExerciseCompleted, saveExerciseForLater, getUserProgress, uploadExercisePhoto, deleteExercisePhoto, getRecommendedExercises } from './exercise.controller.js';
import { validateCreateExercise, validateUpdateExercise, validateExerciseId, validateExerciseIdParam, validateListExercisesQuery } from '../../middlewares/exercise.validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { uploadExercisePhoto as uploadExercisePhotoMiddleware } from '../../middlewares/file-uploader.js';

const router = Router();

/**
 * @swagger
 * /healthyService/v1/exercises:
 *   get:
 *     tags: [Exercises]
 *     summary: Listar ejercicios
 *     description: Obtiene una lista de ejercicios con filtros opcionales.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: type
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [RESPIRACIÓN, MEDITACIÓN, YOGA, RELAJACIÓN, MINDFULNESS, ESTIRAMIENTO]
 *         example: RESPIRACIÓN
 *     responses:
 *       200:
 *         description: Lista de ejercicios obtenida correctamente
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
 *                   example: Ejercicios obtenidos exitosamente
 *                 total:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 *       500:
 *         description: Error al obtener los ejercicios
 */
router.get('/', validateJWT, validateListExercisesQuery, listExercises);

/**
 * @swagger
 * /healthyService/v1/exercises/recommended:
 *   get:
 *     tags: [Exercises]
 *     summary: Obtener ejercicios recomendados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ejercicios recomendados obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 emotionalProfile:
 *                   type: string
 *                   example: ANSIOSO
 *                 total:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 *       401:
 *         description: Token requerido
 *       500:
 *         description: Error al obtener recomendaciones
 */
router.get("/recommended", validateJWT, getRecommendedExercises);

/**
 * @swagger
 * /healthyService/v1/exercises/user/progress:
 *   get:
 *     tags: [Exercises]
 *     summary: Obtener progreso del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progreso obtenido correctamente
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
 *                   example: Progreso del usuario obtenido exitosamente
 *                 data:
 *                   type: object
 *       500:
 *         description: Error al obtener el progreso
 */
router.get('/user/progress', validateJWT, validateRole('USER_ROLE'), getUserProgress);

/**
 * @swagger
 * /healthyService/v1/exercises/{id}:
 *   get:
 *     tags: [Exercises]
 *     summary: Obtener ejercicio por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Ejercicio obtenido correctamente
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
 *                   example: Ejercicio obtenido exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error al obtener el ejercicio
 */
router.get('/:id', validateJWT, validateExerciseId, getExerciseById);

/**
 * @swagger
 * /healthyService/v1/exercises:
 *   post:
 *     tags: [Exercises]
 *     summary: Crear ejercicio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               targetProfile:
 *                 type: string
 *               type:
 *                 type: string
 *               duration:
 *                 type: number
 *               instructions:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Ejercicio creado correctamente
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
 *                   example: Ejercicio creado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear el ejercicio
 */
router.post('/', validateJWT, validateRole('ADMIN_HEALTHY_ROLE'), uploadExercisePhotoMiddleware.single('photo'), validateCreateExercise, createExercise);

/**
 * @swagger
 * /healthyService/v1/exercises/{id}:
 *   put:
 *     tags: [Exercises]
 *     summary: Actualizar ejercicio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Ejercicio actualizado correctamente
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
 *                   example: Ejercicio actualizado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', validateJWT, validateRole('ADMIN_HEALTHY_ROLE'), validateUpdateExercise, updateExercise);

/**
 * @swagger
 * /healthyService/v1/exercises/{id}:
 *   delete:
 *     tags: [Exercises]
 *     summary: Eliminar ejercicio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Ejercicio eliminado correctamente
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
 *                   example: Ejercicio eliminado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', validateJWT, validateRole('ADMIN_HEALTHY_ROLE'), validateExerciseId, deleteExercise);

/**
 * @swagger
 * /healthyService/v1/exercises/{id}/photo:
 *   post:
 *     tags: [Exercises]
 *     summary: Subir o reemplazar foto de ejercicio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Foto subida correctamente
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
 *                   example: "Foto actualizada correctamente"
 *       400:
 *         description: No se proporcionó ninguna imagen
 *       500:
 *         description: Error al subir la foto
 */
router.post('/:id/photo', validateJWT, validateRole('ADMIN_HEALTHY_ROLE'), uploadExercisePhotoMiddleware.single('photo'), uploadExercisePhoto);

/**
 * @swagger
 * /healthyService/v1/exercises/{id}/photo:
 *   delete:
 *     tags: [Exercises]
 *     summary: Eliminar foto del ejercicio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Foto eliminada correctamente
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
 *                   example: "Foto eliminada correctamente"
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error al eliminar la foto
 */
router.delete('/:id/photo', validateJWT, validateRole('ADMIN_HEALTHY_ROLE'), deleteExercisePhoto);

/**
 * @swagger
 * /healthyService/v1/exercises/{exerciseId}/complete:
 *   post:
 *     tags: [Exercises]
 *     summary: Marcar ejercicio como completado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: exerciseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Ejercicio marcado como completado
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
 *                   example: "Ejercicio completado correctamente"
 *                 data:
 *                   type: object
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error al completar
 */
router.post('/:exerciseId/complete', validateJWT, validateRole('USER_ROLE'), validateExerciseIdParam, markExerciseCompleted);

/**
 * @swagger
 * /healthyService/v1/exercises/{exerciseId}/save:
 *   post:
 *     tags: [Exercises]
 *     summary: Guardar ejercicio para después
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: exerciseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Ejercicio guardado correctamente
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
 *                   example: "Ejercicio guardado correctamente"
 *                 data:
 *                   type: object
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error al guardar
 */
router.post('/:exerciseId/save', validateJWT, validateRole('USER_ROLE'), validateExerciseIdParam, saveExerciseForLater);

export default router;