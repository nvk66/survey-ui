import * as React from 'react';
import {ChangeEvent, useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import SchoolIcon from '@mui/icons-material/School';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import {useHistory} from "react-router-dom";
import {
    Autocomplete,
    createFilterOptions,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import TeacherData from "../../types/teacherData";
import PupilData from "../../types/pupilData";
import TeacherService from "../../service/teacher.service";
import PupilService from "../../service/pupil.service";
import DatePicker from '@mui/lab/DatePicker';
import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import UniversityService from "../../service/university.service";
import UniversityData from "../../types/universityData";
import GroupData from "../../types/groupData";
import GroupService from "../../service/group.service";
import TokenService from "../../service/token.service";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const addTeacher = async (teacher: TeacherData) => {
    return await TeacherService.add(teacher);
}

const addPupil = async (pupil: PupilData, groupId: string) => {
    return await PupilService.add(pupil, groupId);
}

const getUniversity = async (universityId: string) => {
    return await UniversityService.getById(universityId);
}

const getGroupsByUniversity = async (universityId: any) => {
    return await GroupService.getByUniversity(universityId);
}

const theme = createTheme();

export default function UserTypeSelectorComponent() {
    const [isTeacher, setTeacher] = useState<boolean>(false);
    const [isPupil, setPupil] = useState<boolean>(false);
    const [date, setDate] = React.useState<Date | null>(new Date());
    const [grade, setGrade] = React.useState('');
    const [university, setUniversity] = React.useState<UniversityData | null | undefined>(null);
    const [groupVal, setGroupVal] = React.useState<GroupData | null>(null);

    // const [universities, setUniversities] = useState<UniversityData[]>([]);
    const [groups, setGroups] = useState<GroupData[]>([]);

    useEffect(() => {
        getUniversity(TokenService.getUser().university).then(response => {
            console.log(response.data);
            setUniversity(response.data);
        })
    }, []);

    useEffect(() => {
        if (university) {
            getGroupsByUniversity(university.id).then(response => {
                console.log(response.data);
                setGroups(response.data)
            })
        }
    }, [university])

    const history = useHistory();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        let teacher: TeacherData | null = null;
        let pupil: PupilData | null = null;

        if (isTeacher) {
            console.log("111")
            teacher = {
                teachingDate: String(date?.toLocaleDateString()),
                grade: grade,
            }

            addTeacher(teacher).then(response => {
                // history.push('/survey');
            }).catch(e => {
                console.log("Не всё идёт по плану! " + JSON.stringify(e));
            });
        }

        console.log(teacher);
        console.log(university);

        if (isPupil) {
            pupil = {
                recordBook: String(data.get('recordBook'))
            }

            console.log("!!!")
            console.log(groupVal?.id)

            addPupil(pupil, String(groupVal?.id)).then(response => {
                // history.push('/survey');
            }).catch(e => {
                console.log("Не всё идёт по плану! " + JSON.stringify(e));
            });
        }

        console.log(pupil);

        if (isTeacher || isPupil) {
            history.push('/surveys');
        }
    };

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setGrade(event.target.value as string);
    };

    const handleChange = (prop: any) => (event: ChangeEvent<HTMLInputElement>) => {
        prop === 'teacher' ? setTeacher(event.target.checked) : setPupil(event.target.checked);
    };

    const filterOptionsGroup = createFilterOptions({
        stringify: (option: GroupData) => `${option.guid} (${option.name})`,
    });

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 5,
                        marginLeft: 10,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <SchoolIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Выберите тип пользователя
                    </Typography>
                </Box>
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'grid',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="form" noValidate onSubmit={handleSubmit}>
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
                            {isTeacher ? (
                                <>
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
                                                    <TextField {...params} fullWidth color="secondary" margin="normal"/>
                                                }
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth required color="secondary" margin="normal">
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
                                </>
                            ) : (<></>)}
                            {(isPupil ? (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="recordBook"
                                        label="Зачетная книжка"
                                        type="recordBook"
                                        id="recordBook"
                                        autoComplete="recordBook"
                                        color="secondary"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Autocomplete
                                        id="group"
                                        options={groups}
                                        getOptionLabel={(option) => `${option.guid} (${option.name})`}
                                        onChange={(event: any, newValue: GroupData | null) => {
                                            setGroupVal(newValue);
                                        }}
                                        value={groupVal}
                                        filterOptions={filterOptionsGroup}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                fullWidth
                                                required
                                                label="Группа"
                                                margin="normal"
                                                color="secondary"
                                            />}
                                    />
                                </Grid>
                            </>
                            ) : (<></>))}
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
                                <Link href="/university" variant="body2">
                                    Не нашли свой университет?
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
