import * as dao from "./dao.js";

export default function PazzaRoutes(app) {

    // ==================== POSTS ====================

    app.get("/api/courses/:courseId/pazza/posts", async (req, res) => {
        try {
            const { courseId } = req.params;
            const userId = req.session["currentUser"]?._id;
            const userRole = req.session["currentUser"]?.role;
            const { folder } = req.query;
            let posts = await dao.findPostsForCourse(courseId, userId, userRole);
            if (folder) {
                posts = posts.filter((p) => p.folders && p.folders.includes(folder));
            }
            res.json(posts);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get("/api/pazza/posts/:postId", async (req, res) => {
        try {
            const post = await dao.findPostById(req.params.postId);
            if (!post) return res.status(404).json({ error: "Post not found" });
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.post("/api/courses/:courseId/pazza/posts", async (req, res) => {
        try {
            const { courseId } = req.params;
            const currentUser = req.session["currentUser"];
            const post = {
                ...req.body,
                course: courseId,
                authorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Anonymous",
                authorRole: currentUser?.role || "STUDENT",
            };
            if (currentUser?._id) {
                post.author = currentUser._id;
            }
            const newPost = await dao.createPost(post);
            res.json(newPost);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.put("/api/pazza/posts/:postId", async (req, res) => {
        try {
            const post = await dao.updatePost(req.params.postId, req.body);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.delete("/api/pazza/posts/:postId", async (req, res) => {
        try {
            await dao.deletePost(req.params.postId);
            res.sendStatus(200);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.put("/api/pazza/posts/:postId/views", async (req, res) => {
        try {
            const post = await dao.incrementViews(req.params.postId);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // ==================== ANSWERS ====================

    app.post("/api/pazza/posts/:postId/answers", async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            const answer = {
                ...req.body,
                author: currentUser?._id,
                authorName: `${currentUser?.firstName} ${currentUser?.lastName}`,
                role: currentUser?.role === "FACULTY" ? "FACULTY" : "STUDENT",
            };
            const post = await dao.addAnswer(req.params.postId, answer);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.put("/api/pazza/posts/:postId/answers/:answerId", async (req, res) => {
        try {
            const post = await dao.updateAnswer(req.params.postId, req.params.answerId, req.body);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.delete("/api/pazza/posts/:postId/answers/:answerId", async (req, res) => {
        try {
            const post = await dao.deleteAnswer(req.params.postId, req.params.answerId);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // ==================== DISCUSSIONS ====================

    app.post("/api/pazza/posts/:postId/discussions", async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            const discussion = {
                ...req.body,
                author: currentUser?._id,
                authorName: `${currentUser?.firstName} ${currentUser?.lastName}`,
            };
            const post = await dao.addDiscussion(req.params.postId, discussion);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.put("/api/pazza/posts/:postId/discussions/:discussionId", async (req, res) => {
        try {
            const post = await dao.updateDiscussion(req.params.postId, req.params.discussionId, req.body);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.delete("/api/pazza/posts/:postId/discussions/:discussionId", async (req, res) => {
        try {
            const post = await dao.deleteDiscussion(req.params.postId, req.params.discussionId);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // ==================== REPLIES ====================

    app.post("/api/pazza/posts/:postId/discussions/:discussionId/replies", async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            const reply = {
                ...req.body,
                author: currentUser?._id,
                authorName: `${currentUser?.firstName} ${currentUser?.lastName}`,
            };
            const post = await dao.addReply(req.params.postId, req.params.discussionId, reply);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.put("/api/pazza/posts/:postId/discussions/:discussionId/replies/:replyId", async (req, res) => {
        try {
            const post = await dao.updateReply(req.params.postId, req.params.discussionId, req.params.replyId, req.body);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.delete("/api/pazza/posts/:postId/discussions/:discussionId/replies/:replyId", async (req, res) => {
        try {
            const post = await dao.deleteReply(req.params.postId, req.params.discussionId, req.params.replyId);
            res.json(post);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // ==================== FOLDERS ====================

    app.get("/api/courses/:courseId/pazza/folders", async (req, res) => {
        try {
            const folders = await dao.findFoldersForCourse(req.params.courseId);
            if (folders.length === 0) {
                const initialized = await dao.initializeDefaultFolders(req.params.courseId);
                return res.json(initialized);
            }
            res.json(folders);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.post("/api/courses/:courseId/pazza/folders", async (req, res) => {
        try {
            const folder = { ...req.body, course: req.params.courseId };
            const newFolder = await dao.createFolder(folder);
            res.json(newFolder);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.put("/api/pazza/folders/:folderId", async (req, res) => {
        try {
            const folder = await dao.updateFolder(req.params.folderId, req.body);
            res.json(folder);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.delete("/api/pazza/folders/:folderId", async (req, res) => {
        try {
            await dao.deleteFolder(req.params.folderId);
            res.sendStatus(200);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.delete("/api/pazza/folders", async (req, res) => {
        try {
            const { ids } = req.body;
            await dao.deleteFolders(ids);
            res.sendStatus(200);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // ==================== STATS ====================

    app.get("/api/courses/:courseId/pazza/stats", async (req, res) => {
        try {
            const stats = await dao.getCourseStats(req.params.courseId);
            res.json(stats);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}