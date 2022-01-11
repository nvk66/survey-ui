import React, {Component} from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import {Route, Switch} from "react-router-dom";
import AuthService from "./service/auth.service";
import UserData from './types/userData';

import Login from "./component/auth/login.component";

import EventBus from "./common/EventBus";
import SignIn from "./component/auth/test.login.component";
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

type Props = {};

type State = {
    hasAccess: boolean,
    currentUser: UserData | undefined
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            hasAccess: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: {
                    login: user.login,
                    roles: user.roles,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken
                },
                hasAccess: user.roles.includes(''), //todo добавить список ролей
                // showLogout: true
            });
        }

        EventBus.on("logout", this.logOut);
    }

    componentWillUnmount() {
        EventBus.remove("logout", this.logOut);
    }

    logOut() {
        AuthService.logout();
        this.setState({
            hasAccess: false,
            currentUser: undefined,
        });
    }

    render() {
        const {currentUser, hasAccess} = this.state;

        return (
            <div>
                {currentUser ?
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        {/*<Link to="/" className="navbar-brand">*/}
                        {/*    неВсеПлатежи*/}
                        {/*</Link>*/}
                        {/*<div className="navbar-nav mr-auto">*/}
                        {/*    <li className="nav-item">*/}
                        {/*        <Link to="/home" className="nav-link">*/}
                        {/*            Home*/}
                        {/*        </Link>*/}
                        {/*    </li>*/}
                        {/*</div>*/}

                        {/*<div className="navbar-nav ml-auto">*/}
                        {/*    <li className="nav-item">*/}
                        {/*        {currentUser ? (*/}
                        {/*            <a href="/login" className="nav-link" onClick={this.logOut}>*/}
                        {/*                LogOut*/}
                        {/*            </a>*/}
                        {/*        ) : (*/}
                        {/*            <a href="/login" className="nav-link" onClick={this.logOut}>*/}
                        {/*                LogOut*/}
                        {/*            </a>)*/}
                        {/*        }*/}
                        {/*    </li>*/}
                        {/*</div>*/}
                    </nav> : (<div/>)
                }

                <div className="container mt-3">
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/testLogin" component={SignIn}/>
                        <Route exact path="/registration" component={Registration}/>
                        <Route exact path="/university" component={UniversityComponent}/>
                        <Route exact path="/group" component={GroupComponent}/>
                        <Route exact path="/subject" component={SubjectComponent}/>
                        <Route exact path="/registration/type" component={UserTypeSelectorComponent}/>
                        <Route exact path="/:id/course" component={CourseComponent}/>
                        <Route exact path="/survey" component={SurveyComponent}/>
                        <Route exact path="/survey/:id" component={ManageSurveyComponent}/>
                        <Route exact path="/survey/:id/category" component={CategoryComponent}/>
                        <Route exact path="/survey/:surveyId/category/:categoryId" component={ManageCategoryComponent}/>
                        <Route exact path="/survey/:surveyId/category/:categoryId/question"
                               component={QuestionComponent}/>
                        <Route exact path="/handle/survey/:surveyId/:courseId" component={SurveyViewComponent}/>
                        {/*<Route exact path="/merchant" component={Merchant}/>*/}
                        {/*<Route exact path="/merchantTable" component={MerchantsTable}/>*/}
                        {/*<Route exact path="/providerTable" component={ProvidersTable}/>*/}
                        {/*<Route exact path="/provider" component={Provider}/>*/}
                    </Switch>
                </div>

                {/*{<AuthVerify logOut={this.logOut}/>}*/}
            </div>
        );
    }
}

export default App;
