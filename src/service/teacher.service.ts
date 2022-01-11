import teacherData from "../types/teacherData";
import instance from "./api.service";
import { generatePath } from "react-router"

const teacherPath = (universityId: any) => {
    return generatePath('teacher/:universityId/', {
        universityId: universityId,
    })
}

const add = (teacher: teacherData, universityId: any) => {
    return instance.post<teacherData>(teacherPath(universityId), teacher);
}

const getByUniversity = (universityId: any) => {
    return instance.get<teacherData[]>(teacherPath(universityId));
}

const TeacherService = {
    add,
    getByUniversity
};

export default TeacherService;
