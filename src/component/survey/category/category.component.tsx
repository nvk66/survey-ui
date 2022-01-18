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

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const addCategory = async (category: CategoryData, surveyId: any) => {
    return await CategoryService.add(category, surveyId);
}

const theme = createTheme();

const getSurvey = async (surveyId: any) => {
    return await SurveyService.get(surveyId);
}

export default function CategoryComponent() {
    const history = useHistory();
    const {id} = useParams<{ id: string }>();

    const [survey, setSurvey] = useState<SurveyData>();

    useEffect(() => {
        getSurvey(id).then(response => {
            console.log(response.data);
            setSurvey(response.data);
        });
    }, [id])

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const category: CategoryData = {
            name: String(data.get('categoryName'))
        }

        console.log(category)

        addCategory(category, id).then(response => {
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
                        Добавить категорию для опроса «{survey?.name}»
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate
                         sx={{mt: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="categoryName"
                                    name="categoryName"
                                    required
                                    fullWidth
                                    id="categoryName"
                                    label="Название"
                                    autoFocus
                                    color="secondary"
                                />
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
