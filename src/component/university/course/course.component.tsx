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
import {Autocomplete, Checkbox, createFilterOptions} from "@mui/material";
import SubjectData from "../../../types/subjectData";
import SubjectService from "../../../service/subject.service";
import GroupData from "../../../types/groupData";
import TeacherData from "../../../types/teacherData";
import TeacherService from "../../../service/teacher.service";
import GroupService from "../../../service/group.service";
import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import CourseData from "../../../types/courseData";
import CourseService from "../../../service/course.service";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const addCourse = async (course: CourseData) => {
    return await CourseService.add(course);
}

const getSubjects = async (universityId: any) => {
    return await SubjectService.getByUniversity(universityId);
}

const getTeachers = async (universityId: any) => {
    return await TeacherService.getByUniversity(universityId);
}

const getGroups = async (universityId: any) => {
    return await GroupService.getByUniversity(universityId);
}

const theme = createTheme();

const filterOptionsGroup = createFilterOptions({
    // matchFrom: 'start',
    stringify: (option: GroupData) => `${option.guid} (${option.name})`,
});

const filterOptionsSubject = createFilterOptions({
    // matchFrom: 'start',
    stringify: (option: SubjectData) => `${option.name} – ${option.ratingType}`,
});

const filterOptionsTeacher = createFilterOptions({
    // matchFrom: 'start',
    stringify: (option: TeacherData) => `${option.lastName} ${option.firstName?.substring(0, 1)}. ${option.patronymic?.substring(0, 1)} – ${option.grade}`,
});

export default function CourseComponent() {
    const history = useHistory();
    const {id} = useParams<{ id?: string }>();

    const [groups, setGroups] = useState<GroupData[]>([]);
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    const [teachers, setTeachers] = useState<TeacherData[]>([]);

    const [teacher, setTeacher] = useState<TeacherData | null>(null)
    const [group, setGroup] = useState<GroupData[]>([])
    const [subject, setSubject] = useState<SubjectData | null>(null)

    const [since, setSince] = React.useState<Date | null>(new Date(new Date().getFullYear(), 8, 1));
    const [till, setTill] = React.useState<Date | null>(new Date(new Date().getFullYear() + 1, 5, 31));

    useEffect(() => {
        getGroups(id).then(response => {
            console.log(response.data);
            setGroups(response.data);
        });
        getTeachers(id).then(response => {
            console.log(response.data);
            setTeachers(response.data);
        })
        getSubjects(id).then(response => {
            console.log(response.data);
            setSubjects(response.data);
        })
    }, [])

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        for (const g of group) {
            const course: CourseData = {
                groupId: Number(g.id),
                subjectId: Number(subject?.id),
                teacherId: Number(teacher?.id),
                since: String(since?.toLocaleDateString()),
                till: String(till?.toLocaleDateString()),
                hours: Number(data.get('subjectHours'))
            }

            console.log(subject);

            addCourse(course).then(response => {
                history.push('/groups');
            }).catch(e => {
                console.log("Не всё идёт по плану! " + JSON.stringify(e));
            });

        }

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
                        Добавить курс
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate
                         sx={{mt: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    id="group"
                                    options={groups}
                                    getOptionLabel={(option) => `${option.guid} (${option.name})`}
                                    filterOptions={filterOptionsGroup}
                                    onChange={(event: any, newValue: GroupData[]) => {
                                        setGroup(newValue);
                                    }}
                                    value={group}
                                    renderOption={(props, option, {selected}) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                style={{marginRight: 8}}
                                                checked={selected}
                                            />
                                            {`${option.guid} (${option.name})`}
                                        </li>
                                    )}
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
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    id="subject"
                                    options={subjects}
                                    getOptionLabel={(option) => `${option.name} – ${option.ratingType}`}
                                    filterOptions={filterOptionsSubject}
                                    onChange={(event: any, newValue: SubjectData | null) => {
                                        setSubject(newValue);
                                    }}
                                    value={subject}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            fullWidth
                                            required
                                            label="Предмет"
                                            margin="normal"
                                            color="secondary"
                                        />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    id="teacher"
                                    options={teachers}
                                    getOptionLabel={(option) => `${option.lastName} ${option.firstName?.substring(0, 1)}. ${option.patronymic?.substring(0, 1)} – ${option.grade}`}
                                    filterOptions={filterOptionsTeacher}
                                    onChange={(event: any, newValue: TeacherData | null) => {
                                        setTeacher(newValue);
                                    }}
                                    value={teacher}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            fullWidth
                                            required
                                            label="Преподаватель"
                                            margin="normal"
                                            color="secondary"
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Дата начала курса"
                                        openTo="year"
                                        views={['year', 'month', 'day']}
                                        value={since}
                                        minDate={new Date('2000-01-01')}
                                        maxDate={new Date(new Date().getFullYear() + 5, 0)}
                                        onChange={(newValue) => {
                                            setSince(newValue);
                                        }}
                                        renderInput={(params) =>
                                            <TextField {...params} fullWidth color="secondary" margin="normal"/>
                                        }
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Дата окончания курса"
                                        openTo="year"
                                        views={['year', 'month', 'day']}
                                        value={till}
                                        minDate={new Date('2000-01-01')}
                                        maxDate={new Date(new Date().getFullYear() + 5, 0)}
                                        onChange={(newValue) => {
                                            setTill(newValue);
                                        }}
                                        renderInput={(params) =>
                                            <TextField {...params} fullWidth color="secondary" margin="normal"/>
                                        }
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="subjectHours"
                                    label="Количество часов"
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            min: 40,
                                            max: 500
                                        }
                                    }}
                                    id="subjectHours"
                                    autoComplete="subjectHours"
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
