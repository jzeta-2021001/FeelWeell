import { axiosHealthy } from '../apis/api.js';

//Admin: gestión de contenido
export const getContent = async () => {
    return await axiosHealthy.get('/contents');
};

export const createContent = async (data) => {
    return await axiosHealthy.post('/contents', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateContent = async (id, data) => {
    return await axiosHealthy.put(`/contents/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteContent = async (id) => {
    return await axiosHealthy.delete(`/contents/${id}`);
};

//Usuario y Admin: consulta de contenido
export const getContentById = async (id) => {
    return await axiosHealthy.get(`/contents/${id}`);
};

export const getContentByCategory = async (category) => {
    return await axiosHealthy.get(`/contents/category/${encodeURIComponent(category)}`);
};