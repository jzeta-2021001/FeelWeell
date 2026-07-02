import { create } from 'zustand';
import {
    getAllUsers as getAllUsersRequest,
    toggleUserStatus as toggleUserStatusRequest,
    deleteUser as deleteUserRequest,
    createUser as createUserRequest,
    updateProfile as updateProfileRequest,
} from '../../../shared/apis';

export const useUserStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,

    getAllUsers: async (options = {}) => {
        const { force = false } = options;
        const state = get();

        if (state.loading) return;
        if (!force && state.users.length > 0) return;

        set({ loading: true, error: null });
        try {
            const response = await getAllUsersRequest();
            const users = response.data?.data ?? response.data ?? response;

            set({ users: Array.isArray(users) ? users : [], loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error al listar usuarios',
                loading: false,
            });
        }
    },

    createUser: async (userData) => {
        set({ loading: true });
        try {
            const response = await createUserRequest(userData);
            const newUser = response.data?.data ?? response.data ?? response;

            set((state) => ({
                users: [newUser, ...state.users],
                loading: false,
            }));

            return {success: true};
        } catch (err) {
            set({ loading: false });
            return { success: false, error: err.response?.data?.message || 'Error al crear usuario' };
        }
    },

    toggleUserStatus: async (id) => {
        try {
            const response = await toggleUserStatusRequest(id);
            const updated = response.data?.data ?? response.data ?? response;

            set((state) => ({
                users: state.users.map((u) =>
                    u._id === id ? { ...u, isActive: updated.isActive } : u
                ),
            }));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Error al cambiar estado' };
        }
    },

    deleteUser: async (id) => {
        try {
            await deleteUserRequest(id);
            set((state) => ({
                users: state.users.filter((u) => u._id !== id),
            }));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Error al eliminar usuario' };
        }
    },

    updateProfile: async (userId, profileData) => {
        set({ loading: true });
        try {
            const response = await updateProfileRequest(profileData);
            const updated = response.data?.data ?? response.data ?? response;

            set((state) => ({
                users: state.users.map((u) =>
                    u._id === userId ? { ...u, ...updated } : u
                ),
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            set({ loading: false });
            return { success: false, error: err.response?.data?.message || 'Error al actualizar perfil' };
        }
    },
}));