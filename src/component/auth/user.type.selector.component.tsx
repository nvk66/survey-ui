import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import {useHistory} from "react-router-dom";
import {FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent} from "@mui/material";
import {ChangeEvent, useState} from "react";
import TeacherData from "../../types/teacherData";
import PupilData from "../../types/pupilData";
import TeacherService from "../../service/teacher.service";
import PupilService from "../../service/pupil.service";
import DatePicker from '@mui/lab/DatePicker';
import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const addTeacher = async (teacher: TeacherData, universityId: string) => {
    return await TeacherService.add(teacher, universityId);
}

const addPupil = async (pupil: PupilData, groupId: string) => {
    return await PupilService.add(pupil, groupId);
}

const theme = createTheme();

export default function UserTypeSelectorComponent() {
    const [isTeacher, setTeacher] = useState<boolean>(false);
    const [isPupil, setPupil] = useState<boolean>(false);
    const [date, setDate] = React.useState<Date | null>(new Date());
    const [grade, setGrade] = React.useState('');
    const [university, setUniversity] = React.useState('');

    const history = useHistory();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        let teacher: TeacherData | null = null;
        let pupil: PupilData;

        if (isTeacher) {
            teacher = {
                teachingDate: String(date?.toLocaleDateString()),
                grade: grade,
            }
        }

        console.log(teacher);

        if (isPupil) {
            pupil = {
                recordBook: String(data.get('recordBook'))
            }
        }

        // const registration: RegistrationData = {
        //     login: String(data.get('login')),
        //     email: String(data.get('email')),
        //     password: String(data.get('password')),
        //     firstName: String(data.get('firstName')),
        //     lastName: String(data.get('lastName')),
        //     patronymic: String(data.get('patronymic'))
        // };

        // register(registration).then(response => {
        //     history.push('/login');
        // }).catch(e => {
        //     console.log("Не всё идёт по плану! " + JSON.stringify(e));
        // });

    };

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setGrade(event.target.value as string);
    };

    const handleChange = (prop: any) => (event: ChangeEvent<HTMLInputElement>) => {
        prop === 'teacher' ? setTeacher(event.target.checked) : setPupil(event.target.checked);
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
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FormControlLabel control={
                                    <Checkbox
                                        checked={isTeacher}
                                        onChange={handleChange('teacher')}
                                        color="secondary"
                                    />} label="Учитель"/>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControlLabel control={
                                    <Checkbox
                                        checked={isPupil}
                                        onChange={handleChange('pupil')}
                                        color="secondary"
                                    />} label="Ученик"/>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        disableFuture
                                        label="Дата начала преподавания"
                                        openTo="year"
                                        views={['year', 'month', 'day']}
                                        value={date}
                                        minDate={new Date('1950-01-01')}
                                        maxDate={new Date()}
                                        onChange={(newValue) => {
                                            setDate(newValue);
                                        }}
                                        renderInput={(params) =>
                                            <TextField {...params} fullWidth />
                                        }
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required >
                                    <InputLabel id="gradeLabel">Степень</InputLabel>
                                    <Select
                                        labelId="gradeLabel"
                                        id="grade"
                                        value={grade}
                                        label="Степень"
                                        onChange={handleChangeSelect}
                                    >
                                        <MenuItem value={'PH_D'}>Доктор наук</MenuItem>
                                        <MenuItem value={'PHD'}>Кандидат наук</MenuItem>
                                        <MenuItem value={'ASSISTANT_PROFESSOR'}>Доцент</MenuItem>
                                        <MenuItem value={'ENGINEER'}>Инженер</MenuItem>
                                        <MenuItem value={'ASSISTANT'}>Ассистент</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required >
                                    <InputLabel id="uniLabel">Университет</InputLabel>
                                    <Select
                                        labelId="uniLabel"
                                        id="uni"
                                        value={grade}
                                        label="Степень"
                                        onChange={handleChangeSelect}
                                    >
                                        <MenuItem value={'PH_D'}>Доктор наук</MenuItem>
                                        <MenuItem value={'PHD'}>Кандидат наук</MenuItem>
                                        <MenuItem value={'ASSISTANT_PROFESSOR'}>Доцент</MenuItem>
                                        <MenuItem value={'ENGINEER'}>Инженер</MenuItem>
                                        <MenuItem value={'ASSISTANT'}>Ассистент</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    color="secondary"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Пароль"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    color="secondary"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary"/>}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
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
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Уже есть аккаунт? Войти
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 5}}/>
            </Container>
        </ThemeProvider>
    );
}
