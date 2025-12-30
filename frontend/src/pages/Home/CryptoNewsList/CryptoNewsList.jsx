import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Stack, Box, useTheme, IconButton, CircularProgress, Alert } from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LaunchIcon from "@mui/icons-material/Launch";
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
    
    // ✅ Calling the RTK query hook with polling interval and skip for guest mode
    const { data, isLoading, error } = useGetCryptoNewsQuery(undefined, {
        // Poll every 5 minutes to reduce API calls and avoid rate limiting
        pollingInterval: 300000, // 5 minutes in milliseconds
        // Skip query when in guest mode
        skip: isGuestMode,
    });

    // ✅ Sync state when data is available
    useEffect(() => {
        if (data?.results?.length) {
            setNews(data.results.slice(0, 5));
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

    // Show loading state
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                <CircularProgress />
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
            <Alert severity="info" sx={{ mt: 2 }}>
                No crypto news available at the moment. Please check back later.
            </Alert>
        );
    }

    return (
        <Stack spacing={2}>
            {news.map((item, i) => (
                <MotionBox
                    key={item.id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.015 }}
                >
                    <Card
                        sx={{
                            borderRadius: 3,
                            p: 2,
                            background: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
                            boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0,0,0,0.06)",
                            transition: "all 0.3s ease-in-out",
                            cursor: "pointer",
                            "&:hover": {
                                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15), 0px 1px 5px rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        <CardContent>
                            <Stack spacing={1}>
                                <Typography
                                    variant="h6"
                                    fontSize={"17px"}
                                    fontWeight={700}
                                    color={theme.palette.text.primary}
                                >
                                    {item.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color={theme.palette.text.secondary}
                                    sx={{
                                        lineHeight: 1.6,
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {item.description}
                                </Typography>

                                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <AccessTimeIcon fontSize="small" />
                                        <Typography variant="caption">{formatDate(item.published_at)}</Typography>
                                    </Stack>
                                    <IconButton>
                                        <a
                                            href={`https://cryptopanic.com/news/${item.id}/${item?.slug}`}
                                            style={{ textDecoration: "none" }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {" "}
                                            <LaunchIcon fontSize="small" sx={{ opacity: 0.6 }} />{" "}
                                        </a>
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </MotionBox>
            ))}
        </Stack>
    );
};

export default CryptoNewsList;
