import { create } from 'zustand';
import {
    getAllUsersRequest,
    toggleUserStatusRequest,
    deleteUserRequest,
    createUserRequest,
    updateProfileRequest,
} from '../../../shared/apis/users';

const getErrorMessage = (error, fallback) => {
    return (
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        fallback
    );
};

export const useUserStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,

    getAllUsers: async (options = {}) => {
        const { force = false } = options;
        const state = get();

        if (state.loading) return;
        if (!force && state.users.length > 0) return;

        try {
            set({ loading: true, error: null });
            const response = await getAllUsersRequest();
            set({ users: response.data.data || [], loading: false });
        } catch (error) {
            set({
                error: getErrorMessage(error, 'Error al obtener usuarios'),
                loading: false,
            });
        }
    },

    toggleUserStatus: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await toggleUserStatusRequest(id);
            set({
                users: get().users.map((u) => (u._id === id ? response.data.data : u)),
                loading: false,
            });
            return { success: true };
        } catch (error) {
            set({
                loading: false,
                error: getErrorMessage(error, 'Error al cambiar estado del usuario'),
            });
            return { success: false, error: getErrorMessage(error, 'Error al cambiar estado') };
        }
    },

    deleteUser: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteUserRequest(id);
            set({
                users: get().users.filter((u) => u._id !== id),
                loading: false,
            });
            return { success: true };
        } catch (error) {
            set({
                loading: false,
                error: getErrorMessage(error, 'Error al eliminar usuario'),
            });
            return { success: false, error: getErrorMessage(error, 'Error al eliminar') };
        }
    },

    createUser: async (userData) => {
        try {
            set({ loading: true, error: null });
            const response = await createUserRequest(userData);
            const newUser = response.data.data;
            set({ users: [...get().users, newUser], loading: false });
            return { success: true };
        } catch (error) {
            set({
                loading: false,
                error: getErrorMessage(error, 'Error al crear usuario'),
            });
            return { success: false, error: getErrorMessage(error, 'Error al crear') };
        }
    },

    updateProfile: async (profileData) => {
        try {
            set({ loading: true, error: null });
            const response = await updateProfileRequest(profileData);
            const updated = response.data.data;
            // Refleja el cambio en la lista si el usuario está en ella
            set({
                users: get().users.map((u) => (u._id === updated._id ? updated : u)),
                loading: false,
            });
            return { success: true, data: updated };
        } catch (error) {
            set({
                loading: false,
                error: getErrorMessage(error, 'Error al actualizar el perfil'),
            });
            return { success: false, error: getErrorMessage(error, 'Error al actualizar') };
        }
    },
}));