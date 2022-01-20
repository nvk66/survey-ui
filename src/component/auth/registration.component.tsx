import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import RegistrationData from "../../types/registrationData";
import AuthService from "../../service/auth.service";
import {useHistory} from "react-router-dom";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import UniversityData from "../../types/universityData";
import UniversityService from "../../service/university.service";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const register = async (auth: RegistrationData, id: any) => {
    return await AuthService.signUp(auth, id);
}

const getUniversities = async () => {
    return await UniversityService.get();
}

const theme = createTheme();

export default function Registration() {
    const history = useHistory();

    const [university, setUniversity] = React.useState<UniversityData | null | undefined>(null);

    const [universities, setUniversities] = useState<UniversityData[]>([]);

    useEffect(() => {
        getUniversities().then(response => {
            console.log(response.data);
            setUniversities(response.data);
        })
    }, []);

    const handleUniSelect = (event: SelectChangeEvent) => {
        setUniversity(universities.find(uni => uni.id === Number(event.target.value)));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const registration: RegistrationData = {
            login: String(data.get('login')),
            email: String(data.get('email')),
            password: String(data.get('password')),
            firstName: String(data.get('firstName')),
            lastName: String(data.get('lastName')),
            patronymic: String(data.get('patronymic')),
        };

        register(registration, university?.id).then(response => {
            history.push('/login');
        }).catch(e => {
            console.log("Не всё идёт по плану! " + JSON.stringify(e));
        });

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
                        Регистрация
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Имя"
                                    autoFocus
                                    color="secondary"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Фамилия"
                                    name="lastName"
                                    autoComplete="family-name"
                                    color="secondary"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    id="patronymic"
                                    label="Отчество"
                                    name="patronymic"
                                    autoComplete="patronymic"
                                    color="secondary"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="login"
                                    label="Логин"
                                    name="login"
                                    autoComplete="login"
                                    color="secondary"
                                />
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
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth required color="secondary" margin="normal">
                                    <InputLabel id="uniLabel">Университет</InputLabel>
                                    <Select
                                        labelId="uniLabel"
                                        id="uni"
                                        value={university ? String(university.id) : ''}
                                        label={'Университет'}
                                        onChange={handleUniSelect}
                                    >
                                        {universities.map((uni) => (
                                            <MenuItem
                                                key={uni.id}
                                                value={String(uni.id)}
                                            >
                                                {`${uni.guid} (${uni.name})`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
