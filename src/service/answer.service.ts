import instance from "./api.service";
import {generatePath} from "react-router";
import AnswerData from "../types/answerData";

const answerData = (surveyId: any) => {
    return generatePath('answers/survey/:surveyId/', {
        surveyId: surveyId,
    });
}

const addSurveyAnswer = (answers: AnswerData[], surveyId: any) => {
    return instance.post<AnswerData>(answerData(surveyId), answers);
}

const AnswerService = {
    addSurveyAnswer
};

export default AnswerService;
