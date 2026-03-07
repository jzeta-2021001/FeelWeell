import * as streakService from './streak.service.js';

export const getCurrentStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await streakService.getCurrentStreak(userId);
    res.json(streak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await streakService.updateStreak(userId);
    res.json({ message: 'Racha actualizada', streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkStreakAtRisk = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await streakService.checkStreakAtRisk(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};