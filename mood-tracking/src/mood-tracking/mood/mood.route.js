
import { Router } from 'express';
import * as moodController from './mood.controller.js';
import validateJWT from '../../../middlewares/validate-JWT.js';
import {
    validateMoodEntry,
    validateMoodHistory,
    validateQuestionnaire,
    validateMoodEvent
} from '../../../middlewares/mood-validator.js';

const router = Router();

router.use(validateJWT);

router.post('/mood', validateMoodEntry, moodController.registerMoodEntry);
router.get('/mood/today', moodController.getTodayMoodEntry);
router.get('/mood/history', validateMoodHistory, moodController.getMoodHistory);
router.get('/questionnaire', moodController.getInitialQuestionnaire);
router.post('/questionnaire', validateQuestionnaire, moodController.submitQuestionnaire);
router.get('/profile', moodController.getUserProfile);
router.post('/events/publish', validateMoodEvent, moodController.publishMoodEvents);

export default router;