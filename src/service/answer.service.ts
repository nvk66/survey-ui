import instance from "./api.service";
import {generatePath} from "react-router";
import AnswerData from "../types/answerData";

const answerData = (surveyId: any, permissionId: any) => {
    return generatePath('answers/survey/:surveyId/:permissionId', {
        surveyId: surveyId,
        permissionId: permissionId,
    });
}

const addSurveyAnswer = (answers: AnswerData[], surveyId: any, permissionId: any) => {
    return instance.post<AnswerData>(answerData(surveyId, permissionId), answers);
}

const AnswerService = {
    addSurveyAnswer
};

export default AnswerService;
