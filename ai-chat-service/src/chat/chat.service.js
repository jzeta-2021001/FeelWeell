'use strict';

import { getOpenAIClient, AI_CONFIG } from '../../configs/ai.configuration.js';
import Conversation from './conversation.model.js';

const serializeHistory = (messages = []) => {
    return messages
        .map(msg => {
            const plain = msg.toObject ? msg.toObject() : msg;

            return {
                role: plain.role.toLowerCase(),
                content: plain?.parts?.[0]?.text
            };
        })
        .filter(
            msg =>
                typeof msg.content === 'string' &&
                msg.content.trim().length > 0
        );
};

export const sendMessage = async (userId, message) => {
    const client = getOpenAIClient();

    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
        conversation = new Conversation({ userId });
    }

    const history = serializeHistory(conversation.messages);

    // Construir messages para OpenAI: system + historial limpio + mensaje actual
    const messages = [
        { role: 'system', content: AI_CONFIG.systemInstruction },
        ...history,
        { role: 'user', content: message }
    ];

    const response = await client.chat.completions.create({
        model: AI_CONFIG.model,
        messages,
        ...AI_CONFIG.generationConfig
    });

    const respuestaTexto = response.choices[0].message.content;

    // Guardar en MongoDB con roles de OpenAI (user/assistant)
    conversation.messages.push(
        { role: 'USER', parts: [{ text: message }] },
        { role: 'ASSISTANT', parts: [{ text: respuestaTexto }] }
    );

    conversation.lastInteraction = new Date();
    await conversation.save();

    return { respuesta: respuestaTexto };
};