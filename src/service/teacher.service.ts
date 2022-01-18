import teacherData from "../types/teacherData";
import instance from "./api.service";
import { generatePath } from "react-router"
import TokenService from "./token.service";

const teacherPath = (universityId: any) => {
    return generatePath('teacher/:universityId/', {
        universityId: universityId,
    })
}

const add = (teacher: teacherData) => {
    return instance.post<teacherData>(teacherPath(TokenService.getUser().universityId), teacher);
}

const getByUniversity = (universityId: any) => {
    return instance.get<teacherData[]>(teacherPath(universityId));
}

const TeacherService = {
    add,
    getByUniversity
};

export default TeacherService;
