import { createExerciseRecord, updateExerciseRecord, softDeleteExercise, uploadExercisePhotoService, deleteExercisePhotoService, listExercisesRecord, getExerciseByIdRecord, markExerciseCompletedRecord, saveExerciseForLaterRecord, getUserProgressRecord, getRecommendedExercisesRecord } from './exercise.services.js';

export const createExercise = async (req, res) => {
    try {
        const exercise = await createExerciseRecord({
            contentData: req.body,
            file: req.file
        });
        return res.status(201).json({
            success: true,
            message: 'Ejercicio creado exitosamente',
            data: exercise
        });
    } catch (e) {
        console.error('[createExercise]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const updateExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await updateExerciseRecord(id, req.body, req.file);
        return res.status(200).json({
            success: true,
            message: 'Ejercicio actualizado exitosamente',
            data: exercise
        });
    } catch (e) {
        if (e.message.includes('no encontrado') || e.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Ejercicio no encontrado' });
        }
        console.error('[updateExercise]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await softDeleteExercise(id);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (e) {
        if (e.message.includes('no encontrado') || e.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Ejercicio no encontrado' });
        }
        console.error('[deleteExercise]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const listExercises = async (req, res) => {
    try {
        const { type } = req.query;
        const exercises = await listExercisesRecord({ type });
        return res.status(200).json({
            success: true,
            message: 'Ejercicios obtenidos exitosamente',
            total: exercises.length,
            data: exercises
        });
    } catch (e) {
        console.error('[listExercises]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const getExerciseById = async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await getExerciseByIdRecord(id);
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Ejercicio no encontrado' });
        }
        return res.status(200).json({
            success: true,
            message: 'Ejercicio obtenido exitosamente',
            data: exercise
        });
    } catch (e) {
        if (e.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        console.error('[getExerciseById]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const markExerciseCompleted = async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const userId = req.user.id;
        const progress = await markExerciseCompletedRecord(userId, exerciseId);
        return res.status(200).json({
            success: true,
            message: 'Ejercicio marcado como completado',
            data: progress
        });
    } catch (e) {
        if (e.message.includes('no encontrado') || e.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Ejercicio no encontrado' });
        }
        console.error('[markExerciseCompleted]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const saveExerciseForLater = async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const userId = req.user.id;
        const progress = await saveExerciseForLaterRecord(userId, exerciseId);
        return res.status(200).json({
            success: true,
            message: 'Ejercicio guardado para después',
            data: progress
        });
    } catch (e) {
        if (e.message.includes('no encontrado') || e.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Ejercicio no encontrado' });
        }
        console.error('[saveExerciseForLater]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const uploadExercisePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se proporcionó ninguna imagen' });
        }
        const exercise = await uploadExercisePhotoService({
            exerciseId: req.params.id,
            file: req.file
        });
        return res.status(200).json({
            success: true,
            message: 'Foto del ejercicio actualizada exitosamente',
            data: exercise
        });
    } catch (e) {
        console.error('[uploadExercisePhoto]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const deleteExercisePhoto = async (req, res) => {
    try {
        const exercise = await deleteExercisePhotoService(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Foto del ejercicio eliminada exitosamente',
            data: exercise
        });
    } catch (e) {
        if (e.message.includes('no encontrado') || e.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Ejercicio no encontrado' });
        }
        console.error('[deleteExercisePhoto]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const progressData = await getUserProgressRecord(userId);
        return res.status(200).json({
            success: true,
            message: 'Progreso del usuario obtenido exitosamente',
            data: progressData
        });
    } catch (e) {
        console.error('[getUserProgress]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const getRecommendedExercises = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token requerido' });
        }
        const result = await getRecommendedExercisesRecord(token);
        return res.status(200).json({
            success: true,
            emotionalProfile: result.emotionalProfile,
            total: result.exercises.length,
            data: result.exercises
        });
    } catch (e) {
        console.error('[getRecommendedExercises]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};