import Streak from './streak.model.js';


export const getCurrentStreak = async (userId) => {
    let streak = await Streak.findOne({ userId }); // ← let, no const

    if (!streak) {
        streak = await Streak.create({ userId, currentStreak: 0, maxStreak: 0 });
    }

    return {
        currentStreak: streak.currentStreak,
        maxStreak: streak.maxStreak,
        lastRegisteredAt: streak.lastRegisteredAt
    };
};

export const updateStreak = async (userId) => {
    let streak = await Streak.findOne({ userId }); // ← let, no const

    if (!streak) {
        streak = new Streak({ userId });
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