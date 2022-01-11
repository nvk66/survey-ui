import instance from "./api.service";
import {generatePath} from "react-router";
import QuestionData from "../types/questionData";

const questionPath = (surveyId: any, categoryId: any) => {
    return generatePath('questions/survey/:surveyId/category/:categoryId', {
        surveyId: surveyId,
        categoryId: categoryId
    })
}

const getAllByCategory = (surveyId: any, categoryId: any) => {
    return instance.get<QuestionData[]>(questionPath(surveyId, categoryId));
}

const add = (surveyId: any, categoryId: any, question: QuestionData) => {
    return instance.post<QuestionData>(questionPath(surveyId, categoryId), question);
}

const remove = (questionId: any) => {
    return instance.delete(generatePath('questions/:questionId', {
        questionId: questionId
    }));
}

const QuestionService = {
    add,
    getAllByCategory,
    remove
};

export default QuestionService;
