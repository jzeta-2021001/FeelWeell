'use strict';

import { getOpenAIClient, AI_CONFIG } from '../../configs/ai.configuration.js';
import Conversation from './conversation.model.js';

const serializeHistory = (messages) =>
    messages.map((msg) => ({
        role: msg.role.toLowerCase(),
        content: msg.parts[0].text
    }));

export const sendMessage = async (userId, mensaje) => {
    const client = getOpenAIClient();

    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
        conversation = new Conversation({ userId });
    }

    // Construir messages para OpenAI: system + historial + mensaje actual
    const messages = [
        { role: 'system', content: AI_CONFIG.systemInstruction },
        ...serializeHistory(conversation.messages),
        { role: 'user', content: mensaje }
    ];

    const response = await client.chat.completions.create({
        model: AI_CONFIG.model,
        messages,
        ...AI_CONFIG.generationConfig
    });

    const respuestaTexto = response.choices[0].message.content;

    // Guardar en MongoDB con roles de OpenAI (user/assistant)
    conversation.messages.push(
        { role: 'USER', parts: [{ text: mensaje }] },
        { role: 'ASSISTANT', parts: [{ text: respuestaTexto }] }
    );

    conversation.lastInteraction = new Date();
    await conversation.save();

    return { respuesta: respuestaTexto };
};