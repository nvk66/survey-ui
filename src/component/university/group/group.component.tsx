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
import UniversityData from "../../../types/universityData";
import UniversityService from "../../../service/university.service";
import {useHistory} from "react-router-dom";
import Grid from "@mui/material/Grid";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import GroupData from "../../../types/groupData";
import GroupService from "../../../service/group.service";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const addGroup = async (group: GroupData, universityId: any) => {
    return await GroupService.add(group, universityId);
}

const getUniversities = async () => {
    return await UniversityService.get();
}

const theme = createTheme();

export default function GroupComponent() {
    const history = useHistory();
    const [university, setUniversity] = React.useState<UniversityData | null | undefined>(null);

    const [universities, setUniversities] = useState<UniversityData[]>([]);

    useEffect(() => {
        getUniversities().then(response => {
            console.log(response.data);
            setUniversities(response.data);
        })
    }, [])

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const group: GroupData = {
            guid: String(data.get('groupGuid')),
            name: String(data.get('groupName')),
            year: String(data.get('groupYear'))
        }

        console.log(group)

        addGroup(group, university?.id).then(response => {
            history.push('/groups');
        }).catch(e => {
            console.log("Не всё идёт по плану! " + JSON.stringify(e));
        });

        setMessage('');
        setLoading(true);

    };

    const handleUniSelect = (event: SelectChangeEvent) => {
        setUniversity(universities.find(uni => uni.id === Number(event.target.value)));
    }

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
                        Добавить группу
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate
                         sx={{mt: 1, maxWidth: 500, minWidth: 300, width: 500}}>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth required margin="normal" color="secondary">
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
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="groupGuid"
                                label="Обозначение"
                                name="groupGuid"
                                autoComplete="groupGuid"
                                autoFocus
                                color="secondary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="groupName"
                                label="Название"
                                id="groupName"
                                autoComplete="groupName"
                                color="secondary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="number"
                                inputProps={{
                                    min: 2000,
                                    max: new Date().getFullYear() + 5
                                }}
                                name="groupYear"
                                label="Год поступления"
                                id="year"
                                autoComplete="groupYear"
                                color="secondary"
                            />
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
