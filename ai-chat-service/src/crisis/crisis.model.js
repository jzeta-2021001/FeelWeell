'use strict'
import {Schema, model} from 'mongoose';

const crisisAlertSchema = new Schema({
    userId:{
        type: String,
        required: true,
        index:true
    },

    triggerMessage:{
        type: String,
        required: true
    },

    detectedKeywords:{
        type:[String],
        default: []
    },

    responseGiven:{
        type:String,
        required: true
    },
        resolved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('CrisisAlert', crisisAlertSchema);