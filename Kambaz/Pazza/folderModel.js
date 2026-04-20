import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    course: { type: String, required: true },
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { collection: "pazza_folders" });

const FolderModel = mongoose.model("FolderModel", folderSchema);
export default FolderModel;