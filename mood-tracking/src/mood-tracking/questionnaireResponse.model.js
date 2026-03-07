import { Schema, model } from "mongoose";

const answerSchema = new Schema(
  {
    questionId: {
      type: Number,
      required: [true, "El questionId es obligatorio"],
    },
    answer: {
      type: Number,
      required: [true, "La respuesta es obligatoria"],
      min: [1, "Valor mínimo 1"],
      max: [5, "Valor máximo 5"],
    },
  },
  { _id: false } // No generar _id por cada respuesta, para evvitar desorden
);

const questionnaireResponseSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "El userId es obligatorio"],
      trim: true,
      unique: true,
    },

    answers: {
      type: [answerSchema],
      required: [true, "Las respuestas son obligatorias"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Debe haber al menos una respuesta",
      },
    },

    emotionalProfile: {
      type: String,
      enum: {
        values: 
          ["PROBLEMA_DE_TRISTEZA" , 
          "PROBLEMA_DE_IRA", 
          "PROBLEMA_DE_ANSIEDAD", 
          "ALEGRE",
          "NEUTRAL",
          "PROBLEMA_DE_CULPABILIDAD",
          "AMOROSO", 
          "PROBLEMA_DE_DISOSACION",
          "PROBLEMA_DE_AISLAMIENTO",
          "SIN_PERFIL"],
        message: "Perfil {VALUE} no válido",
      },
      default: "SIN_PERFIL",
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("QuestionnaireResponse", questionnaireResponseSchema);