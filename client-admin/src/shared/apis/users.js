import { axiosAuth } from './api';

export const getAllUsersRequest = async () => {
    return await axiosAuth.get('/api/users');
};

export const toggleUserStatusRequest = async (id) => {
    return await axiosAuth.patch(`/api/users/${id}/toggle-status`);
};

export const deleteUserRequest = async (id) => {
    return await axiosAuth.delete(`/api/users/${id}`);
};

export const createUserRequest = async (userData) => {
    return await axiosAuth.post('/api/auth', userData);
};

export const updateProfileRequest = async (profileData) => {
    return await axiosAuth.put('/api/auth/profile', profileData);
};