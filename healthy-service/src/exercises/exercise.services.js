import Exercise from './exercise.model.js';
import { deleteCloudinaryImage } from '../../middlewares/file-uploader.js';
import axios from 'axios';
import UserProgress from './userProgress.model.js';

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

const buildPhotoData = (file) => {
    if (!file) return { photo: null, photoUrl: null };
    const publicId = file.filename;
    const photoUrl = `${CLOUDINARY_BASE_URL}/${publicId}`;
    return { photo: publicId, photoUrl };
};

export const createExerciseRecord = async ({ contentData, file }) => {
    const data = { ...contentData, ...buildPhotoData(file) };
    const exercise = new Exercise(data);
    await exercise.save();
    return exercise;
};

export const updateExerciseRecord = async (id, exerciseData, file) => {
    const data = { ...exerciseData };

    if (file) {
        const existing = await Exercise.findById(id);
        if (existing?.photo) {
            await deleteCloudinaryImage(existing.photo);
        }
        const publicId = file.filename;
        data.photo = publicId;
        data.photoUrl = `${CLOUDINARY_BASE_URL}/${publicId}`;
    }

    const exercise = await Exercise.findByIdAndUpdate(
        id,
        { ...data },
        { new: true, runValidators: true }
    );

    if (!exercise) throw new Error('Ejercicio no encontrado');
    return exercise;
};

export const softDeleteExercise = async (id) => {
    const exercise = await Exercise.findById(id);
    if (!exercise) throw new Error('Ejercicio no encontrado');

    await deleteCloudinaryImage(exercise.photo);
    exercise.isDeleted = true;
    exercise.deletedAt = new Date();
    await exercise.save();

    return { message: 'Ejercicio eliminado correctamente' };
};

export const listExercisesRecord = async (filters = {}) => {
    const query = {};
    if (filters.type) query.type = filters.type;
    const exercises = await Exercise.find({ ...query, isDeleted: false }).sort({ createdAt: -1 });
    return exercises;
};

export const getExerciseByIdRecord = async (id) => {
    const exercise = await Exercise.findById(id);
    if (!exercise) throw new Error('Ejercicio no encontrado');
    return exercise;
};

export const markExerciseCompletedRecord = async (userId, exerciseId) => {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) throw new Error('Ejercicio no encontrado');

    const progress = await UserProgress.findOneAndUpdate(
        { userId, exerciseId },
        { completed: true, completedAt: new Date() },
        { upsert: true, new: true, runValidators: true }
    );
    return progress;
};

export const saveExerciseForLaterRecord = async (userId, exerciseId) => {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) throw new Error('Ejercicio no encontrado');

    const progress = await UserProgress.findOneAndUpdate(
        { userId, exerciseId },
        { savedForLater: true, savedAt: new Date() },
        { upsert: true, new: true, runValidators: true }
    );
    return progress;
};

export const uploadExercisePhotoService = async ({ exerciseId, file }) => {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    if (exercise.photo) {
        await deleteCloudinaryImage(exercise.photo);
    }

    const publicId = file.filename;
    exercise.photo = publicId;
    exercise.photoUrl = `${CLOUDINARY_BASE_URL}/${publicId}`;
    await exercise.save();

    return exercise;
};

export const deleteExercisePhotoService = async (exerciseId) => {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    if (exercise.photo) {
        await deleteCloudinaryImage(exercise.photo);
        exercise.photo = null;
        exercise.photoUrl = null;
        await exercise.save();
    }

    return exercise;
};

export const getUserProgressRecord = async (userId) => {
    const allProgress = await UserProgress.find({ userId })
        .populate('exerciseId', 'title type duration');

    const completed = allProgress.filter(p => p.completed);
    const saved = allProgress.filter(p => p.savedForLater);
    const pending = allProgress.filter(p => p.savedForLater && !p.completed);

    return {
        summary: {
            totalCompleted: completed.length,
            totalSaved: saved.length,
            totalPending: pending.length
        },
        completed: completed.map(p => ({ exercise: p.exerciseId, completedAt: p.completedAt })),
        saved: saved.map(p => ({ exercise: p.exerciseId, savedAt: p.savedAt })),
        pending: pending.map(p => ({ exercise: p.exerciseId, savedAt: p.savedAt }))
    };
};

export const getRecommendedExercisesRecord = async (token) => {
    const response = await axios.get(
        "http://localhost:3001/feelweell/v1/moodTracking/profile",
        { headers: { Authorization: token } }
    );

    const emotionalProfile = response.data.emotionalProfile;
    const exercises = await Exercise.find({ targetProfile: emotionalProfile });

    if (exercises.length === 0) {
        return { message: "No hay ejercicios disponibles para este estado de ánimo", exercises: [] };
    }

    return { emotionalProfile, exercises };
};