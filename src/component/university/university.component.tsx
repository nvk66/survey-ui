import * as React from 'react';
import {useState} from 'react';
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
import UniversityData from "../../types/universityData";
import UniversityService from "../../service/university.service";
import {useHistory} from "react-router-dom";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const addUniversity = async (university: UniversityData) => {
    return await UniversityService.add(university);
}

const theme = createTheme();

export default function UniversityComponent() {
    const history = useHistory();

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const university: UniversityData = {
            guid: String(data.get('guid')),
            name: String(data.get('university'))
        }

        console.log(university)

        addUniversity(university).then(response => {
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
                        Добавить университет
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="guid"
                            label="Аббревиатура"
                            name="guid"
                            autoComplete="guid"
                            autoFocus
                            color="secondary"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="university"
                            label="Название"
                            id="university"
                            autoComplete="university"
                            color="secondary"
                        />
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
