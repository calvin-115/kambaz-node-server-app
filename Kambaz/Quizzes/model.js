import mongoose from "mongoose";
import schema from "./schema.js";

const QuizModel = mongoose.model("QuizModel", schema);
export default QuizModel;