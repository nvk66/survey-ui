import teacherData from "../types/teacherData";
import instance from "./api.service";
import { generatePath } from "react-router"

const add = (teacher: teacherData, universityId: any) => {
    return instance.post<teacherData>(generatePath('teacher/:universityId/', {
        universityId: universityId,
    }), teacher);
}

const TeacherService = {
    add
};

export default TeacherService;
