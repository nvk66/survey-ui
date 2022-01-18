import UniversityData from "./universityData";

export default interface UserInfoData {
    id?: any | null,
    login?: string | null,
    email?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    patronymic?: string | null,
    confirmed?: boolean | null,
    university?: UniversityData | null,
    roles?: Array<string>
}