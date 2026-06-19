import { axiosHealthy } from "./api.js";

//admin-healthy
export const getExercises = async () => {
    return await axiosHealthy.get('/exercises');
};

export const createExercise = async (data) => {
    return await axiosHealthy.post('/exercises', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateExercise = async (id, data) => {
    return await axiosHealthy.put(`/exercises/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteExercise = async (id) => {
    return await axiosHealthy.delete(`/exercises/${id}`);
};

//Users
export const getExerciseById = async (id) => {
    return await axiosHealthy.get(`/exercises/${id}`);
};

export const getRecommendedExercises = async () => {
    return await axiosHealthy.get('/exercises/recommended');
};

export const getUserProgress = async () => {
    return await axiosHealthy.get('/exercises/user/progress');
};

export const markExerciseCompleted = async (exerciseId) => {
    return await axiosHealthy.post(`/exercises/${exerciseId}/complete`);
};

export const saveExerciseForLater = async (exerciseId) => {
    return await axiosHealthy.post(`/exercises/${exerciseId}/save`);
};