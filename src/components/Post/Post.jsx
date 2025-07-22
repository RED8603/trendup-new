import React from "react";
import BoxConatner from "../common/BoxContainer/BoxConatner";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { CommentBorderIcon, CommentIcon, HeartBorderIcon, LikeBorderIcon, MoreHorizIcon } from "@/assets/icons";
import UserUI from "../common/UserUi/UserUI";

const Post = () => {
    const theme = useTheme();
    return (
        <BoxConatner sx={{ mb: 2 }}>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <UserUI />
                <IconButton color={theme.palette.secondary.main}>
                    {" "}
                    <MoreHorizIcon color={theme.palette.secondary.main} />{" "}
                </IconButton>
            </Stack>

            <img
                src="https://www.shutterstock.com/image-vector/crypto-currency-concept-based-poster-600nw-1899154966.jpg"
                width="100%"
                style={{ marginTop: "10px", borderRadius: "10px" }}
            />
            <Stack direction={"row"} spacing={2} mt={2} alignItems={"center"}>
                <Stack direction={"row"} spacing={0.5} mt={2} alignItems={"center"}>
                    <IconButton>
                        <HeartBorderIcon />
                    </IconButton>
                    <Typography color={theme.palette.secondary.main} fontWeight={600}>
                        100
                    </Typography>
                </Stack>
                <Stack direction={"row"} spacing={0.5} mt={2} alignItems={"center"}>
                    <IconButton>
                        <CommentIcon />
                    </IconButton>
                    <Typography color={theme.palette.secondary.main} fontWeight={600}>
                        8347
                    </Typography>
                </Stack>
                <Stack direction={"row"} spacing={0.5} mt={2} alignItems={"center"}>
                    <IconButton>
                        <LikeBorderIcon />
                    </IconButton>
                    <Typography color={theme.palette.secondary.main} fontWeight={600}>
                        73
                    </Typography>
                </Stack>
            </Stack>
        </BoxConatner>
    );
};

export default Post;
