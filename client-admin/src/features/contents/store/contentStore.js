import { create } from "zustand";
import {
    getContent as getContentRequest,
    createContent as createContentRequest,
    updateContent as updateContentRequest,
    deleteContent as deleteContentRequest,
} from '../../../shared/apis'
import { errorMessage } from "../../../shared/utils/errorMessage.js";

export const useContentStore = create((set, get) => ({
    contents: [],
    loading: false,
    error: null,

    getContent: async () => {
        try{
            set({ loading: true, error: null});
            const response = await getContentRequest();

            set({
                contents: response.data.data,
                loading: false,
            });

            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'No se puieron obtener los contenidos');
            set({
                error: message, loading: false
            });
            return { success: false, error: message };
        };
    },

    createContent: async (FormData) => {
        try{
            set({ loading: true, error: null });
            const response = await createContentRequest(FormData);

            set({
                contents: [response.data.data, ...get().contents],
                loading: false,
            });
            return { success: true};
        }catch (err) {
            const message = errorMessage(err, 'Error al crear contenido');
            set({
                error: message, loading: false
            });
            return { success: false, error: message};
        }
    },

    updateContent: async(id, FormData) => {
        try{
            set({loading: true, error: null});
            const response = await updateContentRequest(id, FormData);
            set({
                contents: get().contents.map((content) => (content._id === id ?
                    response.data.data : content
                )),
                loading: false,
            });

            return { success: true };
        }catch(err){
            const message = errorMessage(err, 'Error al editar el contenido');
            set({
                error: message, loading: false
            });
            return { success: false, error: message};
        }
    },

    deleteContent: async(id) => {
        try{
            set({ loading: true, error: null });
            await deleteContentRequest(id);
            set({
                contents: get().contents.filter((content) => content._id !== id),
                loading: false,
            });
            return {success: true };
        }catch(err){
            const message = errorMessage(err, 'Error al eliminar contenido');
            set({
                error: message, loading: false
            });
            return { success: false, error: message};
        }
    },
}));