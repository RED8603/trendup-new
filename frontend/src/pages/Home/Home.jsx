import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography, useMediaQuery, alpha, Divider } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ForYouIcon, 
    FollowingIcon, 
    TimelineIcon, 
    ExploreIcon,
    NewspaperIcon,
    TrendingUpIcon
} from "@/assets/icons";

// Import feed components
import ForYouFeed from "@/components/Feed/ForYouFeed";
import FollowingFeed from "@/components/Feed/FollowingFeed";
import TrendingFeed from "@/components/Feed/TrendingFeed";
import DiscoverFeed from "@/components/Feed/DiscoverFeed";
import CryptoNewsList from "./CryptoNewsList/CryptoNewsList";
import CryptoMarketList from "./CryptoMarketList/CryptoMarketList";

const MotionBox = motion(Box);

// Tab configuration with routes
const feedTabs = [
    { id: "foryou", label: "For You", icon: ForYouIcon, route: "/home" },
    { id: "following", label: "Following", icon: FollowingIcon, route: "/social/following" },
    { id: "trending", label: "Trending", icon: TimelineIcon, route: "/social/trending" },
    { id: "discover", label: "Discover", icon: ExploreIcon, route: "/social/discover" },
];

// Simple Clean Tab Button
const TabButton = ({ tab, isActive, onClick, theme }) => {
    const isDark = theme.palette.mode === "dark";
    
    return (
        <MotionBox
            onClick={onClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                px: { xs: 1.5, sm: 2.5 },
                py: 1.5,
                cursor: "pointer",
                position: "relative",
                borderRadius: 2,
                transition: "all 0.2s ease",
                backgroundColor: isActive 
                    ? isDark ? "rgba(225, 46, 36, 0.15)" : "rgba(22, 180, 142, 0.1)"
                    : "transparent",
                "&:hover": {
                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                },
            }}
        >
            <tab.icon 
                sx={{ 
                    fontSize: 24,
                    color: isActive 
                        ? isDark ? "#e12e24" : "#16b48e"
                        : theme.palette.text.secondary,
                    transition: "color 0.2s ease",
                }} 
            />
            <Typography
                sx={{
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive 
                        ? isDark ? "#e12e24" : "#16b48e"
                        : theme.palette.text.secondary,
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                }}
            >
                {tab.label}
            </Typography>
            {isActive && (
                <MotionBox
                    layoutId="tabIndicator"
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60%",
                        height: 3,
                        borderRadius: "3px 3px 0 0",
                        backgroundColor: isDark ? "#e12e24" : "#16b48e",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
        </MotionBox>
    );
};

// Section Title Component
const SectionTitle = ({ icon: Icon, title, theme }) => {
    const isDark = theme.palette.mode === "dark";
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Icon sx={{ fontSize: 22, color: isDark ? "#e12e24" : "#16b48e" }} />
            <Typography 
                variant="h6" 
                sx={{ 
                    fontWeight: 700, 
                    fontSize: "1rem",
                    color: theme.palette.text.primary,
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};

const Home = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [activeTab, setActiveTab] = useState("foryou");
    const isDark = theme.palette.mode === "dark";

    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath === "/home" || currentPath === "/") {
            setActiveTab("foryou");
        } else {
            const matchedTab = feedTabs.find(tab => currentPath.includes(tab.id));
            if (matchedTab) setActiveTab(matchedTab.id);
        }
    }, [location.pathname]);

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        navigate(tab.route);
    };

    const renderFeed = () => {
        switch (activeTab) {
            case "following": return <FollowingFeed />;
            case "trending": return <TrendingFeed />;
            case "discover": return <DiscoverFeed />;
            default: return <ForYouFeed />;
        }
    };

    return (
        <Box sx={{ width: "100%", minHeight: "100vh" }}>
            <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, md: 3 } }}>
                <Grid container spacing={3}>
                    
                    {/* Left Column - Crypto News */}
                    {isLgUp && (
                        <Grid item lg={3}>
                            <Box
                                sx={{
                                    position: "sticky",
                                    top: 80,
                                    maxHeight: "calc(100vh - 100px)",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    pr: 1,
                                    "&::-webkit-scrollbar": { width: 4 },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        borderRadius: 2,
                                    },
                                }}
                            >
                                <SectionTitle icon={NewspaperIcon} title="Latest Crypto News" theme={theme} />
                                <CryptoNewsList />
                            </Box>
                        </Grid>
                    )}

                    {/* Center Column - Feed */}
                    <Grid item xs={12} lg={6}>
                        {/* Tab Navigation */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: { xs: 0.5, sm: 1 },
                                mb: 3,
                                pb: 1,
                                borderBottom: `1px solid ${alpha(isDark ? "#fff" : "#000", 0.1)}`,
                                position: "sticky",
                                top: 64,
                                zIndex: 50,
                                backgroundColor: theme.palette.background.default,
                                py: 1,
                                mx: -2,
                                px: 2,
                            }}
                        >
                            {feedTabs.map((tab) => (
                                <TabButton
                                    key={tab.id}
                                    tab={tab}
                                    isActive={activeTab === tab.id}
                                    onClick={() => handleTabClick(tab)}
                                    theme={theme}
                                />
                            ))}
                        </Box>

                        {/* Feed Content */}
                        <AnimatePresence mode="wait">
                            <MotionBox
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderFeed()}
                            </MotionBox>
                        </AnimatePresence>
                    </Grid>

                    {/* Right Column - Market Trends */}
                    {isLgUp && (
                        <Grid item lg={3}>
                            <Box
                                sx={{
                                    position: "sticky",
                                    top: 80,
                                    maxHeight: "calc(100vh - 100px)",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    pl: 1,
                                    "&::-webkit-scrollbar": { width: 4 },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        borderRadius: 2,
                                    },
                                }}
                            >
                                <SectionTitle icon={TrendingUpIcon} title="Market Trends" theme={theme} />
                                <CryptoMarketList />
                            </Box>
                        </Grid>
                    )}

                    {/* Mobile/Tablet - Show sidebars below */}
                    {!isLgUp && (
                        <>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mt: 2 }}>
                                    <SectionTitle icon={NewspaperIcon} title="Latest Crypto News" theme={theme} />
                                    <CryptoNewsList />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mt: 2 }}>
                                    <SectionTitle icon={TrendingUpIcon} title="Market Trends" theme={theme} />
                                    <CryptoMarketList />
                                </Box>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
