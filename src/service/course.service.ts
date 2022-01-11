import instance from "./api.service";
import CourseData from "../types/courseData";
import {generatePath} from "react-router";

const add = (course: CourseData) => {
    return instance.post<CourseData>('course/', course);
}

const get = (courseId: any) => {
    return instance.get<CourseData>(generatePath('course/:courseId', {
        courseId: courseId
    }))
}

const CourseService = {
    add,
    get,
};

export default CourseService;
