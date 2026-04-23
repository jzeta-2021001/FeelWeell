import * as moodService from './mood.service.js';

export const registerMoodEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { emotion, intensity, note } = req.body;

    if (!emotion || !intensity) {
      return res.status(400).json({
        success: false,
        message: 'emotion e intensity son requeridos'
      });
    }

    const entry = await moodService.registerMoodEntry(userId, { emotion, intensity, note });
    return res.status(201).json({ success: true, message: 'Estado registrado', data: entry });
  } catch (err) {
    console.error('[registerMoodEntry]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getTodayMoodEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const entry = await moodService.getTodayEntry(userId);
    return res.status(200).json({ success: true, registered: !!entry, data: entry });
  } catch (err) {
    console.error('[getTodayMoodEntry]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getMoodHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to } = req.query;
    const history = await moodService.getMoodHistory(userId, { from, to });
    return res.status(200).json({ success: true, total: history.length, data: history });
  } catch (err) {
    console.error('[getMoodHistory]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getInitialQuestionnaire = async (req, res) => {
  try {
    const questions = await moodService.getInitialQuestionnaire();
    if (!questions || questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No hay cuestionario configurado' });
    }
    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    console.error('[getInitialQuestionnaire]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const submitQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers debe ser un array' });
    }

    const result = await moodService.submitQuestionnaire(userId, answers);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('[submitQuestionnaire]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await moodService.getUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Perfil no encontrado' });
    }
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
    if (!eventType) {
      return res.status(400).json({ success: false, message: 'eventType es requerido' });
    }
    const result = await moodService.publishMoodEvents(userId, eventType);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('[publishMoodEvents]', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};