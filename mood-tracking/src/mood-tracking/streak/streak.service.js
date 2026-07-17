import Streak from './streak.model.js';
import MoodEntry from '../mood/moodEntry.model.js';


export const getCurrentStreak = async (userId) => {
    let streak = await Streak.findOne({ userId });

    if (!streak) {
        streak = await Streak.create({ userId, currentStreak: 0, maxStreak: 0 });
    }

    return {
        currentStreak: streak.currentStreak,
        maxStreak: streak.maxStreak,
        lastRegisteredAt: streak.lastRegisteredAt
    };
};

export const updateStreak = async (userId, username = null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMood = await MoodEntry.findOne({
        userId,
        date: { $gte: today, $lt: tomorrow }
    });

    if (!todayMood) {
        throw new Error('Debes registrar tu estado de ánimo de hoy para poder activar o actualizar tu racha');
    }

    let streak = await Streak.findOne({ userId });

    if (!streak) {
        streak = new Streak({ userId, username });
    }

    // Guardar username si aún no lo tenía
    if (username && !streak.username) {
        streak.username = username;
    }

    const now = new Date();
    const lastDate = streak.lastRegisteredAt;

    if (lastDate) {
        const diffHours = (now - lastDate) / (1000 * 60 * 60);

        if (diffHours < 24) {
            return streak;
        } else if (diffHours < 48) {
            streak.currentStreak += 1;
        } else {
            streak.currentStreak = 1;
        }
    } else {
        streak.currentStreak = 1;
    }

    if (streak.currentStreak > streak.maxStreak) {
        streak.maxStreak = streak.currentStreak;
    }

    streak.lastRegisteredAt = now;
    await streak.save();

    return streak;
};

export const checkStreakAtRisk = async (userId) => {
    const streak = await Streak.findOne({ userId });

    if (!streak || !streak.lastRegisteredAt) {
        return { atRisk: false, hoursWithoutRegister: 0 };
    }

    const diffHours = (new Date() - streak.lastRegisteredAt) / (1000 * 60 * 60);

    return {
        atRisk: diffHours > 20,
        hoursWithoutRegister: Math.floor(diffHours)
    };
};