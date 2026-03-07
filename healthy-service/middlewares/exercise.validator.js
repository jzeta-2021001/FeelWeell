import { body, param, query } from 'express-validator';
import { checkValidators } from './check-validators.js';

const EXERCISE_TYPES = ['RESPIRACIÓN', 'MEDITACIÓN', 'YOGA', 'RELAJACIÓN', 'MINDFULNESS', 'ESTIRAMIENTO'];
const PROFILE_TYPES = ['EQUILIBRADO', 'RESILIENTE', 'ANSIOSO', 'DEPRESIVO']

export const validateCreateExercise = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3, max: 100 })
        .withMessage('El título debe tener entre 3 y 100 caracteres'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .isLength({ min: 10, max: 500 })
        .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
    body('targetProfile')
        .notEmpty()
        .withMessage('El perfil emocional es obligatorio.')
        .toUpperCase()
        .isIn(PROFILE_TYPES)
        .withMessage(`Tipo no permitido, debe de ser: ${PROFILE_TYPES.join(', ')}`),
    body('type')
        .notEmpty()
        .withMessage('El tipo de ejercicio es obligatorio')
        .customSanitizer(value => value?.toUpperCase())
        .isIn(EXERCISE_TYPES)
        .withMessage(`El tipo debe ser uno de: ${EXERCISE_TYPES.join(', ')}`),
    body('duration')
        .notEmpty()
        .withMessage('La duración es obligatoria')
        .isInt({ min: 1 })
        .withMessage('La duración debe ser un número entero positivo (en minutos)'),
    body('instructions')
        .trim()
        .notEmpty()
        .withMessage('Las instrucciones son obligatorias'),
    checkValidators
];

export const validateUpdateExercise = [
    param('id')
        .isMongoId()
        .withMessage('ID de ejercicio no válido'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('El título debe tener entre 3 y 100 caracteres'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
    body('type')
        .optional()
        .customSanitizer(value => value?.toUpperCase())
        .isIn(EXERCISE_TYPES)
        .withMessage(`El tipo debe ser uno de: ${EXERCISE_TYPES.join(', ')}`),
    body('duration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La duración debe ser un número entero positivo (en minutos)'),
    checkValidators
];

export const validateExerciseId = [
    param('id')
        .isMongoId()
        .withMessage('ID de ejercicio no válido'),
    checkValidators
];

export const validateExerciseIdParam = [
    param('exerciseId')
        .isMongoId()
        .withMessage('ID de ejercicio no válido'),
    checkValidators
];

export const validateListExercisesQuery = [
    query('type')
        .optional()
        .isIn(EXERCISE_TYPES)
        .withMessage(`El tipo debe ser uno de: ${EXERCISE_TYPES.join(', ')}`),
    checkValidators
];
