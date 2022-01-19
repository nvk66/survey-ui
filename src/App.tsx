import React, {useEffect, useState} from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import {Route, Switch} from "react-router-dom";
import AuthService from "./service/auth.service";
import UserData from './types/userData';
import SignIn from "./component/auth/login.component";
import Registration from "./component/auth/registration.component";
import UserTypeSelectorComponent from "./component/auth/user.type.selector.component";
import UniversityComponent from "./component/university/university.component";
import GroupComponent from "./component/university/group/group.component";
import SubjectComponent from "./component/university/subject/subject.componet";
import CourseComponent from "./component/university/course/course.component";
import SurveyComponent from "./component/survey/survey.component";
import ManageSurveyComponent from "./component/survey/manage.survey.component";
import CategoryComponent from "./component/survey/category/category.component";
import QuestionComponent from "./component/survey/question/question.component";
import SurveyViewComponent from "./component/survey/survey.view.component";
import ManageCategoryComponent from "./component/survey/category/manage.category.component";
import NotFound from "./component/common/not.found.component";
import ProfileComponent from "./component/profile/profile.component";
import UserManagementComponent from "./component/manangement/user.management.component";
import RoleBasedRouting from "./common/RoleBasedRouting";
import InfoComponent from "./component/common/InfoComponent";
import {Box, Container, Divider, Drawer, Link, List, ListItem, ListItemText} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import TeacherProfileComponent from "./component/profile/teacher.profile.component";

