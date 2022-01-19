import React, {Component, useEffect, useState} from "react";
import {Route, RouteComponentProps} from "react-router-dom";
import NotFound from "../component/common/not.found.component";
import TokenService from "../service/token.service";
import AuthService from "../service/auth.service";

interface Props {
    Component: React.FC<RouteComponentProps>;
    path: string;
    exact?: boolean;
    requiredRoles: string;
}

const RoleBasedRouting = ({Component, path, exact = false, requiredRoles}: Props): JSX.Element => {
    const isAuthed = !!TokenService.getUser();

    const [userRole, setUserRole] = useState<string[]>([]);

    useEffect(() => {
        setUserRole(AuthService.getCurrentUser().roles);
    }, []);

    const userHasRequiredRole = userRole.includes(requiredRoles);

    return (
        <Route
            exact={exact}
            path={path}
            render={(props: RouteComponentProps) =>
                isAuthed && userHasRequiredRole ? (
                    <Component {...props} />
                ) : (
                    <NotFound/>
                )
            }
        />
    );
};

export default RoleBasedRouting;
