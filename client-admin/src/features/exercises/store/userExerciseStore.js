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
    progress: null,
    loading: false,
    progressLoading: false,
    error: null,

    fetchExercises: async (type = null) => {
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
        } catch (err) {
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
        } catch (err) {
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
            const message = errorMessage(err, 'Error al completar el ejercicio');
            return { success: false, error: message };
        }
    },

    saveExercise: async (exerciseId) => {
        try {
            await saveForLaterRequest(exerciseId);
            await get().fetchProgress();
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'Error al guardar el ejercicio');
            return { success: false, error: message };
        }
    },
}));