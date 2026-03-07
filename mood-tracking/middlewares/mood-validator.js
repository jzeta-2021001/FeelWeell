import { body, query, param, validationResult } from 'express-validator';

// Middleware general que revisa errores
export const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }
    next();
};

// MOOD VALIDATORS


export const validateMoodEntry = [
    body('emotion')
        .notEmpty().withMessage('La emoción es obligatoria')
        .isString().withMessage('La emoción debe ser texto')
        .trim(),

    body('intensity')
        .notEmpty().withMessage('La intensidad es obligatoria')
        .isInt({ min: 1, max: 10 }).withMessage('La intensidad debe ser un número entre 1 y 10'),

    body('note')
        .optional()
        .isString().withMessage('La nota debe ser texto')
        .isLength({ max: 500 }).withMessage('La nota no puede superar 500 caracteres')
        .trim(),

    validateFields
];

export const validateMoodHistory = [
    query('from')
        .optional()
        .isISO8601().withMessage('La fecha "from" debe tener formato válido (YYYY-MM-DD)'),

    query('to')
        .optional()
        .isISO8601().withMessage('La fecha "to" debe tener formato válido (YYYY-MM-DD)'),

    validateFields
];

export const validateQuestionnaire = [
    body('answers')
        .notEmpty().withMessage('Las respuestas son obligatorias')
        .isArray({ min: 1 }).withMessage('answers debe ser un array con al menos una respuesta'),

    body('answers.*.questionId')
        .notEmpty().withMessage('Cada respuesta debe tener un questionId')
        .isInt({ min: 1 }).withMessage('El questionId debe ser un número positivo'),

    body('answers.*.answer')
        .notEmpty().withMessage('Cada respuesta debe tener un valor')
        .isInt({ min: 1, max: 5 }).withMessage('Cada respuesta debe ser un número entre 1 y 5'),

    validateFields
];

export const validateMoodEvent = [
    body('eventType')
        .notEmpty().withMessage('El eventType es obligatorio')
        .isIn(['mood.streak_at_risk', 'mood.not_registered'])
        .withMessage('eventType inválido. Usa: mood.streak_at_risk o mood.not_registered'),

    validateFields
];


// STREAK VALIDATORS

export const validateUserId = [
    param('userId')
        .notEmpty().withMessage('El userId es obligatorio')
        .isString().withMessage('El userId debe ser texto')
        .trim(),

    validateFields
];