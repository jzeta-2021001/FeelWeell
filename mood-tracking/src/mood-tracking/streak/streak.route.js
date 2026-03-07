import { Router } from 'express';
import * as streakController from './streak.controller.js';
import validateJWT from '../../../middlewares/validate-JWT.js';

const router = Router();

router.use(validateJWT);

router.get('/streak', streakController.getCurrentStreak);
router.put('/streak', streakController.updateStreak);
router.get('/streak/at-risk', streakController.checkStreakAtRisk);

export default router;