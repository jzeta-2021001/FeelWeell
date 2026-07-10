import * as moodService from './mood.service.js';

export const registerMoodEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const username = req.user.username ?? null;
    const { emotion, intensity, note } = req.body;
    const entry = await moodService.registerMoodEntry(userId, username, { emotion, intensity, note });
    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    if (err.message.includes('Ya se ha registrado')) {
      return res.status(409).json({ success: false, message: err.message });
    }
    console.error('[registerMoodEntry]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getTodayMood = async (req, res) => {
  try {
    const userId = req.user.id;
    const entry = await moodService.getTodayEntry(userId);
    return res.status(200).json({ success: true, registered: !!entry, data: entry ?? null });
  } catch (err) {
    console.error('[getTodayMood]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getMoodHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to } = req.query;
    const entries = await moodService.getMoodHistory(userId, { from, to });
    return res.status(200).json({ success: true, total: entries.length, data: entries });
  } catch (err) {
    console.error('[getMoodHistory]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getInitialQuestionnaire = async (req, res) => {
  try {
    const questions = await moodService.getInitialQuestionnaire();
    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    console.error('[getInitialQuestionnaire]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const submitQuestionnaire = async (req, res) => {
  try {
    const { id: userId, username } = req.user;
    const { answers } = req.body;
    const result = await moodService.submitQuestionnaire(userId, username, answers);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('[submitQuestionnaire]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await moodService.getUserProfile(userId);
    return res.status(200).json({ success: true, data: profile });
  } catch (err) {
    console.error('[getUserProfile]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const publishMoodEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventType } = req.body;
    const result = await moodService.publishMoodEvents(userId, eventType);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err.message.includes('Evento inválido')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    console.error('[publishMoodEvents]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};