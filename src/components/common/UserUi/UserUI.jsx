import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";

const UserUI = () => {
    return (
        <Stack direction={"row"} spacing={2} alignItems="center">
            <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/250px-User_icon_2.svg.png" />
            <Typography sx={(theme) => ({ color: theme.palette.text.secondary })} fontWeight={600}>
                Username
            </Typography>
        </Stack>
    );
};

export default UserUI;
