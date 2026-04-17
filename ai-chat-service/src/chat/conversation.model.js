'use strict';
import {Schema, model} from 'mongoose';

const MAX_MESSAGES = 50;
const DAYS_LIMIT = 30;

const messageSchema = new Schema({
        role: {
            type: String,
            enum: ['USER', 'ASSISTANT'],
            required: true
        },
        parts: [
            {
                text: { type: String, required: true }
            }
        ]
    },
    { _id: false }
);

const conversationSchema = new Schema({
        userId:{
            type: String,
            required: true,
            unique: true,
            index: true
        },
        messages:{
            type: [messageSchema],
            default: []
        },
        lastInteraction:{
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

conversationSchema.index(
    { lastInteraction: 1 },
    { expireAfterSeconds: DAYS_LIMIT * 24 * 60 * 60 }
);

// Antes de guardar, recortar al límite máximo de mensajes
conversationSchema.pre('save', async function () {
    if (this.messages.length > MAX_MESSAGES) {
        this.messages = this.messages.slice(-MAX_MESSAGES);
    }
});
export default model('Conversation', conversationSchema);