import instance from "./api.service";
import SurveyData from "../types/surveyData";
import {generatePath} from "react-router";

const add = (survey: SurveyData) => {
    return instance.post<SurveyData>('surveys/', survey);
}

const get = (surveyId: any) => {
    return instance.get<SurveyData>(generatePath('surveys/:surveyId/', {
        surveyId: surveyId,
    }));
}

const SurveyService = {
    add,
    get
};

export default SurveyService;
