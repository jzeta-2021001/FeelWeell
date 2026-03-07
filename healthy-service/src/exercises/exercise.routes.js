import { Router } from 'express';
import { createExercise, updateExercise, deleteExercise, listExercises, getExerciseById, markExerciseCompleted, saveExerciseForLater, getUserProgress, uploadExercisePhoto, deleteExercisePhoto, getRecommendedExercises } from './exercise.controller.js';
import { validateCreateExercise, validateUpdateExercise, validateExerciseId, validateExerciseIdParam, validateListExercisesQuery } from '../../middlewares/exercise.validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { uploadExercisePhoto as uploadExercisePhotoMiddleware } from '../../middlewares/file-uploader.js';



const router = Router();

//Rutas de autenticación (Admin y Usuario)
router.get(
    '/',
    validateJWT,
    validateListExercisesQuery,
    listExercises
);

router.get(
    "/recommended",
    validateJWT,
    getRecommendedExercises
);

router.get(
    '/user/progress',
    validateJWT,
    validateRole('USER_ROLE'),
    getUserProgress
);

router.get(
    '/:id',
    validateJWT,
    validateExerciseId,
    getExerciseById
);

//Solo para Admin
router.post(
    '/',
    validateJWT,
    validateRole('ADMIN_ROLE'),
    uploadExercisePhotoMiddleware.single('photo'),
    validateCreateExercise,
    createExercise
);

router.put(
    '/:id',
    validateJWT,
    validateRole('ADMIN_ROLE'),
    validateUpdateExercise,
    updateExercise
);

router.delete(
    '/:id',
    validateJWT,
    validateRole('ADMIN_ROLE'),
    validateExerciseId,
    deleteExercise
);

//Subir o reemplazar foto de un Ejercicio ya existente
router.post(
    '/:id/photo',
    validateJWT,
    validateRole('ADMIN_ROLE'),
    uploadExercisePhotoMiddleware.single('photo'),
    uploadExercisePhoto
);

//Eliminar foto del ejercicio
router.delete(
    '/:id/photo',
    validateJWT,
    validateRole('ADMIN_ROLE'),
    deleteExercisePhoto
);

//Solo para Usuario
router.post(
    '/:exerciseId/complete',
    validateJWT,
    validateRole('USER_ROLE'),
    validateExerciseIdParam,
    markExerciseCompleted
);

router.post(
    '/:exerciseId/save',
    validateJWT,
    validateRole('USER_ROLE'),
    validateExerciseIdParam,
    saveExerciseForLater
);

export default router;