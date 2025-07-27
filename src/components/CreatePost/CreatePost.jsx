import { PollIcon, PostIcon, VideoIcon } from "@/assets/icons";
import { Box, IconButton, Input, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import BoxConatner from "@components/common/BoxContainer/BoxConatner";
import GoLiveButton from "../common/GoLiveButton/GoLiveButton";
import ButtonBorder from "../common/ButtonBorder";
import MainButton from "../common/MainButton/MainButton";

const CreatePost = () => {
    const theme = useTheme();
    return (
        <BoxConatner>
            <textarea
                placeholder="Whats Happning?"
                style={{
                    background: theme.palette.primary.light,
                    backdropFilter: "blur(8px)",
                    padding: "12px",
                    width: "100%",
                    outline: "none",
                    resize: "none",
                    borderRadius: "8px",
                    border: "none",
                    color: theme.palette.text.secondary,
                }}
                rows={4}
            />

            <Stack direction="row" justifyContent="space-between" mt={4} flexWrap={"wrap"} gap={2} >
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    <IconButton>
                        {" "}
                        <PostIcon />{" "}
                    </IconButton>
                    <IconButton>
                        {" "}
                        <VideoIcon />{" "}
                    </IconButton>
                    <IconButton>
                        {" "}
                        <PollIcon />{" "}
                    </IconButton>
                </Stack>

                <Stack direction="row" alignItems={"center"} spacing={3}>
                    <GoLiveButton />
                    <MainButton className="hvr-bounce-to-right">
                        <Typography fontWeight={600} color="textSecondary">
                            Post
                        </Typography>
                    </MainButton>
                </Stack>
            </Stack>
        </BoxConatner>
    );
};

export default CreatePost;
