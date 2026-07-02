import { create } from 'zustand';
import {
    getContent as getContentRequest,
    getContentById as getContentByIdRequest,
} from '../../../shared/apis';
import { errorMessage } from '../../../shared/utils/errorMessage.js';

// Store de contenido educativo para el rol de usuario (solo lectura).
// La gestión (crear/editar/eliminar) vive en contentStore.js (client-admin).
export const useUserContentStore = create((set, get) => ({
    contents: [],
    loading: false,
    error: null,

    fetchContents: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getContentRequest();
            set({ contents: response.data.data ?? [], loading: false });
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, 'No se pudo obtener el contenido educativo');
            set({ error: message, loading: false, contents: [] });
            return { success: false, error: message };
        }
    },

    // Refresca un único contenido (por ejemplo, tras abrirlo desde un enlace directo)
    fetchContentById: async (id) => {
        try {
            const response = await getContentByIdRequest(id);
            const content = response.data.data;
            set({
                contents: get().contents.some((c) => c._id === content._id)
                    ? get().contents.map((c) => (c._id === content._id ? content : c))
                    : [content, ...get().contents],
            });
            return { success: true, data: content };
        } catch (err) {
            const message = errorMessage(err, 'No se pudo obtener el contenido');
            return { success: false, error: message };
        }
    },
}));