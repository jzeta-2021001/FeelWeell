import { Router } from 'express';
import { createUser, activateAccount, login, updatePassword, forgotPassword, resetPasswordController } from './user.controller.js';
import { validateCreateUser, validateLogin, validateChangePassword, validateForgotPassword, validateResetPassword } from '../middlewares/user-validator.js'
import { validateJWT } from '../middlewares/validate-JWT.js';

const router = Router();

router.get('/activate/:token', activateAccount);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPasswordController);

router.post('/', validateCreateUser, createUser);

router.put('/change-password', validateJWT, validateChangePassword, updatePassword);

export default router;