import { create } from "zustand";
import {
    getExercises as getExercisesRequest,
    createExercise as createExerciseRequest,
    updateExercise as updateExerciseRequest,
    deleteExercise as deleteExerciseRequest
} from '../../../shared/apis';
import { errorMessage } from "../../../shared/utils/errorMessage.js";

export const useExerciseStore = create((set, get) => ({
    exercises: [],
    loading: false,
    error: null,

    getExercises: async () => {
        try{
            set({ loading: true, error: null });
            const response = await getExercisesRequest();

            set({
                exercises: response.data.data,
                loading: false,
            });

            return { success: true };
        }catch (err) {
            const message = errorMessage(err, 'No se pudo obtener los ejercicios');
            set({
                error: message, loading: false
            });
            return { success: false, error: message};
        };
    },

    createExercise: async (FormData) => {
        try{
            set({ loading: true, error: null});
            const response = await createExerciseRequest(FormData);

            set({
                exercises: [response.data.data, ...get().exercises],
                loading: false,
            });
            return { success: true };
        } catch (err){
            const message = errorMessage(err, 'Error al crear ejercicio');
            set({
                error: message, loading: false
            });
            return { success: false, error: message};
        }
    },

    updateExercise: async(id, FormData) => {
        try {
            set({ loading: true, error: null});
            const response = await updateExerciseRequest(id, FormData);
            set({
                exercises: get().exercises.map((exercise) => (exercise._id === id ?
                    response.data.data : exercise
                )),
                loading: false,
            });

            return { success: true };
        } catch (err) {
            const message= errorMessage(err, 'Error al editar el ejercicio');
            set({
                error: message, loading: false
            });
            return { success: false, error: message};
        }
    },

    deleteExercise: async(id) => {
        try{
            set({ loading: true, error: null});
            await deleteExerciseRequest(id);
            set({
                exercises: get().exercises.filter((exercise) => exercise._id !== id),
                loading: false,
            });
            return { success: true };
        }catch(err) {
            const message= errorMessage(err, 'Error al eliminar el ejercicio');
            set({
                error: message, loading: false
            });
            return { success: false, error: message};
        }
    },
}));