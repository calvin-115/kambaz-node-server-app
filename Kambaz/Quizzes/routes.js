import * as quizDao from "./dao.js";
import * as questionDao from "../Questions/dao.js";
import * as attemptDao from "../Attempts/dao.js";

export default function QuizRoutes(app) {
    // ========== QUIZ ROUTES ==========

    app.get("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quizzes = await quizDao.findQuizzesForCourse(courseId);
        res.json(quizzes);
    });

    app.get("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const quiz = await quizDao.findQuizById(quizId);
        res.json(quiz);
    });

    app.post("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quiz = { ...req.body, course: courseId };
        const newQuiz = await quizDao.createQuiz(quiz);
        res.json(newQuiz);
    });

    app.put("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const status = await quizDao.updateQuiz(quizId, req.body);
        res.json(status);
    });

    app.delete("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        await questionDao.deleteQuestionsForQuiz(quizId);
        await attemptDao.deleteAttemptsForQuiz(quizId);
        const status = await quizDao.deleteQuiz(quizId);
        res.json(status);
    });

    app.put("/api/quizzes/:quizId/publish", async (req, res) => {
        const { quizId } = req.params;
        const quiz = await quizDao.findQuizById(quizId);
        const status = await quizDao.updateQuiz(quizId, { published: !quiz.published });
        res.json(status);
    });

    // ========== QUESTION ROUTES ==========

    app.get("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const questions = await questionDao.findQuestionsForQuiz(quizId);
        res.json(questions);
    });

    app.get("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        const question = await questionDao.findQuestionById(questionId);
        res.json(question);
    });

    app.post("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const question = { ...req.body, quiz: quizId };
        const newQuestion = await questionDao.createQuestion(question);
        res.json(newQuestion);
    });

    app.put("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        const status = await questionDao.updateQuestion(questionId, req.body);
        res.json(status);
    });

    app.delete("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        const status = await questionDao.deleteQuestion(questionId);
        res.json(status);
    });

    // ========== ATTEMPT ROUTES ==========

    app.get("/api/quizzes/:quizId/attempts", async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { quizId } = req.params;
        const attempts = await attemptDao.findAttemptsForQuiz(quizId, currentUser._id);
        res.json(attempts);
    });

    app.get("/api/quizzes/:quizId/latest-attempt", async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { quizId } = req.params;
        const attempt = await attemptDao.findLatestAttempt(quizId, currentUser._id);
        res.json(attempt);
    });

    app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { quizId } = req.params;
        const attemptCount = await attemptDao.countAttempts(quizId, currentUser._id);
        const questions = await questionDao.findQuestionsForQuiz(quizId);
        const answers = req.body.answers || [];
        let score = 0;
        for (const a of answers) {
            const q = questions.find((q) => q._id.toString() === a.question);
            if (!q) continue;
            if (q.type === "MULTIPLE_CHOICE") {
                const correctChoice = q.choices.find((c) => c.isCorrect);
                if (correctChoice && a.answer === correctChoice.text) {
                    score += q.points;
                }
            } else if (q.type === "TRUE_FALSE") {
                if (a.answer === q.correctAnswer) {
                    score += q.points;
                }
            } else if (q.type === "FILL_IN_BLANK") {
                const correct = q.blanks.some(
                    (b) => b.text.toLowerCase().trim() === String(a.answer).toLowerCase().trim()
                );
                if (correct) {
                    score += q.points;
                }
            }
        }
        const attempt = {
            quiz: quizId,
            user: currentUser._id,
            answers,
            score,
            attemptNumber: attemptCount + 1,
        };
        const newAttempt = await attemptDao.createAttempt(attempt);
        res.json(newAttempt);
    });
}