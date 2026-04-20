import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    author: { type: String },
    authorName: String,
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

const discussionSchema = new mongoose.Schema({
    author: { type: String },
    authorName: String,
    text: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

const answerSchema = new mongoose.Schema({
    author: { type: String },
    authorName: String,
    text: { type: String, required: true },
    role: { type: String, enum: ["STUDENT", "FACULTY", "INSTRUCTOR"], default: "STUDENT" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: false });

const postSchema = new mongoose.Schema({
    course: { type: String, required: true },
    type: { type: String, enum: ["Question", "Note"], default: "Question" },
    postTo: { type: String, enum: ["Entire Class", "Individual"], default: "Entire Class" },
    visibleTo: [String],
    folders: [String],
    summary: { type: String, required: true, maxlength: 100 },
    details: { type: String, required: true },
    author: { type: String },
    authorName: String,
    authorRole: String,
    views: { type: Number, default: 0 },
    answers: [answerSchema],
    discussions: [discussionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { collection: "pazza_posts" });

export default postSchema;