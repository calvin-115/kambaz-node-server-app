import mongoose from "mongoose";
import schema from "./schema.js";

const AttemptModel = mongoose.model("AttemptModel", schema);
export default AttemptModel;