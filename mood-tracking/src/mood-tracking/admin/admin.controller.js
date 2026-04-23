import * as adminService from './admin.service.js';

export const getAllMoodEntries = async (req, res) => {
    try {
        const { from, to, userId } = req.query;
        const entries = await adminService.getAllMoodEntries({ from, to, userId });
        return res.status(200).json({ success: true, total: entries.length, data: entries });
    } catch (err) {
        console.error('[getAllMoodEntries]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const deleteMoodEntry = async (req, res) => {
    try {
        const { id } = req.params;
        await adminService.deleteMoodEntry(id);
        return res.status(200).json({ success: true, message: `Registro ${id} eliminado` });
    } catch (err) {
        if (err.message.includes('no encontrado') || err.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Registro no encontrado' });
        }
        console.error('[deleteMoodEntry]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const getAllStreaks = async (req, res) => {
    try {
        const streaks = await adminService.getAllStreaks();
        return res.status(200).json({ success: true, total: streaks.length, data: streaks });
    } catch (err) {
        console.error('[getAllStreaks]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const resetUserStreak = async (req, res) => {
    try {
        const { userId } = req.params;
        const streak = await adminService.resetUserStreak(userId);
        return res.status(200).json({ success: true, message: `Racha de ${userId} reseteada`, data: streak });
    } catch (err) {
        if (err.message.includes('no encontrado') || err.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        console.error('[resetUserStreak]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const getAllProfiles = async (req, res) => {
    try {
        const profiles = await adminService.getAllProfiles();
        return res.status(200).json({ success: true, total: profiles.length, data: profiles });
    } catch (err) {
        console.error('[getAllProfiles]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const deleteUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        await adminService.deleteUserProfile(userId);
        return res.status(200).json({ success: true, message: `Perfil de ${userId} eliminado` });
    } catch (err) {
        if (err.message.includes('no encontrado') || err.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Perfil no encontrado' });
        }
        console.error('[deleteUserProfile]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const getSystemStats = async (req, res) => {
    try {
        const stats = await adminService.getSystemStats();
        return res.status(200).json({ success: true, data: stats });
    } catch (err) {
        console.error('[getSystemStats]', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};