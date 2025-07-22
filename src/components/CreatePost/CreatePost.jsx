import { PollIcon, PostIcon, VideoIcon } from "@/assets/icons";
import { Box, IconButton, Input, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import BoxConatner from "@components/common/BoxContainer/BoxConatner";

const CreatePost = () => {
    const theme = useTheme();
    return (
        <BoxConatner>
            <textarea
                placeholder="Whats Happning?"
                style={{
                    background: theme.palette.primary.light,
                    backdropFilter: "blur(8px)",
                    color: "white",
                    padding: "12px",
                    width: "100%",
                    outline: "none",
                    resize: "none",
                    borderRadius: "8px",
                    border: "none",
                }}
                rows={4}
            />

            <Stack direction="row" justifyContent="space-between" mt={4}>
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

                <IconButton>
                    <Typography fontWeight={600}>Post</Typography>
                </IconButton>
            </Stack>
        </BoxConatner>
    );
};

export default CreatePost;
