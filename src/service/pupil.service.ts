import pupilData from "../types/pupilData";
import instance from "./api.service";
import {generatePath} from "react-router"

const add = (pupil: pupilData, groupId: any) => {
    return instance.post<pupilData>(generatePath('pupils/:groupId/', {
        groupId: groupId,
    }), pupil);
}

const PupilService = {
    add
};

export default PupilService;
