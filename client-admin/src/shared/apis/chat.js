import { axiosIA } from './api.js';

export const sendChatMessage = async( message ) => {
    return await axiosIA.post('/chat', { message });
}