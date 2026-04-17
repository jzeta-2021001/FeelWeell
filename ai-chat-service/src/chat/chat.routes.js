import{Router} from 'express';
import {chat} from './chat.controller.js';
import {validateJWT} from '../../middlewares/validate-JWT.js';
import {validateChatMessage} from '../../middlewares/chat.validator.js';
import {detectCrisis} from '../../middlewares/crisis-detector.js';

const router = Router();

router.post(
    '/',
    validateJWT,
    validateChatMessage,
    detectCrisis,
    chat
);

export default router;