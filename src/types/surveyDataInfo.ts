import SubjectData from "./subjectData";
import TeacherData from "./teacherData";
import GroupData from "./groupData";

export default interface SurveyDataInfo {
    id?: number | null,
    name: string,
    createdDate?: string,
    type: string,
    subject: SubjectData,
    teacher: TeacherData,
    group: GroupData,
    permissionId: number,
}
