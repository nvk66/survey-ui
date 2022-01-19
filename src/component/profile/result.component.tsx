import * as React from 'react';
import {useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CopyrightComponent from "../common/copyright.component";
import {useHistory, useParams} from "react-router-dom";
import SurveyService from "../../service/survey.service";
import ResultData from "../../types/resultData";

const Copyright = (props: any) => {
    return CopyrightComponent.renderCopyRight(props);
}

const getResult = async (permissionId: string) => {
    return await SurveyService.getResult(permissionId);
}

const theme = createTheme();

const renderResult = (resultData: ResultData[]) => {
    return resultData.map(data => {
        return (
            <>
                <Typography component="h1" variant="h5">
                    Категория: {data.categoryName} Вопрос: {data.questionName}
                </Typography>
                <Typography component="h1" variant="h5">
                    Результат: {data.average}
                </Typography>
            </>
        );
    });
}

export default function ResultComponent() {
    const { permissionId } = useParams<{ permissionId: string }>();

    const history = useHistory();
    const [result, setResult] = useState<ResultData[]>([]);

    useEffect(() => {
        getResult(permissionId).then(response => {
            console.log(response.data);
            setResult(response.data);
        })
    }, [permissionId]);

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
                    {renderResult(result)}
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