export default function App() {

    const theme = createTheme();

    const [currentUser, setCurrentUser] = useState<UserData>();

    const [state, setState] = useState(false);

    useEffect(() => {
        setCurrentUser(AuthService.getCurrentUser());
        // setCurrentUser(TokenService.getCurrentUser());
    }, []);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState(open);
        setCurrentUser(undefined);
    };

    const logOut = () => {
        AuthService.logout();
    }

    const list = (roles: string[] | undefined) => (
        <Box
            sx={{width: 250}}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <>
                {roles?.includes("ROLE_ADMINISTRATOR") ? (
                    <>
                        <List>
                            {['Университет'].map((text, index) => (
                                <ListItem button key={text}>
                                    <Link>

                                    </Link>
                                    <ListItemText primary={text}/>
                                </ListItem>
                            ))}
                        </List>
                        <Divider/>
                    </>
                ) : (
                    <>
                    </>
                )}
                {roles?.includes("ROLE_UNIVERSITY_ADMINISTRATOR") ? (
                    <>
                        <List>
                            <ListItem button key='Добавить группу'>
                                <Link href="/group">
                                    Добавить группу
                                </Link>
                            </ListItem>
                            <ListItem button key='Добавить курс'>
                                <Link href="/course">
                                    Добавить курс
                                </Link>
                            </ListItem>
                            <ListItem button key='Добавить предмет'>
                                <Link href="/subject">
                                    Добавить предмет
                                </Link>
                            </ListItem>
                        </List>
                    </>
                ) : (
                    <>
                    </>
                )}

                {roles?.includes("ROLE_TEACHER") ? (
                    <>
                        <List>
                            <ListItem button key='Добавить опрос'>
                                <Link href="/survey">
                                    Добавить опрос
                                </Link>
                            </ListItem>
                            <ListItem button key='Созданные опросы'>
                                <Link href="/survey/created" onClick={(e)=> {e.preventDefault();}}>
                                    Созданные опросы
                                </Link>
                            </ListItem>
                        </List>
                        <Divider/>
                    </>
                ) : (
                    <>
                    </>
                )}

                {roles?.includes("ROLE_PUPIL") ? (
                    <>
                        <List>
                            <ListItem button key='Доступные опросы'>
                                <Link href="/surveys">
                                    Доступные опросы
                                </Link>
                            </ListItem>
                        </List>
                        <Divider/>
                    </>
                ) : (
                    <>
                    </>
                )}

                {roles?.includes("ROLE_USER_NOT_CONFIRMED") ? (
                    <>
                        <List>
                            <ListItem button key='Окончание регистрации'>
                                <Link href="/registration/type">
                                    Окончание регистрации
                                </Link>
                            </ListItem>
                        </List>
                        <Divider/>
                    </>
                ) : (
                    <>
                    </>
                )}
            </>

        </Box>
    );


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline/>
                <div>
                    <Drawer
                        anchor="left"
                        open={state}
                        onClose={toggleDrawer(false)}
                    >
                        {list(currentUser?.roles)}
                    </Drawer>
                </div>
                <div>
                    <Box
                        sx={{
                            marginTop: 0,
                            width: 1200,
                            height: 30,
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            typography: 'body1',
                            '& > :not(style) + :not(style)': {
                                ml: 1,
                            },
                        }}
                    >
                        <div>
                            <Link href="/" className="nav-link" color="inherit">
                                Проведение опросов
                            </Link>
                        </div>
                        {currentUser ? (
                            <>
                                <div>
                                    <Link href="/" className="nav-link" color="inherit"
                                          onClick={(e) => {
                                              e.preventDefault();
                                              setState(true);
                                          }}>
                                        Меню
                                    </Link>
                                </div>
                                <div className="ml-5 mr-0">
                                    <Link href="/" className="nav-link" color="inherit" onClick={logOut}>
                                        Выйти?
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="ml-5">
                                    <Link href="/login" className="nav-link" color="inherit">
                                        Войти
                                    </Link>
                                </div>
                                <div className="ml-5">
                                    <Link href="/registration" className="nav-link" color="inherit">
                                        Зарегистрироваться
                                    </Link>
                                </div>
                            </>
                        )}
                    </Box>

                    <div className="container mt-3">
                        <Switch>
                            <Route exact path="/" component={InfoComponent}/>
                            <Route exact path="/login" component={SignIn}/>
                            <Route exact path="/registration" component={Registration}/>
                            <RoleBasedRouting
                                Component={UserTypeSelectorComponent}
                                path="/registration/type"
                                requiredRoles="ROLE_USER_NOT_CONFIRMED"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={UniversityComponent}
                                path="/university"
                                requiredRoles="ROLE_ADMINISTRATOR"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={GroupComponent}
                                path="/group"
                                requiredRoles="ROLE_UNIVERSITY_ADMINISTRATOR"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={SubjectComponent}
                                path="/subject"
                                requiredRoles="ROLE_UNIVERSITY_ADMINISTRATOR"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={CourseComponent}
                                path="/course"
                                requiredRoles="ROLE_UNIVERSITY_ADMINISTRATOR"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={UserManagementComponent}
                                path="/handle/survey/:surveyId/:permissionId"
                                requiredRoles="ROLE_UNIVERSITY_ADMINISTRATOR"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={SurveyComponent}
                                path="/survey"
                                requiredRoles="ROLE_TEACHER"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={ManageSurveyComponent}
                                path="/survey/:id"
                                requiredRoles="ROLE_TEACHER"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={CategoryComponent}
                                path="/survey/:id/category"
                                requiredRoles="ROLE_TEACHER"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={ManageCategoryComponent}
                                path="/survey/:surveyId/category/:categoryId"
                                requiredRoles="ROLE_TEACHER"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={QuestionComponent}
                                path="/survey/:surveyId/category/:categoryId/question"
                                requiredRoles="ROLE_TEACHER"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={TeacherProfileComponent}
                                path="teacher/surveys"
                                requiredRoles="ROLE_TEACHER"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={TeacherProfileComponent}
                                path="/survey/result/:surveyId/:permission"
                                requiredRoles="ROLE_TEACHER"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={ProfileComponent}
                                path="/surveys"
                                requiredRoles="ROLE_PUPIL"
                                exact={true}
                            />
                            <RoleBasedRouting
                                Component={SurveyViewComponent}
                                path="/handle/survey/:surveyId/:permissionId"
                                requiredRoles="ROLE_PUPIL"
                                exact={true}
                            />
                            <Route component={NotFound}/>
                        </Switch>
                    </div>

                    {/*{<AuthVerify logOut={this.logOut}/>}*/}
                </div>
            </Container>
        </ThemeProvider>
    );
}
