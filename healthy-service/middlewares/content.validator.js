import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

const CONTENT_TYPES = ['VIDEO', 'ARTÍCULO', 'RECURSO'];
const CONTENT_CATEGORIES = ['ESTRÉS', 'DEPRESIÓN', 'DESARROLLO PERSONAL', 'ANSIEDAD', 'BIENESTAR GENERAL'];

export const validateCreateContent = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3, max: 150 })
        .withMessage('El título debe tener entre 3 y 150 caracteres'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .isLength({ min: 10, max: 600 })
        .withMessage('La descripción debe tener entre 10 y 600 caracteres'),
    body('type')
        .notEmpty()
        .withMessage('El tipo de contenido es obligatorio')
        .toUpperCase()
        .isIn(CONTENT_TYPES)
        .withMessage(`El tipo debe ser uno de: ${CONTENT_TYPES.join(', ')}`),
    body('category')
        .notEmpty()
        .withMessage('La categoría es obligatoria')
        .toUpperCase()
        .isIn(CONTENT_CATEGORIES)
        .withMessage(`La categoría debe ser una de: ${CONTENT_CATEGORIES.join(', ')}`),
    body('url')
        .optional()
        .isURL()
        .withMessage('La URL no tiene un formato válido'),
    body('body')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('El cuerpo del artículo debe tener al menos 10 caracteres'),
    checkValidators
];

export const validateUpdateContent = [
    param('id')
        .isMongoId()
        .withMessage('ID de contenido no válido'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('El título debe tener entre 3 y 150 caracteres'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 600 })
        .withMessage('La descripción debe tener entre 10 y 600 caracteres'),
    body('type')
        .optional()
        .toUpperCase()
        .isIn(CONTENT_TYPES)
        .withMessage(`El tipo debe ser uno de: ${CONTENT_TYPES.join(', ')}`),
    body('category')
        .optional()
        .toUpperCase()
        .isIn(CONTENT_CATEGORIES)
        .withMessage(`La categoría debe ser una de: ${CONTENT_CATEGORIES.join(', ')}`),
    body('url')
        .optional()
        .isURL()
        .withMessage('La URL no tiene un formato válido'),
    checkValidators
];

export const validateContentId = [
    param('id')
        .isMongoId()
        .withMessage('ID de contenido no válido'),
    checkValidators
];

export const validateCategoryParam = [
    param('category')
        .notEmpty()
        .withMessage('La categoría es obligatoria')
        .toUpperCase()
        .isIn(CONTENT_CATEGORIES)
        .withMessage(`La categoría debe ser una de: ${CONTENT_CATEGORIES.join(', ')}`),
    checkValidators
];
