import * as moodService from './mood.service.js';

export const registerMoodEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { emotion, intensity, note } = req.body;

    if (!emotion || !intensity) {
      return res.status(400).json({ error: 'emotion e intensity son requeridos' });
    }

    const entry = await moodService.registerMoodEntry(userId, { emotion, intensity, note });
    res.status(201).json({ message: 'Estado registrado', entry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTodayMoodEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const entry = await moodService.getTodayEntry(userId);
    res.json({ registered: !!entry, entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMoodHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to } = req.query;
    const history = await moodService.getMoodHistory(userId, { from, to });
    res.json({ total: history.length, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInitialQuestionnaire = async (req, res) => {
  try {
    const questions = await moodService.getInitialQuestionnaire();
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers debe ser un array' });
    }

    const result = await moodService.submitQuestionnaire(userId, answers);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await moodService.getUserProfile(userId);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const publishMoodEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventType } = req.body;
    const result = await moodService.publishMoodEvents(userId, eventType);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};