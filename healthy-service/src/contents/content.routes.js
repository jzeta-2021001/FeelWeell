import { Router } from 'express';
import { createContent, updateContent, deleteContent, listEducationalContent, getContentById, filterContentByCategory } from './content.controller.js';
import { validateCreateContent, validateUpdateContent, validateContentId, validateCategoryParam } from '../../middlewares/content.validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { uploadContentImage } from '../../middlewares/file-uploader.js';
import { cleanupUploadedFileOnFinish } from '../../middlewares/delete-file-on-error.js';

const router = Router();

/**
 * @swagger
 * /healthyService/v1/contents:
 *   get:
 *     tags: [Contents]
 *     summary: Listar contenido educativo
 *     description: Obtiene una lista de todo el contenido educativo disponible.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contenido obtenida correctamente
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
 *                   example: Contenido obtenido exitosamente
 *                 total:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       500:
 *         description: Error al obtener el contenido
 */
router.get(
    '/',
    validateJWT,
    listEducationalContent
);

/**
 * @swagger
 * /healthyService/v1/contents/category/{category}:
 *   get:
 *     tags: [Contents]
 *     summary: Filtrar contenido por categoría
 *     description: Obtiene el contenido educativo filtrado por una categoría específica.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ESTRÉS, DEPRESIÓN, DESARROLLO PERSONAL, ANSIEDAD, BIENESTAR GENERAL]
 *         example: ANSIEDAD
 *     responses:
 *       200:
 *         description: Contenido filtrado obtenido correctamente
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
 *                   example: Contenido obtenido exitosamente
 *                 total:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       400:
 *         description: Categoría inválida
 *       500:
 *         description: Error al filtrar el contenido
 */
router.get(
    '/category/:category',
    validateJWT,
    validateCategoryParam,
    filterContentByCategory
);

/**
 * @swagger
 * /healthyService/v1/contents/{id}:
 *   get:
 *     tags: [Contents]
 *     summary: Obtener contenido por ID
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
 *         description: Contenido obtenido correctamente
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
 *                   example: Contenido obtenido exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Contenido no encontrado
 *       500:
 *         description: Error al obtener el contenido
 */
router.get(
    '/:id',
    validateJWT,
    validateContentId,
    getContentById
);

/**
 * @swagger
 * /healthyService/v1/contents:
 *   post:
 *     tags: [Contents]
 *     summary: Crear contenido educativo
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
 *               type:
 *                 type: string
 *                 enum: [VIDEO, ARTÍCULO, RECURSO]
 *               category:
 *                 type: string
 *                 enum: [ESTRÉS, DEPRESIÓN, DESARROLLO PERSONAL, ANSIEDAD, BIENESTAR GENERAL]
 *               url:
 *                 type: string
 *               body:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Contenido creado correctamente
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
 *                   example: Contenido creado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear el contenido
 */
router.post(
    '/',
    validateJWT,
    validateRole('ADMIN_HEALTHY_ROLE'),
    uploadContentImage.single('photo'),
    validateCreateContent,
    cleanupUploadedFileOnFinish,
    createContent
);

/**
 * @swagger
 * /healthyService/v1/contents/{id}:
 *   put:
 *     tags: [Contents]
 *     summary: Actualizar contenido educativo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [VIDEO, ARTÍCULO, RECURSO]
 *               category:
 *                 type: string
 *                 enum: [ESTRÉS, DEPRESIÓN, DESARROLLO PERSONAL, ANSIEDAD, BIENESTAR GENERAL]
 *               url:
 *                 type: string
 *               body:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Contenido actualizado correctamente
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
 *                   example: Contenido actualizado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Contenido no encontrado
 *       500:
 *         description: Error al actualizar el contenido
 */
router.put(
    '/:id',
    validateJWT,
    validateRole('ADMIN_HEALTHY_ROLE'),
    uploadContentImage.single('photo'),
    validateUpdateContent,
    cleanupUploadedFileOnFinish,
    updateContent
);

/**
 * @swagger
 * /healthyService/v1/contents/{id}:
 *   delete:
 *     tags: [Contents]
 *     summary: Eliminar contenido educativo
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
 *         description: Contenido eliminado correctamente
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
 *                   example: Contenido eliminado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Contenido no encontrado
 *       500:
 *         description: Error al eliminar el contenido
 */
router.delete(
    '/:id',
    validateJWT,
    validateRole('ADMIN_HEALTHY_ROLE'),
    validateContentId,
    deleteContent
);

export default router;