import instance from "./api.service";
import SurveyData from "../types/surveyData";
import {generatePath} from "react-router";
import SurveyDataInfo from "../types/surveyDataInfo";
import ResultData from "../types/resultData";

const add = (survey: SurveyData) => {
    return instance.post<SurveyData>('surveys/', survey);
}

const get = (surveyId: any) => {
    return instance.get<SurveyData>(generatePath('surveys/:surveyId/', {
        surveyId: surveyId,
    }));
}

const getSurveys = (status: any) => {
    return instance.get<SurveyDataInfo[]>(generatePath('surveys/search/:status/', {
        status: status,
    }));
}

const getSurveysForTeacher = () => {
    return instance.get<SurveyDataInfo[]>('surveys/search/teacher/pre/');
}

const getResult = (permissionId: any) => {
    return instance.get<ResultData[]>(generatePath('surveys/:permissionId/', {
        permissionId: permissionId,
    }));
}

const SurveyService = {
    add,
    get,
    getSurveys,
    getSurveysForTeacher,
    getResult
};

export default SurveyService;
