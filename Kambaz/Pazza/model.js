import mongoose from "mongoose";
import postSchema from "./schema.js";

const PostModel = mongoose.model("PostModel", postSchema);
export default PostModel;