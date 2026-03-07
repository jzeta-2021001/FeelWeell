import { createExerciseRecord, updateExerciseRecord, softDeleteExercise, uploadExercisePhotoService, deleteExercisePhotoService, listExercisesRecord, getExerciseByIdRecord, markExerciseCompletedRecord, saveExerciseForLaterRecord, getUserProgressRecord, getRecommendedExercisesRecord } from './exercise.services.js';

//Admin
export const createExercise = async (req, res) => {
    try {
        const exercise = await createExerciseRecord({
            contentData: req.body,
            file: req.file
        })

        res.status(201).json({
            success: true,
            message: 'Ejercicio creado exitosamente',
            data: exercise
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el ejercicio',
            error: e.message
        });
    }
};

export const updateExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await updateExerciseRecord(id, req.body, req.file);

        res.status(200).json({
            success: true,
            message: 'Ejercicio actualizado exitosamente',
            data: exercise
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el ejercicio',
            error: e.message
        });
    }
};

export const deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await softDeleteExercise(id);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el ejercicio',
            error: e.message
        });
    }
};

//Usuario y Admin
export const listExercises = async (req, res) => {
    try {
        const { type } = req.query;
        const exercises = await listExercisesRecord({ type });

        res.status(200).json({
            success: true,
            message: 'Ejercicios obtenidos exitosamente',
            total: exercises.length,
            data: exercises
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los ejercicios',
            error: e.message
        });
    }
};

export const getExerciseById = async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await getExerciseByIdRecord(id);

        res.status(200).json({
            success: true,
            message: 'Ejercicio obtenido exitosamente',
            data: exercise
        });
    } catch (e) {
        res.status(404).json({
            success: false,
            message: 'Error al obtener el ejercicio',
            error: e.message
        });
    }
};

//Usuario
export const markExerciseCompleted = async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const userId = req.user.id;

        const progress = await markExerciseCompletedRecord(userId, exerciseId);

        res.status(200).json({
            success: true,
            message: 'Ejercicio marcado como completado',
            data: progress
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al marcar el ejercicio como completado',
            error: e.message
        });
    }
};

export const saveExerciseForLater = async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const userId = req.user.id;

        const progress = await saveExerciseForLaterRecord(userId, exerciseId);

        res.status(200).json({
            success: true,
            message: 'Ejercicio guardado para después',
            data: progress
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar el ejercicio',
            error: e.message
        });
    }
};

export const uploadExercisePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionó ninguna imagen'
            });
        }

        const exercise = await uploadExercisePhotoService({
            exerciseId: req.params.id,
            file: req.file
        });

        res.status(200).json({
            success: true,
            message: 'Foto del Ejercicio actualizada exitosamente',
            data: exercise
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al subir la foto del plato',
            error: error.message
        });
    }
};

export const deleteExercisePhoto = async (req, res) => {
    try {
        const exercise = await deleteExercisePhotoService(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Foto del ejercicio eliminada exitosamente',
            data: exercise
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la foto del ejercicio',
            error: error.message
        });
    }
};

export const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const progressData = await getUserProgressRecord(userId);

        res.status(200).json({
            success: true,
            message: 'Progreso del usuario obtenido exitosamente',
            data: progressData
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el progreso',
            error: e.message
        });
    }
};


export const getRecommendedExercises = async(req, res)=>{
    try{
        const token = req.headers.authorization;
        const result = await getRecommendedExercisesRecord(token);
        res.status(200).json({
            success: true,
            emotionalProfile: result.emotionalProfile,
            total: result.exercises.length,
            exercises: result.exercises
        })
    }catch(e){
        res.status(500).json({
            success: false,
            message: "Error al obtener ejercicios recomendados.",
            e: e.message
        });
    }
};