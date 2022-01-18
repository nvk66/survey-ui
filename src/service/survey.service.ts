import instance from "./api.service";
import SurveyData from "../types/surveyData";
import {generatePath} from "react-router";
import SurveyDataInfo from "../types/surveyDataInfo";

const add = (survey: SurveyData) => {
    return instance.post<SurveyData>('surveys/', survey);
}

const get = (surveyId: any) => {
    return instance.get<SurveyData>(generatePath('surveys/:surveyId/', {
        surveyId: surveyId,
    }));
}

const getSurveys = (status: any) => {
    return instance.get<SurveyDataInfo[]>(generatePath('surveys/:status/', {
        status: status,
    }));
}

const SurveyService = {
    add,
    get,
    getSurveys
};

export default SurveyService;
