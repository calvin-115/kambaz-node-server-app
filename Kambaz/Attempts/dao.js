import AttemptModel from "./model.js";

export function findAttemptsForQuiz(quizId, userId) {
    return AttemptModel.find({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
}

export function findLatestAttempt(quizId, userId) {
    return AttemptModel.findOne({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
}

export function countAttempts(quizId, userId) {
    return AttemptModel.countDocuments({ quiz: quizId, user: userId });
}

export function createAttempt(attempt) {
    return AttemptModel.create(attempt);
}

export function deleteAttemptsForQuiz(quizId) {
    return AttemptModel.deleteMany({ quiz: quizId });
}