import mongoose from "mongoose";
import schema from "./schema.js";

const QuestionModel = mongoose.model("QuestionModel", schema);
export default QuestionModel;