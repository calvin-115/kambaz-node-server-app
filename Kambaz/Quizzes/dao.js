import QuizModel from "./model.js";

export function findQuizzesForCourse(courseId) {
    return QuizModel.find({ course: courseId }).sort({ availableDate: 1 });
}

export function findQuizById(quizId) {
    return QuizModel.findById(quizId);
}

export function createQuiz(quiz) {
    return QuizModel.create(quiz);
}

export function updateQuiz(quizId, quizUpdates) {
    return QuizModel.updateOne({ _id: quizId }, { $set: quizUpdates });
}

export function deleteQuiz(quizId) {
    return QuizModel.deleteOne({ _id: quizId });
}