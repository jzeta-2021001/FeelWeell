import { axiosHealthy } from "./api.js";

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
    return await axiosHealthy.delete( `/exercises/${id}`);
};
