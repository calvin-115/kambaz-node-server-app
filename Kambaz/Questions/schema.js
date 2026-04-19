import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        quiz: { type: String, required: true },
        title: { type: String, default: "New Question" },
        type: { type: String, enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"], default: "MULTIPLE_CHOICE" },
        points: { type: Number, default: 1 },
        question: { type: String, default: "" },
        choices: [
            {
                text: { type: String, default: "" },
                isCorrect: { type: Boolean, default: false },
            },
        ],
        correctAnswer: { type: Boolean, default: true },
        blanks: [
            {
                text: { type: String, default: "" },
            },
        ],
    },
    { collection: "questions" }
);

export default questionSchema;