import React, { useState } from "react";
import BoxConatner from "../common/BoxContainer/BoxConatner";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import {
    CommentBorderIcon,
    CommentIcon,
    HeartBorderIcon,
    HeartIcon,
    LikeBorderIcon,
    LikeIcon,
    MoreHorizIcon,
} from "@/assets/icons";
import UserUI from "../common/UserUi/UserUI";
import { motion } from "framer-motion";
import VotingComponent from "@/pages/Vote/GenrelVoting/vote-1";

const MotionIconButton = motion(IconButton);
const bounceEffect = {
    whileTap: { scale: 1.4 },
    transition: { type: "spring", stiffness: 300, damping: 10 },
};

const Post = ({ data }) => {
    const theme = useTheme();
    const [isLiked, setIsLiked] = useState({
        heart: true,
        like: false,
        comment: false,
    });

    const handleLike = (type) => {
        setIsLiked((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const getColor = (type) => {
        return isLiked[type] ? theme.palette.text.primary : theme.palette.text.secondary;
    };

    return (
        <BoxConatner sx={{ mb: 2 }}>
            {data?.type === "poll" ? (
                <VotingComponent />
            ) : (
                <>
                    <Stack direction="row" justifyContent="space-between">
                        <UserUI username={data.username} userImage={data.userImage} />
                        <IconButton color={theme.palette.secondary.main}>
                            <MoreHorizIcon color={theme.palette.secondary.main} />
                        </IconButton>
                    </Stack>

                    <Typography color={theme.palette.text.secondary} fontWeight={400} mt={2}>
                        {data.description}
                    </Typography>

                    {data.postImage && (
                        <img
                            src={data.postImage}
                            width="100%"
                            style={{ marginTop: "10px", borderRadius: "10px" }}
                            alt="post"
                        />
                    )}

                    <Stack direction="row" spacing={2} mt={2} alignItems="center">
                        {/* Heart */}
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <MotionIconButton
                                onClick={() => handleLike("heart")}
                                sx={{ color: getColor("heart") }}
                                {...bounceEffect}
                            >
                                {isLiked.heart ? <HeartIcon /> : <HeartBorderIcon />}
                            </MotionIconButton>
                            <Typography color={theme.palette.secondary.main} fontWeight={600}>
                                100
                            </Typography>
                        </Stack>

                        {/* Comment */}
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <MotionIconButton
                                onClick={() => handleLike("comment")}
                                sx={{ color: getColor("comment") }}
                                {...bounceEffect}
                            >
                                {isLiked.comment ? <CommentIcon /> : <CommentBorderIcon />}
                            </MotionIconButton>
                            <Typography color={theme.palette.secondary.main} fontWeight={600}>
                                8347
                            </Typography>
                        </Stack>

                        {/* Like */}
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <MotionIconButton
                                onClick={() => handleLike("like")}
                                sx={{ color: getColor("like") }}
                                {...bounceEffect}
                            >
                                {isLiked.like ? <LikeIcon /> : <LikeBorderIcon />}
                            </MotionIconButton>
                            <Typography color={theme.palette.secondary.main} fontWeight={600}>
                                73
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            )}
        </BoxConatner>
    );
};

export default Post;
