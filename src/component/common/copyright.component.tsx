import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";

const renderCopyRight = (props: any) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="">
                Alexey Korzh
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const CopyrightComponent = {
    renderCopyRight
};

export default CopyrightComponent;