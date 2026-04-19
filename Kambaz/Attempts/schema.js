import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
    {
        quiz: { type: String, required: true },
        user: { type: String, required: true },
        answers: [
            {
                question: { type: String, required: true },
                answer: { type: mongoose.Schema.Types.Mixed },
            },
        ],
        score: { type: Number, default: 0 },
        attemptNumber: { type: Number, default: 1 },
        submittedAt: { type: Date, default: Date.now },
    },
    { collection: "attempts" }
);

export default attemptSchema;