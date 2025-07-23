import CreatePost from "@/components/CreatePost/CreatePost";
import Posts from "@/components/Post/Posts";
import { Box, Container, Grid2, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CryptoNewsList from "./CryptoNewsList/CryptoNewsList";
import { useGetCryptoNewsQuery } from "@/api/slices/cryptoApi";
import Loading from "@/components/common/loading";

const Home = () => {
    const [news, setNews] = useState([]);
    const { data, isLoading, error } = useGetCryptoNewsQuery();
    console.log(data, isLoading, error);

    useEffect(() => {
        if (data && data.results) {
            setNews(data.results?.slice(0, 5) || []);
        }
    }, [data]);

    if (isLoading) return <Loading isLoading={true} />;

    return (
        <Box>
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
                    <Typography variant="h2" color="textSecondary" sx={{ mb: 2, ml: 1 }}>
                        Latest Crypto News
                    </Typography>
                    <CryptoNewsList news={news || []} />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <CreatePost />
                    <Posts />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
                    <Typography variant="h1" color="textSecondary">
                        {" "}
                        Market section{" "}
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default Home;
