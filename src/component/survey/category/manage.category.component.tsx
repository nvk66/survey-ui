import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../../common/copyright.component";
import {useHistory, useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import SurveyData from "../../../types/surveyData";
import SurveyService from "../../../service/survey.service";
import CategoryService from "../../../service/category.service";
import CategoryData from "../../../types/categoryData";
import Link from "@mui/material/Link";
import {generatePath} from "react-router";
import QuestionService from "../../../service/question.service";
import QuestionData from "../../../types/questionData";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const getSurvey = async (surveyId: any) => {
    return await SurveyService.get(surveyId);
}

const getCategory = async (categoryId: any) => {
    return await CategoryService.getById(categoryId);
}

const getQuestions = async (surveyId: any, categoryId: any) => {
    return await QuestionService.getAllByCategory(surveyId, categoryId);
}

const removeQuestion = async (questionId: any) => {
    return await QuestionService.remove(questionId);
}

const theme = createTheme();

const renderElements = (question: QuestionData, onClick: () => void) => {
    return (
        <>
            <Grid item xs={12} sm={6}>
                Вопрос: {question.name}
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" align="center">
                    <Link
                        color="secondary"
                        onClick={onClick}
                    >
                        Убрать вопроc
                    </Link>
                </Typography>
            </Grid>
        </>
    );
}

export default function ManageCategoryComponent() {
    const history = useHistory();
    const {surveyId, categoryId} = useParams<{ surveyId: string, categoryId: string }>();

    const [survey, setSurvey] = useState<SurveyData>();
    const [category, setCategory] = useState<CategoryData>();
    const [questions, setQuestions] = useState<QuestionData[]>([]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        getSurvey(surveyId).then(response => {
            console.log(response.data);
            setSurvey(response.data);
        });
        getCategory(categoryId).then(response => {
            setCategory(response.data);
        })
        getQuestions(surveyId, categoryId).then(response => {
            setQuestions(response.data);
        })
    }, []);

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

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
                    <Typography component="h1" variant="h5">
                        Управлять категорией «{category?.name}» для опроса «{survey?.name}»
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate
                         sx={{mt: 1}}>
                        <Collapse in={open}>
                            <Alert
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                severity="error"
                                sx={{ mb: 2 }}
                            >
                                {message}
                            </Alert>
                        </Collapse>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    <Link
                                        color="secondary"
                                        onClick={() => {
                                            history.push(generatePath('/survey/:surveyId/category/:categoryId/question', {
                                                surveyId: surveyId,
                                                categoryId: categoryId
                                            }));
                                        }}
                                    >
                                        Добавить вопрос?
                                    </Link>
                                </Typography>

                            </Grid>
                            <>
                                {questions.map((question) => {
                                    return renderElements(question, () => {
                                        removeQuestion(question.id).then(response => {
                                            if (response.status === 204) {
                                                history.go(0);
                                            } else {
                                                setMessage("Не возможно удалить вопрос.");
                                                setOpen(true);
                                            }
                                        }).catch(e => {
                                            console.log("Не всё идёт по плану! " + JSON.stringify(e));
                                            setOpen(true);
                                        });
                                        // history.push(generatePath('/survey/:surveyId/category/:categoryId', {
                                        //     surveyId: surveyId,
                                        //     categoryId: Number(question?.id)
                                        // }));
                                    })
                                })}
                            </>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
