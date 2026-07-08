import { Router } from 'express';
import { getDailyChallenge } from './dailyChallenge.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Endpoint: GET /daily-challenge
router.get('/', validateJWT, getDailyChallenge);

export default router;