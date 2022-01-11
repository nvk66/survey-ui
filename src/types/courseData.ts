import GroupData from "./groupData";
import SubjectData from "./subjectData";
import TeacherData from "./teacherData";

export default interface CourseData {
    id?: number | null,
    groupId: number,
    subjectId: number,
    teacherId: number,
    since: string,
    till: string,
    hours: number,
    group?: GroupData,
    subject?: SubjectData,
    teacher?: TeacherData
}
