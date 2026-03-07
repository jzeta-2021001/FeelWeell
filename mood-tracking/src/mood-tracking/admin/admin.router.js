import { Router } from 'express';
import * as adminController from './admin.controller.js';
import validateJWT from '../../../middlewares/validate-JWT.js';
import { requireRole } from '../../../middlewares/validate-role.js';

const router = Router();

// Solo admin-MoodTracking puede acceder
router.use(validateJWT);
router.use(requireRole('admin-MoodTracking'));

// Mood entries
router.get('/mood-entries', adminController.getAllMoodEntries);
router.delete('/mood-entries/:id', adminController.deleteMoodEntry);

// Streaks
router.get('/streaks', adminController.getAllStreaks);
router.put('/streaks/:userId/reset', adminController.resetUserStreak);

// Profiles
router.get('/profiles', adminController.getAllProfiles);
router.delete('/profiles/:userId', adminController.deleteUserProfile);

// Stats
router.get('/stats', adminController.getSystemStats);

export default router;