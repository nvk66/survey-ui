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
import CopyrightComponent from "../../common/copyright.component";
import {useHistory, useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import SurveyService from "../../../service/survey.service";
import SurveyData from "../../../types/surveyData";
import CategoryService from "../../../service/category.service";
import CategoryData from "../../../types/categoryData";
import QuestionService from "../../../service/question.service";
import QuestionData from "../../../types/questionData";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const addQuestion = async (surveyId: any, categoryId: any, question: QuestionData) => {
    return await QuestionService.add(surveyId, categoryId, question);
}

const theme = createTheme();

const getSurvey = async (surveyId: any) => {
    return await SurveyService.get(surveyId);
}

const getCategory = async (categoryId: any) => {
    return await CategoryService.getById(categoryId);
}

export default function QuestionComponent() {
    const history = useHistory();
    const {surveyId, categoryId} = useParams<{ surveyId: string, categoryId: string }>();

    const [survey, setSurvey] = useState<SurveyData>();
    const [category, setCategory] = useState<CategoryData>();

    const [type, setType] = useState('');

    useEffect(() => {
        getSurvey(surveyId).then(response => {
            console.log(response.data);
            setSurvey(response.data);
        });
        getCategory(categoryId).then(response => {
            console.log(response.data);
            setCategory(response.data);
        });
    }, [surveyId, categoryId]);

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const question: QuestionData = {
            name: String(data.get('questionName')),
            type: type
        }

        addQuestion(surveyId, categoryId, question).then(response => {
            history.push('/groups');
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
                    <Typography component="h1" variant="h5">
                        Добавить вопрос для опроса «{survey?.name}» в категорию «{category?.name}»
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate
                         sx={{mt: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="questionName"
                                    name="questionName"
                                    required
                                    fullWidth
                                    id="questionName"
                                    label="Название"
                                    autoFocus
                                    color="secondary"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth required color="secondary" margin="normal">
                                    <InputLabel id="typeLabel">Тип опроса</InputLabel>
                                    <Select
                                        labelId="typeLabel"
                                        id="type"
                                        value={type}
                                        label="Тип опроса"
                                        onChange={(event) => {
                                            setType(event.target.value as string);
                                        }}
                                    >
                                        <MenuItem value={'RATE_5'}>Оценка от 1 до 5</MenuItem>
                                        <MenuItem value={'RATE_10'}>Оценка от 1 до 10</MenuItem>
                                        <MenuItem value={'FREE_FORM'}>Ответ в свободной форме</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Добавить
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
