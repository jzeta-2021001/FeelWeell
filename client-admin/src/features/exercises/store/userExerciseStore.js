import { create } from 'zustand';
import {
    getExercises as getExercisesRequest,
    getRecommendedExercises as getRecommendedRequest,
    getUserProgress as getUserProgressRequest,
    markExerciseCompleted as markCompletedRequest,
    saveExerciseForLater as saveForLaterRequest,
} from '../../../shared/apis';
import { errorMessage } from '../../../shared/utils/errorMessage.js';

export const useUserExerciseStore = create((set, get) => ({
    exercises: [],
    recommended: [],
    progress: null,       // { summary, completed, saved, pending }
    loading: false,
    progressLoading: false,
    error: null,

    fetchExercises: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getExercisesRequest();
            set({ exercises: response.data.data, loading: false });
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'No se pudieron obtener los ejercicios');
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    fetchRecommended: async () => {
        try {
            const response = await getRecommendedRequest();
            set({ recommended: response.data.data ?? [] });
            return { success: true };
        } catch {
            set({ recommended: [] });
            return { success: false };
        }
    },

    fetchProgress: async () => {
        try {
            set({ progressLoading: true });
            const response = await getUserProgressRequest();
            set({ progress: response.data.data, progressLoading: false });
            return { success: true };
        } catch {
            set({ progressLoading: false });
            return { success: false };
        }
    },

    completeExercise: async (exerciseId) => {
        try {
            await markCompletedRequest(exerciseId);
            await get().fetchProgress();
            return { success: true };
        } catch (err) {
            return { success: false, error: errorMessage(err, 'Error al completar el ejercicio') };
        }
    },

    toggleSaveExercise: async (exerciseId, isSaved) => {
        if (isSaved) return { success: true, alreadySaved: true };
        try {
            await saveForLaterRequest(exerciseId);
            await get().fetchProgress();
            return { success: true };
        } catch (err) {
            return { success: false, error: errorMessage(err, 'Error al guardar el ejercicio') };
        }
    },
}));