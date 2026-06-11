import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    sendChatMessage
} from '../../../shared/apis';
import { errorMessage } from '../../../shared/utils/errorMessage.js';

const buildUserMessage = (text) => ({
    id: crypto.randomUUID(),
    role: 'user',
    tipo: 'user',
    text,
    timestamp: new Date().toISOString()
});

const buildAIMessage = (tipo, text) => ({
    id: crypto.randomUUID(),
    role: 'assistant',
    tipo,
    text,
    timestamp: new Date().toISOString()
});

export const useChatStore = create(
    persist(
        (set, get) => ({
            messages: [],
            isTyping: false,
            error: null,

            sendMessage: async(text) =>{
                if(!text?.trim()) return;
                const userMsg = buildUserMessage(text.trim());

                set((state) => ({
                    messages: [...state.messages, userMsg],
                    isTyping: true,
                    error: null,
                }));

                try{
                    const response = await sendChatMessage(text.trim());
                    const { tipo, respuesta } = response.data;
                    const aiMsg = buildAIMessage( tipo, respuesta);

                    set((state) => ({
                        messages: [...state.messages, aiMsg],
                        isTyping: false,
                    }))
                    
                    return {success: true, tipo}
                } catch (err) {
                    const msg = errorMessage(err, 'No se pudo conectar con Tiyú. Intenta de nuevo.');
                    const errorMsg = buildAIMessage('error', msg);

                    set((state)=>({
                        messages: [...state.messages, errorMsg],
                        isTyping: false,
                        error: msg,
                    }));
                    return {success: false, error: msg};
                }//try-cathc
            },//sendMessages

            clearMessages: () => set({messages: [], error: null, isTyping: false}),
            clearError: () => set({error: null})
        }),//Set, get
        {
            name: 'tiyu-chat-store',
            partialize: (state) => ({
                messages: state.messages.filter((m) => m.tipo !== 'error'),
            }),
        }
    )//persist
)//create