
import MoodEntry from './moodEntry.model.js';
import QuestionnaireResponse from '../questionnaireResponse.model.js';
import { updateStreak } from '../streak/streak.service.js';

export const registerMoodEntry = async (userId, {emotion, intensity, note}) => {
    const existing = await getTodayEntry(userId);
    if (existing) throw new Error('Ya se ha registrado el estado de ánimo para hoy');

    const entry = await MoodEntry.create({
        userId,
        emotion,
        intensity,
        note: note || '',
        date: new Date(),
    });

    await updateStreak(userId);
    return entry;
};

export const getTodayEntry = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return MoodEntry.findOne({
        userId,
        date: { $gte: today, $lt: tomorrow }
    });
};

export const getMoodHistory = async (userId, {from, to}) => {
    const filter = { userId };
    
    if(from || to){
        filter.date = {};
        if(from) filter.date.$gte = new Date(from);
        if(to) filter.date.$lte = new Date(to);
    }

    return MoodEntry.find(filter).sort({ date: -1 });
};

export const getInitialQuestionnaire = async () => {
  return [
    {
      questionId: 1,
      text: '¿Con qué frecuencia te sientes abrumado/a?',
      options: [
        { value: 1, label: 'Nunca' },
        { value: 2, label: 'Rara vez' },
        { value: 3, label: 'A veces' },
        { value: 4, label: 'Frecuentemente' },
        { value: 5, label: 'Siempre' }
      ]
    },
    {
      questionId: 2,
      text: '¿Cómo calificarías tu nivel de energía general?',
      options: [
        { value: 1, label: 'Muy bajo' },
        { value: 2, label: 'Bajo' },
        { value: 3, label: 'Moderado' },
        { value: 4, label: 'Alto' },
        { value: 5, label: 'Muy alto' }
      ]
    },
    {
      questionId: 3,
      text: '¿Con qué frecuencia experimentas tristeza o desesperanza?',
      options: [
        { value: 1, label: 'Nunca' },
        { value: 2, label: 'Rara vez' },
        { value: 3, label: 'A veces' },
        { value: 4, label: 'Frecuentemente' },
        { value: 5, label: 'Siempre' }
      ]
    }
  ];
};

export const submitQuestionnaire = async (userId, answers) => {
  const avgScore = answers.reduce((sum, a) => sum + a.answer, 0) / answers.length;

  let emotionalProfile;
  if (avgScore <= 2) emotionalProfile = 'ALEGRE';
  else if (avgScore <= 3) emotionalProfile = 'NEUTRAL';
  else if (avgScore <= 4) emotionalProfile = 'PROBLEMA_DE_ANSIEDAD';
  else emotionalProfile = 'PROBLEMA_DE_TRISTEZA';

  const response = await QuestionnaireResponse.findOneAndUpdate(
    { userId },
    { userId, answers, emotionalProfile, completedAt: new Date() },
    { upsert: true, new: true }
  );

  return { emotionalProfile, response };
};

export const getUserProfile = async (userId) => {
  const profile = await QuestionnaireResponse.findOne({ userId });

  if (!profile) {
    return { userId, emotionalProfile: 'SIN_PERFIL', completedQuestionnaire: false };
  }

  return {
    userId,
    emotionalProfile: profile.emotionalProfile,
    completedQuestionnaire: true,
    completedAt: profile.completedAt
  };
};

export const publishMoodEvents = async (userId, eventType) => {
  const validEvents = ['mood.streak_at_risk', 'mood.not_registered'];

  if (!validEvents.includes(eventType)) {
    throw new Error(`Evento inválido. Usa: ${validEvents.join(', ')}`);
  }

  // RabbitMQ pendiente de integración
  throw new Error('RabbitMQ aún no está integrado. Pendiente de implementación.');
};