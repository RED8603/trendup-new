import CreatePost from "@/components/CreatePost/CreatePost";
import Posts from "@/components/Post/Posts";
import { Box, Container } from "@mui/material";
import React from "react";

const Home = () => {
    return (
        <Box>
            <Container maxWidth="md">
                <CreatePost />
                <Posts />
            </Container>
        </Box>
    );
};

export default Home;
