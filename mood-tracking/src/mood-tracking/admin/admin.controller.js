import * as adminService from './admin.service.js';

// Ver todos los registros emocionales de todos los usuarios
export const getAllMoodEntries = async (req, res) => {
    try {
        const { from, to, userId } = req.query;
        const entries = await adminService.getAllMoodEntries({ from, to, userId });
        res.json({ total: entries.length, entries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un registro emocional por ID
export const deleteMoodEntry = async (req, res) => {
    try {
        const { id } = req.params;
        await adminService.deleteMoodEntry(id);
        res.json({ success: true, message: `Registro ${id} eliminado` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ver todos los streaks
export const getAllStreaks = async (req, res) => {
    try {
        const streaks = await adminService.getAllStreaks();
        res.json({ total: streaks.length, streaks });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Resetear racha de un usuario específico
export const resetUserStreak = async (req, res) => {
    try {
        const { userId } = req.params;
        const streak = await adminService.resetUserStreak(userId);
        res.json({ success: true, message: `Racha de ${userId} reseteada`, streak });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ver todos los perfiles emocionales
export const getAllProfiles = async (req, res) => {
    try {
        const profiles = await adminService.getAllProfiles();
        res.json({ total: profiles.length, profiles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar perfil/cuestionario de un usuario
export const deleteUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        await adminService.deleteUserProfile(userId);
        res.json({ success: true, message: `Perfil de ${userId} eliminado` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Stats generales del sistema
export const getSystemStats = async (req, res) => {
    try {
        const stats = await adminService.getSystemStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};