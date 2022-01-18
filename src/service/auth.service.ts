import instance from "./api.service";
import loginDada from "../types/loginData"
import userData from "../types/userData"
import registrationData from "../types/registrationData"

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

const login = (auth: loginDada) => {
    return instance
        .post<userData>('login', {
            login: auth.login,
            password: auth.password
        })
        .then(response => {
            if (response.data.accessToken) {
                const parsedToken = parseJwt(response.data.accessToken)
                const user = {
                    login: parsedToken.sub,
                    roles: parsedToken.roles,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    university: response.data.university,
                    expireDataAccessToken: parsedToken.exp
                }
                console.log(user);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        });
}

const signUp = (auth: registrationData, id: any) => {
    return instance.post<registrationData>('signup/' + id, auth);
}

const logout = () => {
    localStorage.removeItem('user');
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user') as string);
}

const AuthService = {
    getCurrentUser,
    logout,
    login,
    parseJwt,
    signUp
};

export default AuthService;


