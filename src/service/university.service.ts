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

const UniversityService = {
    get,
    add
};

export default UniversityService;
