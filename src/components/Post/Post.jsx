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

const MotionIconButton = motion(IconButton);
const bounceEffect = {
  whileTap: { scale: 1.4 },
  transition: { type: "spring", stiffness: 300, damping: 10 },
};

const Post = () => {
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
    return isLiked[type]
      ? theme.palette.text.primary
      : theme.palette.text.secondary;
  };

  return (
    <BoxConatner sx={{ mb: 2 }}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <UserUI />
        <IconButton color={theme.palette.secondary.main}>
          {" "}
          <MoreHorizIcon color={theme.palette.secondary.main} />{" "}
        </IconButton>
      </Stack>

      <Typography color={theme.palette.text.secondary} fontWeight={400} mt={2}>
        As global markets fluctuate and inflation rises, Bitcoin continues to
        attract attention as a decentralized alternative to traditional finance.
        Backed by blockchain technology and a fixed supply of 21 million coins,
        BTC stands as a hedge against monetary instability and centralized
        control. Whether you're a seasoned investor or just exploring crypto,
        understanding Bitcoin's fundamentals is more relevant than ever. 🚀
        #Bitcoin isn't going away — it's evolving. 💡 Stay informed. Stay ahead.
      </Typography>

      <img
        src="https://www.shutterstock.com/image-vector/crypto-currency-concept-based-poster-600nw-1899154966.jpg"
        width="100%"
        style={{ marginTop: "10px", borderRadius: "10px" }}
      />
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
    </BoxConatner>
  );
};

export default Post;
