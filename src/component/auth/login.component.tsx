import * as React from 'react';
import {useState} from 'react';
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
import LoginService from "../../service/auth.service";
import AuthService from "../../service/auth.service";
import LoginData from '../../types/loginData';
import CopyrightComponent from "../common/copyright.component";
import {useHistory} from "react-router-dom";
import UserData from "../../types/userData";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const theme = createTheme();

export default function SignIn() {

    const history = useHistory();

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            login: data.get('login'),
            password: data.get('password'),
        });

        const auth: LoginData = {
            login: String(data.get('login')),
            password: String(data.get('password'))
        }

        setMessage('');
        setLoading(true);


        LoginService.login(auth).then(
            (response: UserData) => {
                console.log(response)
                console.log(AuthService.parseJwt(response?.accessToken))
                const roles = AuthService.parseJwt(response?.accessToken);
                if (roles.roles?.includes("ROLE_USER_NOT_CONFIRMED")) {
                    history.push("/registration/type");
                } else {
                    if (roles.roles?.includes("ROLE_UNIVERSITY_ADMINISTRATOR")) {
                        history.push("/users");
                    } else if (roles.roles?.includes("ROLE_USER")) {
                        history.push("/surveys");
                    } else if (roles.roles?.includes("ROLE_TEACHER")) {
                        history.push("/rating");
                    } else if (roles.roles?.includes("ROLE_ADMINISTRATOR")) {
                        history.push("/users/management");
                    }
                }
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
                setLoading(false);
                console.log(message);
            }
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Вход
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="login"
                            label="Логин"
                            name="login"
                            autoComplete="login"
                            autoFocus
                            color="secondary"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            color="secondary"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Войти
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    {"Забыли пароль?"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/registration" variant="body2">
                                    {"У вас нет аккаунта?"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
