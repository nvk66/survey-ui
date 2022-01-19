import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import {useHistory, useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import SurveyService from "../../service/survey.service";
import SurveyData from "../../types/surveyData";
import CategoryService from "../../service/category.service";
import CategoryData from "../../types/categoryData";
import QuestionService from "../../service/question.service";
import QuestionData from "../../types/questionData";
import {Rating} from "@mui/material";
import AnswerData from "../../types/answerData";
import AnswerService from "../../service/answer.service";
import CourseService from "../../service/course.service";
import CourseData from "../../types/courseData";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const theme = createTheme();

const getSurvey = async (surveyId: any) => {
    return await SurveyService.get(surveyId);
}

const getAllCategories = async (surveyId: any) => {
    return await CategoryService.get(surveyId);
}

const getQuestions = async (surveyId: any, categoryId: any) => {
    return await QuestionService.getAllByCategory(surveyId, categoryId);
}

const addAnswers = async (answers: AnswerData[], surveyId: any, permissionId: any) => {
    return await AnswerService.addSurveyAnswer(answers, surveyId, permissionId);
}

const getCourse = async (courseId: any) => {
    return await CourseService.get(courseId);
}

const renderTitle = (course?: CourseData, survey?: SurveyData) => {
    if (survey?.type === 'SURVEY') {
        return (
            <Typography component="h1" variant="h5">
                Пройти опрос «{survey?.name}» по предмету: «{course?.subject?.name}» c преподавателем: «{course?.teacher?.lastName} {course?.teacher?.firstName} {course?.teacher?.patronymic}»
            </Typography>
        );
    } else {
        return (
            <Typography component="h1" variant="h5">
                Пройти опрос «{survey?.name}»
            </Typography>
        );
    }
}

const renderQuestions = (questions: QuestionData[],
                         categories: CategoryData[],
                         answers: AnswerData[],
                         callBack: (questionId: number, value: number | string | null, isValue: boolean) => void) => {
    return categories.map(category => {
        return (
            <>
                <Grid item xs={12} sm={12}>
                    <Typography component="h1" variant="h5">
                        Категория: «{category.name}»
                    </Typography>
                </Grid>
                {renderAnswers(questions.filter(q => q.categoryId === category.id), answers, callBack)}
            </>
        );
    });
}

const renderAnswers = (questions: QuestionData[],
                       answers: AnswerData[],
                       callBack: (questionId: number, value: number | string | null, isValue: boolean) => void) => {
    return questions.map(question => {
        return (
            <>
                <Grid item xs={12} sm={12} sx={{ml: 3}}>
                    <Typography component="h1" variant="h5">
                        Вопрос: «{question.name}»
                    </Typography>
                </Grid>
                {renderAnswer(question, answers.filter(a => a.questionId === question.id)[0], callBack)
                }
            </>
        );
    })
}

const renderAnswer = (question: QuestionData,
                      answer: AnswerData,
                      callBack: (questionId: number, value: number | string | null, isValue: boolean) => void) => {
    return (
        <Grid item xs={12} sm={12}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 6,
                }}
            >
                {(question.type === 'RATE_5' || question.type === 'RATE_10') ?
                    (
                        <>
                            <Rating
                                id={`question${question.id}Answer`}
                                name={`question${question.id}Answer`}
                                value={answer?.value}
                                onChange={(event, newValue) => {
                                    callBack(Number(question.id), newValue, true);
                                }}
                                max={question.type === 'RATE_5' ? 5 : 10}
                            />
                        </>
                    ) : (
                        <>
                            <TextField
                                label="Введите ответ"
                                required
                                fullWidth
                                multiline
                                rows={5}
                                onChange={(event) => {
                                    callBack(Number(question.id), event.target.value, false);
                                }}
                            />
                        </>
                    )
                }
            </Box>
        </Grid>
    );
}

export default function SurveyViewComponent() {
    const history = useHistory();
    const { surveyId, permissionId } = useParams<{ surveyId: string, permissionId: string }>();

    const [survey, setSurvey] = useState<SurveyData>();
    const [course, setCourse] = useState<CourseData>()
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [questions, setQuestions] = useState<QuestionData[]>([]);
    const [answers, setAnswers] = useState<AnswerData[]>([]);

    useEffect(() => {
        getSurvey(surveyId).then(response => {
            console.log(response.data);
            setSurvey(response.data);
        });
        getAllCategories(surveyId).then(response => {
            console.log(response.data);
            setCategories(response.data);
        });
        getCourse(permissionId).then(response => {
            console.log(response.data);
            setCourse(response.data);
        });
    }, [surveyId, permissionId]);

    useEffect(() => {
        categories.forEach(category => {
            console.log(category);
            getQuestions(surveyId, category.id).then(response => {
                console.log(response.data);
                response.data.forEach(r => {
                    setQuestions(q => [...q, r]);
                    const answer: AnswerData = {
                        questionId: Number(r.id)
                    };
                    console.log(answer);
                    setAnswers(a => [...a, answer]);
                })
            })
        })
    }, [categories, surveyId, permissionId]);

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(answers);

        addAnswers(answers, surveyId, permissionId).then(response => {
            history.push('/surveys');
        }).catch(e => {
            console.log("Не всё идёт по плану! " + JSON.stringify(e));
        });

        setMessage('');
        setLoading(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <AddCircleOutlineIcon/>
                    </Avatar>
                    {renderTitle(course, survey)}
                    <Box component="form" onSubmit={handleSubmit} noValidate
                         sx={{mt: 1}}>
                        <Grid container spacing={2}>
                            {
                                renderQuestions(questions,
                                    categories,
                                    answers, (questionId, value, isValue) => {
                                    isValue ?
                                        (answers.filter(a => a.questionId === questionId)[0].value = Number(value)) :
                                        (answers.filter(a => a.questionId === questionId)[0].text = String(value));
                                    })
                            }
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            color="secondary"
                        >
                            Подтвердить ответ
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
