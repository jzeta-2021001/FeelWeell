import MoodEntry from '../mood/moodEntry.model.js';
import Streak from '../streak/streak.model.js';
import QuestionnaireResponse from '../questionnaireResponse.model.js';

export const getAllMoodEntries = async ({ from, to, userId }) => {
    const filter = {};
    if (userId) filter.userId = userId;
    if (from || to) {
        filter.date = {};
        if (from) filter.date.$gte = new Date(from);
        if (to) filter.date.$lte = new Date(to);
    }
    return MoodEntry.find(filter).sort({ date: -1 });
};

export const deleteMoodEntry = async (id) => {
    const entry = await MoodEntry.findByIdAndDelete(id);
    if (!entry) throw new Error(`Registro ${id} no encontrado`);
    return entry;
};

export const getAllStreaks = async () => {
    return Streak.find().sort({ currentStreak: -1 });
};

export const resetUserStreak = async (userId) => {
    const streak = await Streak.findOneAndUpdate(
        { userId },
        { currentStreak: 0, lastRegisteredAt: null },
        { new: true }
    );
    if (!streak) throw new Error(`Usuario ${userId} no tiene racha registrada`);
    return streak;
};

export const getAllProfiles = async () => {
    return QuestionnaireResponse.find().sort({ completedAt: -1 });
};

export const deleteUserProfile = async (userId) => {
    const profile = await QuestionnaireResponse.findOneAndDelete({ userId });
    if (!profile) throw new Error(`Perfil de ${userId} no encontrado`);
    return profile;
};

export const getSystemStats = async () => {
    const [totalEntries, totalStreaks, totalProfiles] = await Promise.all([
        MoodEntry.countDocuments(),
        Streak.countDocuments(),
        QuestionnaireResponse.countDocuments(),
    ]);

    const topEmotions = await MoodEntry.aggregate([
        { $group: { _id: '$emotion', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    const profileDistribution = await QuestionnaireResponse.aggregate([
        { $group: { _id: '$emotionalProfile', count: { $sum: 1 } } }
    ]);

    return {
        totalEntries,
        totalStreaks,
        totalProfiles,
        topEmotions,
        profileDistribution
    };
};