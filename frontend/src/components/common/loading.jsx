import React from "react";
import { Backdrop, Typography } from "@mui/material";
import { loadingGif } from "@/assets";

const Loading = ({ isLoading }) => {
    return (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
            <Typography variant="h6">Loading...</Typography>
        </Backdrop>
    );
};

export default Loading;
