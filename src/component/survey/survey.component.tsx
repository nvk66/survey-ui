import * as React from 'react';
import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import {useHistory} from "react-router-dom";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import SurveyData from "../../types/surveyData";
import SurveyService from "../../service/survey.service";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const addSurvey = async (survey: SurveyData) => {
    return await SurveyService.add(survey);
}

const theme = createTheme();

export default function SurveyComponent() {
    const history = useHistory();

    const [type, setType] = useState('');
    const [common, setCommon] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const survey: SurveyData = {
            name: String(data.get('surveyName')),
            type: type,
            common: common
        }

        addSurvey(survey).then(response => {
            console.log(response)
            history.push('/groups');
        }).catch(e => {
            console.log("Не всё идёт по плану! " + JSON.stringify(e));
        });

    };

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <AddCircleOutlineIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Добавит опрос
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="surveyName"
                                    name="surveyName"
                                    required
                                    fullWidth
                                    id="surveyName"
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
                                        onChange={handleChangeSelect}
                                    >
                                        <MenuItem value={'SURVEY'}>Опрос</MenuItem>
                                        <MenuItem value={'QUIZ'}>Викторина</MenuItem>
                                        <MenuItem value={'APPLICATION_FORM'}>Анкета</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value={common}
                                            onChange={(event: any) => {
                                                setCommon(event.target.checked);
                                            }}
                                            color="secondary"/>
                                    }
                                    label="Я хочу сделать данный опрос общедоступным. (При выборе данной опции данный опрос смогут проходить различные люди, результаты будут доступны вам.)"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            color="secondary"
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Продолжить
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{mt: 5}}/>
            </Container>
        </ThemeProvider>
    );
}
