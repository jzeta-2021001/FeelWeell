'use strict';

import CrisisAlert from './crisis.model.js';

export const saveCrisisAlert = async ({ userId, triggerMessage, detectedKeywords, responseGiven }) => {
    try {
        const alert = new CrisisAlert({
            userId,
            triggerMessage,
            detectedKeywords,
            responseGiven
        });
        await alert.save();
        console.warn(`[CRISIS ALERT] userId: ${userId} | keywords: ${detectedKeywords.join(', ')}`);
    } catch (e) {
        console.error(`[CRISIS ALERT - SAVE ERROR] ${e.message}`);
    }
};