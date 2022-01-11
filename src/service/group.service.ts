import instance from "./api.service";
import GroupData from "../types/groupData";
import {generatePath} from "react-router";

const groupPath = (universityId: any) => {
    return generatePath('groups/:universityId/', {
        universityId: universityId,
    });
}

const add = (group: GroupData, universityId: any) => {
    return instance.post<GroupData>(groupPath(universityId), group);
}

const getByUniversity = (universityId: any) => {
    return instance.get<GroupData[]>(groupPath(universityId));
}

const GroupService = {
    add,
    getByUniversity
};

export default GroupService;
