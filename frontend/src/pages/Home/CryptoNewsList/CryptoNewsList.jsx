import React, { useEffect, useState, useRef } from "react";
import { Typography, Stack, Box, useTheme, CircularProgress, Alert, alpha, Chip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { useGetCryptoNewsQuery } from "@/api/cryptoNewsApi";
import { useSelector } from "react-redux";


const MotionBox = motion(Box);

// Animation Variants
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1 },
    }),
};

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const CryptoNewsList = () => {
    const { isGuestMode } = useSelector((state) => state.user);
    const [news, setNews] = useState([]);
    const [newItemIds, setNewItemIds] = useState(new Set());
    const [lastUpdate, setLastUpdate] = useState(null);
    const previousNewsRef = useRef([]);
    
    // ✅ Real-time polling every 30 seconds
    const { data, isLoading, error, isFetching } = useGetCryptoNewsQuery(undefined, {
        pollingInterval: 30000, // 30 seconds for real-time updates
        skip: isGuestMode,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    // ✅ Sync state and detect new items
    useEffect(() => {
        const results = data?.data?.results || data?.results;
        if (results?.length) {
            const newNews = results.slice(0, 5);
            
            // Detect new items by comparing IDs
            const previousIds = new Set(previousNewsRef.current.map(item => item.id));
            const newIds = new Set();
            newNews.forEach(item => {
                if (!previousIds.has(item.id)) {
                    newIds.add(item.id);
                }
            });
            
            if (newIds.size > 0) {
                setNewItemIds(newIds);
                // Clear "new" indicator after 5 seconds
                setTimeout(() => setNewItemIds(new Set()), 5000);
            }
            
            previousNewsRef.current = newNews;
            setNews(newNews);
            setLastUpdate(new Date());
        }
    }, [data]);
  
    const theme = useTheme();

    // Show guest mode message
    if (isGuestMode) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                Sign in to view the latest crypto news and market updates.
            </Alert>
        );
    }

    // Show loading state (only on initial load)
    if (isLoading && news.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
                <CircularProgress size={24} sx={{ color: "#16b48e" }} />
            </Box>
        );
    }

    // Show error state
    if (error) {
        const errorMessage = error?.data?.message || 
                           (error?.status === 'CORS_ERROR' 
                               ? 'Unable to fetch crypto news due to CORS restrictions. Please try again later.' 
                               : 'Failed to load crypto news. Please try again later.');
        
        return (
            <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Unable to Load Crypto News
                </Typography>
                <Typography variant="body2">
                    {errorMessage}
                </Typography>
                {error?.status === 429 && (
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                        Rate limit exceeded. Please wait a few minutes before refreshing.
                    </Typography>
                )}
            </Alert>
        );
    }

    // Show empty state
    if (!news || news.length === 0) {
        return (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
                No crypto news available at the moment.
            </Alert>
        );
    }

    const isDark = theme.palette.mode === "dark";

    return (
        <Stack spacing={1.5}>
            {/* Real-time indicator */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: isFetching ? "#f59e0b" : "#16b48e",
                            animation: isFetching ? "pulse 1s infinite" : "none",
                            "@keyframes pulse": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.5 },
                            },
                        }}
                    />
                    <Typography variant="caption" sx={{ fontSize: "0.65rem", color: theme.palette.text.secondary }}>
                        {isFetching ? "Updating..." : "Live"}
                    </Typography>
                </Box>
                {lastUpdate && (
                    <Typography variant="caption" sx={{ fontSize: "0.6rem", color: alpha(theme.palette.text.secondary, 0.6) }}>
                        {lastUpdate.toLocaleTimeString()}
                    </Typography>
                )}
            </Box>
            <AnimatePresence>
            {news.map((item, i) => {
                const isNew = newItemIds.has(item.id);
                return (
                <MotionBox
                    key={item.id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ x: 4 }}
                    layout
                >
                    <Box
                        component="a"
                        href={`https://cryptopanic.com/news/${item.id}/${item?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            display: "block",
                            textDecoration: "none",
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: isNew 
                                ? alpha("#16b48e", 0.1) 
                                : isDark ? alpha("#fff", 0.03) : alpha("#000", 0.02),
                            border: `1px solid ${isNew ? "#16b48e" : alpha(isDark ? "#fff" : "#000", 0.06)}`,
                            transition: "all 0.3s ease",
                            position: "relative",
                            "&:hover": {
                                backgroundColor: isDark ? alpha("#fff", 0.06) : alpha("#000", 0.04),
                                borderColor: isDark ? "#e12e24" : "#16b48e",
                            },
                        }}
                    >
                        {isNew && (
                            <Chip
                                label="NEW"
                                size="small"
                                sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    height: 16,
                                    fontSize: "0.6rem",
                                    backgroundColor: "#16b48e",
                                    color: "#fff",
                                    fontWeight: 700,
                                }}
                            />
                        )}
                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                lineHeight: 1.4,
                                mb: 0.75,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {item.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <AccessTimeIcon sx={{ fontSize: 12, color: theme.palette.text.secondary }} />
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.65rem" }}>
                                {formatDate(item.published_at)}
                            </Typography>
                        </Stack>
                    </Box>
                </MotionBox>
            );
            })}
            </AnimatePresence>
        </Stack>
    );
};

export default CryptoNewsList;
