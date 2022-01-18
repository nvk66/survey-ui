import universityData from "../types/universityData";
import instance from "./api.service";
import UniversityData from "../types/universityData";

const uniPath = '/university/'

const get = () => {
    return instance.get<universityData[]>(uniPath);
}

const add = (university: UniversityData) => {
    return instance.post<universityData>(uniPath, university);
}

const getById = (universityId: any) => {
    return instance.get<universityData>(uniPath + universityId);
}

const UniversityService = {
    get,
    add,
    getById
};

export default UniversityService;
