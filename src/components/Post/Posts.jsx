import { Box } from "@mui/material";
import React from "react";
import Post from "./Post";

const Posts = () => {
    return (
        <Box mt={3} >
            <Post />
            <Post />
            <Post />
        </Box>
    );
};

export default Posts;
