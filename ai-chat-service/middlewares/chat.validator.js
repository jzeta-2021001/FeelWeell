'use strict';

import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

export const validateChatMessage = [
    body('mensaje')
        .notEmpty().withMessage('El mensaje es requerido')
        .isString().withMessage('El mensaje debe ser texto')
        .isLength({ min: 1, max: 2000 }).withMessage('El mensaje debe tener entre 1 y 2000 caracteres')
        .trim(),
    handleValidationErrors
];