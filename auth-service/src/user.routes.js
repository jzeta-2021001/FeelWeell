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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y gestión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "664a1f2e8b3c4d0012345678"
 *         firstName:
 *           type: string
 *           example: "Juan"
 *         surname:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           example: "juan@email.com"
 *         phone:
 *           type: string
 *           example: "42459699"
 *         username:
 *           type: string
 *           example: "juan123"
 *         role:
 *           type: string
 *           example: "USER_ROLE"
 *         isActive:
 *           type: boolean
 *           example: true
 *     UserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - surname
 *         - email
 *         - phone
 *         - username
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Juan"
 *         surname:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           example: "juan@email.com"
 *         phone:
 *           type: string
 *           example: "42459699"
 *         username:
 *           type: string
 *           example: "juan123"
 *         password:
 *           type: string
 *           example: "Password123!"
 *     LoginInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "juan123"
 *         password:
 *           type: string
 *           example: "Password123!"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Descripción del error"
 */

/**
 * @swagger
 * /feelWell/v1/auth/activate/{token}:
 *   get:
 *     summary: Activar cuenta de usuario
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuenta activada correctamente
 *       400:
 *         description: Token inválido o expirado
 */
router.get('/activate/:token', activateAccount);

/**
 * @swagger
 * /feelWell/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /feelWell/v1/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Correo enviado
 */
router.post('/forgot-password', validateForgotPassword, forgotPassword);

/**
 * @swagger
 * /feelWell/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Restablecer contraseña
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */
router.post('/reset-password/:token', validateResetPassword, resetPasswordController);

/**
 * @swagger
 * /feelWell/v1/auth:
 *   post:
 *     summary: Registrar usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/', validateCreateUser, createUser);

/**
 * @swagger
 * /feelWell/v1/auth/admin:
 *   post:
 *     summary: Crear administrador
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Administrador creado
 */
router.post('/admin', validateJWT, validateRole('ADMIN_ROLE'), validateCreateUser, createAdmin);

/**
 * @swagger
 * /feelWell/v1/auth/admin/mood:
 *   post:
 *     summary: Crear administrador de MoodTracking
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Administrador creado
 */
router.post('/admin/mood', validateJWT, validateRole('ADMIN_ROLE'), validateCreateUser, createAdminMood);

/**
 * @swagger
 * /feelWell/v1/auth/admin/healthy:
 *   post:
 *     summary: Crear administrador de Healthy
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Administrador creado
 */
router.post('/admin/healthy', validateJWT, validateRole('ADMIN_ROLE'), validateCreateUser, createAdminHealthy);

/**
 * @swagger
 * /feelWell/v1/auth/change-password:
 *   put:
 *     summary: Cambiar contraseña del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */
router.put('/change-password', validateJWT, validateChangePassword, updatePassword);

export default router;