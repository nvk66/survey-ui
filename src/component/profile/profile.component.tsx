import * as React from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import {useHistory} from "react-router-dom";
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import {Column, useTable} from "react-table";
import SurveyService from "../../service/survey.service";
import SurveyDataInfo from "../../types/surveyDataInfo";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const getSurveys = async (status: string) => {
    return await SurveyService.getSurveys(status.toUpperCase());
}

const theme = createTheme();

export default function ProfileComponent() {
    const history = useHistory();

    const [surveys, setSurveys] = useState<Array<SurveyDataInfo>>([]);
    const surveyRef = useRef<Array<SurveyDataInfo>>([]);
    const [value, setValue] = React.useState('done');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    useEffect(() => {
        getSurveys(value).then(response => {
            console.log(response.data);
            setSurveys(response.data);
        });
    }, [value]);

    const processSurvey = (survey: SurveyDataInfo) => {
        history.push(`/handle/survey/${survey.permissionId}`);
    }

    surveyRef.current = surveys;

    const columns: Column<SurveyDataInfo>[] = useMemo(() => [
            {
                Header: 'Название',
                accessor: 'name',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Тип',
                accessor: 'type',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Предмет',
                accessor: (originalRow) => {
                    return originalRow.subject.name;
                },
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Преподаватель',
                accessor: (originalRow) => {
                    return `${originalRow.teacher.lastName}. ${originalRow.teacher.firstName?.charAt(0)}. ${originalRow.teacher.patronymic?.charAt(0)}.`;
                },
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: '',
                accessor: 'id',
                Cell: (props) => {
                    const rowIdx = Number(props.row.id);
                    return (
                        <div>
                            <Button
                                key="confirm"
                                variant="contained"
                                color="secondary"
                                onClick={() => processSurvey(surveyRef.current[rowIdx])}
                            >
                                Пройти
                            </Button>
                        </div>
                    );
                },
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<SurveyDataInfo>({
        columns,
        data: surveys,
    });

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
                        maxWidth: 1400,
                    }}
                >
                    <div className="list row ml-3">
                        <div className="col-md-8">
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Опросы</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="surveyType"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="done" control={<Radio/>} label="Пройденные"/>
                                    <FormControlLabel value="await" control={<Radio/>} label="Не пройденные"/>
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>

                    <div className="col-md-12 list">
                        <table
                            {...getTableProps()}
                        >
                            <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps({
                                    style: {
                                        textAlign: 'center'
                                    }
                                })}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {rows.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps({
                                                    style: {
                                                        minWidth: cell.column.minWidth,
                                                        width: cell.column.width,
                                                        textAlign: 'center'
                                                    },
                                                })}>{cell.render('Cell')}</td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
