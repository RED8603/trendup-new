import CreatePost from "@/components/CreatePost/CreatePost";
import Posts from "@/components/Post/Posts";
import ForYouFeed from "@/components/Feed/ForYouFeed";
import { Box, Container, Grid2, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import CryptoNewsList from "./CryptoNewsList/CryptoNewsList";
import CryptoMarketList from "./CryptoMarketList/CryptoMarketList";
import { useTheme } from "@emotion/react";
import { TabContext, TabPanel } from "@mui/lab";
import CustomTabs from "@/components/common/CustomTabs/CustomTabs";
import CustomTab from "@/components/common/CustomTabs/CustomTab";
import { CryptoMarketIcon, FeedIcon, TimelineIcon } from "@/assets/icons";
import TrendingTabs from "./TrendingTabs/TrendingTabs";

const Home = () => {
    const theme = useTheme();
    const isMdup = useMediaQuery(theme.breakpoints.up("lg"));
    const [tabId, setTabId] = useState("1");

    const handleChange = (event, newValue) => {
        setTabId(newValue);
    };

    return (
        <Box sx={{ width: "100%", minHeight: "60vh", py: 2 }}>
            <TabContext value={tabId}>
                <Box 
                    sx={{ 
                        borderBottom: 1, 
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "center",
                        mb: 2,
                        pt: 2,
                        width: "100%"
                    }}
                >
                    <CustomTabs onChange={handleChange} aria-label="home tabs" value={tabId}>
                        <CustomTab 
                            icon={<FeedIcon />} 
                            label="Crypto News" 
                            value="1" 
                            selected={tabId} 
                        />
                        <CustomTab 
                            icon={<TimelineIcon />} 
                            label="News Feed" 
                            value="2" 
                            selected={tabId} 
                        />
                        <CustomTab 
                            icon={<CryptoMarketIcon />} 
                            label="Crypto Market" 
                            value="3" 
                            selected={tabId} 
                        />
                    </CustomTabs>
                </Box>

                {/* Crypto News Tab */}
                <TabPanel value="1" sx={{ px: { md: 2, xs: 1 }, py: 2, width: "100%" }}>
                    <Container maxWidth="lg" sx={{ width: "100%", mx: "auto" }}>
                        <Typography 
                            variant="h2" 
                            color="textSecondary" 
                            sx={{ mb: 2, ml: 1 }}
                        >
                            Latest Crypto News
                        </Typography>
                        <CryptoNewsList />
                    </Container>
                </TabPanel>

                {/* News Feed Tab */}
                <TabPanel value="2" sx={{ px: { md: 2, xs: 1 }, py: 2, width: "100%" }}>
                    <Container maxWidth="lg" sx={{ width: "100%", mx: "auto" }}>
                        <TrendingTabs />
                    </Container>
                </TabPanel>

                {/* Crypto Market Tab */}
                <TabPanel value="3" sx={{ px: { md: 2, xs: 1 }, py: 2, width: "100%" }}>
                    <Container maxWidth="lg" sx={{ width: "100%", mx: "auto" }}>
                        <Typography 
                            variant="h2" 
                            color="textSecondary" 
                            sx={{ mb: 2, ml: 1 }}
                        >
                            Latest Market Trends
                        </Typography>
                        <CryptoMarketList />
                    </Container>
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default Home;
