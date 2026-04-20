import PostModel from "./model.js";
import FolderModel from "./folderModel.js";

// ==================== POSTS ====================

export const findPostsForCourse = async (courseId, userId, userRole) => {
    const query = { course: courseId };
    const posts = await PostModel.find(query).sort({ createdAt: -1 });
    return posts.filter((p) => {
        if (p.postTo === "Entire Class") return true;
        if (p.author && p.author.toString() === userId) return true;
        if (userRole === "FACULTY" || userRole === "INSTRUCTOR") return true;
        if (p.visibleTo && p.visibleTo.includes(userId)) return true;
        return false;
    });
};

export const findPostById = async (postId) => {
    return PostModel.findById(postId);
};

export const createPost = async (post) => {
    return PostModel.create(post);
};

export const updatePost = async (postId, updates) => {
    return PostModel.findByIdAndUpdate(postId, { ...updates, updatedAt: new Date() }, { new: true });
};

export const deletePost = async (postId) => {
    return PostModel.findByIdAndDelete(postId);
};

export const incrementViews = async (postId) => {
    return PostModel.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true });
};

// ==================== ANSWERS ====================

export const addAnswer = async (postId, answer) => {
    const post = await PostModel.findById(postId);
    post.answers.push(answer);
    post.updatedAt = new Date();
    return post.save();
};

export const updateAnswer = async (postId, answerId, updates) => {
    const post = await PostModel.findById(postId);
    const answer = post.answers.id(answerId);
    if (answer) {
        Object.assign(answer, updates, { updatedAt: new Date() });
        post.updatedAt = new Date();
        await post.save();
    }
    return post;
};

export const deleteAnswer = async (postId, answerId) => {
    return PostModel.findByIdAndUpdate(postId, { $pull: { answers: { _id: answerId } } }, { new: true });
};

// ==================== DISCUSSIONS ====================

export const addDiscussion = async (postId, discussion) => {
    const post = await PostModel.findById(postId);
    post.discussions.push(discussion);
    post.updatedAt = new Date();
    return post.save();
};

export const updateDiscussion = async (postId, discussionId, updates) => {
    const post = await PostModel.findById(postId);
    const disc = post.discussions.id(discussionId);
    if (disc) {
        Object.assign(disc, updates);
        post.updatedAt = new Date();
        await post.save();
    }
    return post;
};

export const deleteDiscussion = async (postId, discussionId) => {
    return PostModel.findByIdAndUpdate(postId, { $pull: { discussions: { _id: discussionId } } }, { new: true });
};

// ==================== REPLIES ====================

export const addReply = async (postId, discussionId, reply) => {
    const post = await PostModel.findById(postId);
    const disc = post.discussions.id(discussionId);
    if (disc) {
        disc.replies.push(reply);
        post.updatedAt = new Date();
        await post.save();
    }
    return post;
};

export const updateReply = async (postId, discussionId, replyId, updates) => {
    const post = await PostModel.findById(postId);
    const disc = post.discussions.id(discussionId);
    if (disc) {
        const reply = disc.replies.id(replyId);
        if (reply) {
            Object.assign(reply, updates);
            post.updatedAt = new Date();
            await post.save();
        }
    }
    return post;
};

export const deleteReply = async (postId, discussionId, replyId) => {
    const post = await PostModel.findById(postId);
    const disc = post.discussions.id(discussionId);
    if (disc) {
        disc.replies.pull(replyId);
        post.updatedAt = new Date();
        await post.save();
    }
    return post;
};

// ==================== FOLDERS ====================

export const findFoldersForCourse = async (courseId) => {
    return FolderModel.find({ course: courseId }).sort({ order: 1 });
};

export const createFolder = async (folder) => {
    return FolderModel.create(folder);
};

export const updateFolder = async (folderId, updates) => {
    return FolderModel.findByIdAndUpdate(folderId, updates, { new: true });
};

export const deleteFolder = async (folderId) => {
    return FolderModel.findByIdAndDelete(folderId);
};

export const deleteFolders = async (folderIds) => {
    return FolderModel.deleteMany({ _id: { $in: folderIds } });
};

export const initializeDefaultFolders = async (courseId) => {
    const existing = await FolderModel.find({ course: courseId });
    if (existing.length === 0) {
        const defaults = ["hw1", "hw2", "hw3", "hw4", "hw5", "hw6", "project", "exam", "logistics", "other", "office_hours"];
        const folders = defaults.map((name, i) => ({ course: courseId, name, order: i }));
        return FolderModel.insertMany(folders);
    }
    return existing;
};

// ==================== STATS ====================

export const getCourseStats = async (courseId) => {
    const posts = await PostModel.find({ course: courseId });
    const totalPosts = posts.length;
    const unansweredPosts = posts.filter((p) => p.type === "Question" && p.answers.length === 0).length;
    const instructorResponses = posts.reduce((acc, p) => acc + p.answers.filter((a) => a.role === "FACULTY" || a.role === "INSTRUCTOR").length, 0);
    const studentResponses = posts.reduce((acc, p) => acc + p.answers.filter((a) => a.role === "STUDENT").length, 0);
    return { totalPosts, unansweredPosts, instructorResponses, studentResponses };
};