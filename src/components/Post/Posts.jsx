import { Box } from "@mui/material";
import React from "react";
import Post from "./Post";



const Posts = ({ postData }) => {
    return (
        <Box mt={3}>
            {postData.map((post) => (
                <Post key={post.id} data={post} />
            ))}
        </Box>
    );
};

export default Posts;
