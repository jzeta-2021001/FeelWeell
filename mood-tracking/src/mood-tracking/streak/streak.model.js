import { Schema, model } from "mongoose";

const streakSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "El userId es obligatorio"],
      trim: true,
      unique: true,
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: [0, "La racha no puede ser negativa"],
    },

    maxStreak: {
      type: Number,
      default: 0,
      min: [0, "La racha máxima no puede ser negativa"],
    },

    lastRegisteredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Streak", streakSchema);