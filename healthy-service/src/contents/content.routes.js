import { Router } from 'express';
import { createContent, updateContent, deleteContent, listEducationalContent, getContentById, filterContentByCategory } from './content.controller.js';
import { validateCreateContent, validateUpdateContent, validateContentId, validateCategoryParam } from '../../middlewares/content.validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import {uploadContentImage} from '../../middlewares/file-uploader.js';
import {cleanupUploadedFileOnFinish} from '../../middlewares/delete-file-on-error.js';

const router = Router();

//Rutas con autenticación (Admin y Usuario)
router.get(
    '/',
    validateJWT,
    listEducationalContent
);

router.get(
    '/category/:category',
    validateJWT,
    validateCategoryParam,
    filterContentByCategory
);

router.get(
    '/:id',
    validateJWT,
    validateContentId,
    getContentById
);

//Rutas solo para Admin
router.post(
    '/',
    validateJWT,
    validateRole('ADMIN_HEALTHY_ROLE'),
    uploadContentImage.single('photo'),
    validateCreateContent,
    cleanupUploadedFileOnFinish,
    createContent
);

router.put(
    '/:id',
    validateJWT,
    validateRole('ADMIN_HEALTHY_ROLE'),
    uploadContentImage.single('photo'),
    validateUpdateContent,
    cleanupUploadedFileOnFinish,
    updateContent
);

router.delete(
    '/:id',
    validateJWT,
    validateRole('ADMIN_HEALTHY_ROLE'),
    validateContentId,
    deleteContent
);

export default router;
