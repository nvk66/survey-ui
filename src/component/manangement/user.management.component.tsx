import * as React from 'react';
import {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import {useHistory} from "react-router-dom";
import UserInfoData from "../../types/userInfoData";
import UserService from "../../service/user.service";
import Pagination from "@mui/lab/Pagination";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {Column, useTable} from "react-table";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const getUsers = async (requestString: any) => {
    return await UserService.get(requestString);
}

const confirmUsers = async (id: any) => {
    return await UserService.confirm(id);
}

const confirmAllUsers = async () => {
    return await UserService.confirmAll();
}

const theme = createTheme();


export default function UserManagementComponent() {
    const history = useHistory();

    const [users, setUsers] = useState<Array<UserInfoData>>([]);
    const [pageSizes] = useState<Array<number>>([10, 20, 25]);
    const userInfoRef = useRef<Array<UserInfoData>>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState({
        page: page,
        size: size
    });

    userInfoRef.current = users;

    useEffect(() => {
        const params = getRequestParams(page, size);

        const requestString = prepareStringRequest(params);

        getUsers(requestString).then(response => {
            console.log(response.data);
            setUsers(response.data.content);
        });
    }, [page, size]);

    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSizeChange = (event: SelectChangeEvent) => {
        setSize(Number(event.target.value));
        setPage(1);
    };

    const submitUser = (id: any) => {
        confirmUsers(id).then(response => {
            console.log(response.data);
            history.go(0);
        });
    }

    const submitAllUsers = () => {
        confirmAllUsers().then(response => {
            console.log(response.data);
            history.go(0);
        });
    }

    const getRequestParams = (page: number, size: number) => {
        setSearch({page: 0, size: 0});

        if (page) {
            search.page = page - 1;
        }

        if (size) {
            search.size = size;
        }
        return search;
    };

    const prepareStringRequest = (search: any) => {
        let requestString = '?';

        Object.entries(search).forEach((value, key, map) => {
            if (value) {
                requestString += `${value[0]}=${value[1]}&`;
            }
        })

        if (requestString.endsWith('&')) {
            requestString = requestString.substr(0, requestString.length - 1);
        }
        return requestString;
    }

    const columns: Column<UserInfoData>[] = useMemo(() => [
            {
                Header: 'Фамилия',
                accessor: 'lastName',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Имя',
                accessor: 'firstName',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Отчество',
                accessor: 'patronymic',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Actions',
                accessor: 'id',
                Cell: (props) => {
                    const rowIdx = Number(props.row.id);
                    return (
                        <div>
                            <Button
                                key="confirm"
                                variant="contained"
                                color="secondary"
                                onClick={() => submitUser(userInfoRef.current[rowIdx].id)}
                            >
                                Подтвердить
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
    } = useTable<UserInfoData>({
        columns,
        data: users,
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
                    }}
                >
                    <div className="list row ml-3">
                        <div className="col-md-8">
                            <div className="input-group mb-3">
                                <div className="input-group">
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon/>}
                                        onClick={submitAllUsers}
                                        color="secondary"
                                        sx={{minWidth: 150}}
                                    >
                                         Подтвердить всех
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12 list">
                            <div className="mt-3">
                                <FormControl>
                                    <InputLabel id="sizeSelectLabel" color="secondary">Items per Page:</InputLabel>
                                    <Select
                                        labelId="sizeSelectLabel"
                                        id="sizeTypeSelect"
                                        value={String(size)}
                                        color="secondary"
                                        onChange={handleSizeChange}
                                        label="Size"
                                        sx={{minWidth: 150}}
                                    >
                                        {pageSizes.map((size: number) => (
                                            <MenuItem value={size}>{size}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Pagination
                                    className="my-3"
                                    count={totalPages}
                                    page={page}
                                    siblingCount={1}
                                    boundaryCount={1}
                                    variant="outlined"
                                    onChange={handlePageChange}
                                    color="secondary"
                                />
                            </div>

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
                    </div>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
