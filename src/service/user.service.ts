import instance from "./api.service";
import UserData from "../types/userData";

const userPath = '/api/users/'

const get = (request: string) => {
    return instance.get<{
        content: UserData[],
        empty: boolean,
        first: boolean,
        last: boolean,
        number: number,
        numberOfElements: number,
        totalElements: number,
        totalPages: number,
    }>(userPath + request);
}

const confirm = (id: any) => {
    return instance.post(userPath + id);
}

const confirmAll = () => {
    return instance.post(userPath);
}

const UserService = {
    get,
    confirm,
    confirmAll
};

export default UserService;
