import { axiosAuth } from './api.js';

const DAILY_API_URL = import.meta.env.VITE_DAILY_MESSAGE_URL || 'http://localhost:5001';

export const getAllMessages = async () => {
    return await axiosAuth.get(`${DAILY_API_URL}/api/admin/messages`);
};

export const createMessage = async (messageData) => {
    return await axiosAuth.post(`${DAILY_API_URL}/api/admin/messages`, messageData);
};

export const updateMessage = async (id, messageData) => {
    return await axiosAuth.patch(`${DAILY_API_URL}/api/admin/messages/${id}`, messageData);
};

export const deleteMessage = async (id) => {
    return await axiosAuth.delete(`${DAILY_API_URL}/api/admin/messages/${id}`);
};