import instance from "./api.service";
import SubjectData from "../types/subjectData";
import {generatePath} from "react-router";

const commonSubjectPath = (universityId: any) => {
    return generatePath('subject/:universityId/', {
        universityId: universityId,
    });
}

const add = (subject: SubjectData, universityId: any) => {
    return instance.post<SubjectData>(commonSubjectPath(universityId), subject);
}

const getByUniversity = (universityId: any) => {
    return instance.get<SubjectData[]>(commonSubjectPath(universityId));
}

const SubjectService = {
    add,
    getByUniversity
};

export default SubjectService;
