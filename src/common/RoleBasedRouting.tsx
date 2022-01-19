import React, {Component, useState} from "react";
import {Route, RouteComponentProps} from "react-router-dom";
import NotFound from "../component/common/not.found.component";
import TokenService from "../service/token.service";

interface RoleBasedRoutingInterface {
    component: () => JSX.Element;
    role: string;
    rest: any;
}

// const RoleBasedRouting: React.FC<RoleBasedRoutingInterface> = ({
//                                                                    component,
//                                                                    role,
//                                                                    ...rest
//                                                                }) => {
//
//     const grantPermission = (requestedRoles: string) => {
//         const permittedRoles = TokenService.getUser().roles;
//         return requestedRoles.includes(permittedRoles);
//         // in case of multiple roles, if one of the permittedRoles is present in requestedRoles, return true;
//     };
//
//     return (
//         <>
//             {grantPermission(role) && (
//                 <Route
//                     {...rest}
//                     render={(props) => (
//                         <>
//                             {component}
//                         </>
//                     )}
//                 />
//             )}
//             {
//                 !grantPermission(role) && (
//                     <Route
//                         render={() => (
//                             <>
//                                 <NotFound/>
//                             </>
//                         )}
//                     />
//                 )
//             }
//         </>
//     );
// }

interface Props {
    Component: React.FC<RouteComponentProps>;
    path: string;
    exact?: boolean;
    requiredRoles: string;
}

const RoleBasedRouting = ({Component, path, exact = false, requiredRoles}: Props): JSX.Element => {
    const isAuthed = !!TokenService.getUser();
    const userRole = useState(TokenService.getUser().role);
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
