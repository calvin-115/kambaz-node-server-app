import QuestionModel from "./model.js";

export function findQuestionsForQuiz(quizId) {
    return QuestionModel.find({ quiz: quizId });
}

export function findQuestionById(questionId) {
    return QuestionModel.findById(questionId);
}

export function createQuestion(question) {
    return QuestionModel.create(question);
}

export function updateQuestion(questionId, questionUpdates) {
    return QuestionModel.updateOne({ _id: questionId }, { $set: questionUpdates });
}

export function deleteQuestion(questionId) {
    return QuestionModel.deleteOne({ _id: questionId });
}

export function deleteQuestionsForQuiz(quizId) {
    return QuestionModel.deleteMany({ quiz: quizId });
}