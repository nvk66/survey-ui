import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import {useHistory, useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import SurveyData from "../../types/surveyData";
import SurveyService from "../../service/survey.service";
import CategoryService from "../../service/category.service";
import CategoryData from "../../types/categoryData";
import Link from "@mui/material/Link";
import {generatePath} from "react-router";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const getSurvey = async (surveyId: any) => {
    return await SurveyService.get(surveyId);
}

const getCategories = async (surveyId: any) => {
    return await CategoryService.get(surveyId);
}

const theme = createTheme();

const renderElements = (category: CategoryData, onClick: () => void) => {
    return (
        <>
            <Grid item xs={12} sm={6}>
                Название: {category.name}
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" align="center">
                    <Link
                        color="secondary"
                        onClick={onClick}
                    >
                        Управлять категорией
                    </Link>
                </Typography>
            </Grid>
        </>
    );
}

export default function ManageSurveyComponent() {
    const history = useHistory();
    const {id} = useParams<{ id: string }>();

    const [survey, setSurvey] = useState<SurveyData>();
    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        getSurvey(id).then(response => {
            console.log(response.data);
            setSurvey(response.data);
        });
        getCategories(id).then(response => {
            setCategories(response.data);
        })
    }, [id])

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

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
                        Управлять опросом
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate
                         sx={{mt: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="h6" gutterBottom component="div" margin="normal">
                                    Название: {survey?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="h6" gutterBottom component="div" margin="normal">
                                    Дата создания: {survey?.createdDate}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="h6" gutterBottom component="div" margin="normal">
                                    Тип: {survey?.type}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    <Link
                                        color="secondary"
                                        onClick={() => {
                                            history.push(generatePath('/survey/:surveyId/category/', {
                                                surveyId: id,
                                            }));
                                        }}
                                    >
                                        Добавить категорию?
                                    </Link>
                                </Typography>

                            </Grid>
                            <>
                                {categories.map((category) => {
                                    renderElements(category, () => {
                                        history.push(generatePath('/survey/:surveyId/category/:categoryId', {
                                            surveyId: id,
                                            categoryId: Number(category?.id)
                                        }));
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
