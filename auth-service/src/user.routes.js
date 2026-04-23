import { Router } from 'express';
import { 
    createUser, 
    createAdmin,
    createAdminMood,
    createAdminHealthy,
    activateAccount, 
    login, 
    updatePassword, 
    forgotPassword, 
    resetPasswordController 
} from './user.controller.js';
import { validateCreateUser, validateLogin, validateChangePassword, validateForgotPassword, validateResetPassword } from '../middlewares/user-validator.js'
import { validateJWT } from '../middlewares/validate-JWT.js';
import { validateRole } from '../middlewares/validate-role.js';

const router = Router();

router.get('/activate/:token', activateAccount);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPasswordController);

// Registro público — siempre crea USER_ROLE
router.post('/', validateCreateUser, createUser);

// Crear admins — solo ADMIN_ROLE puede crearlos
router.post('/admin', validateJWT, validateRole('ADMIN_ROLE'), validateCreateUser, createAdmin);
router.post('/admin/mood', validateJWT, validateRole('ADMIN_ROLE'), validateCreateUser, createAdminMood);
router.post('/admin/healthy', validateJWT, validateRole('ADMIN_ROLE'), validateCreateUser, createAdminHealthy);

router.put('/change-password', validateJWT, validateChangePassword, updatePassword);

export default router;