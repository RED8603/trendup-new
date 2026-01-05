import { useGetCryptoMarketQuery } from "@/api/slices/coingeckoApi";
import coinIcons from "@/assets";
import { Typography, CircularProgress, Box, Avatar, alpha, useTheme, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useState, useEffect, useRef } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const MotionBox = motion(Box);

const mockPriceSeries = (price) => {
    const fluctuation = 0.05;
    const length = 20;
    const series = Array.from({ length }, () => {
        const variation = (Math.random() - 0.5) * 2 * fluctuation;
        price += price * variation;
        return +price.toFixed(2);
    });
    return series;
};

const formatCoinName = (coin) => {
    const names = {
        bitcoin: "Bitcoin",
        ethereum: "Ethereum",
        solana: "Solana",
        dogecoin: "Dogecoin",
        binancecoin: "BNB",
        cardano: "Cardano",
        polkadot: "Polkadot",
        tron: "TRON",
        chainlink: "Chainlink",
        polygon: "Polygon",
        litecoin: "Litecoin",
        uniswap: "Uniswap",
    };
    return names[coin] || coin.charAt(0).toUpperCase() + coin.slice(1);
};

const CryptoMarketList = () => {
    const theme = useTheme();
    const [priceChanges, setPriceChanges] = useState({});
    const [lastUpdate, setLastUpdate] = useState(null);
    const [countdown, setCountdown] = useState(15);
    const previousPricesRef = useRef({});
    
    // Real-time polling every 15 seconds for market data
    const { data, isLoading, error, isFetching, refetch } = useGetCryptoMarketQuery(undefined, {
        pollingInterval: 15000, // 15 seconds for real-time price updates
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const isDark = theme.palette.mode === "dark";
    
    // Countdown timer for next update
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev <= 1 ? 15 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    
    // Reset countdown when data updates
    useEffect(() => {
        if (data) {
            setCountdown(15);
        }
    }, [data]);
    
    // Track price changes
    useEffect(() => {
        if (data) {
            const changes = {};
            Object.entries(data).forEach(([coin, info]) => {
                const prevPrice = previousPricesRef.current[coin];
                if (prevPrice !== undefined && prevPrice !== info.usd) {
                    changes[coin] = info.usd > prevPrice ? "up" : "down";
                }
            });
            
            if (Object.keys(changes).length > 0) {
                setPriceChanges(changes);
                // Clear change indicators after 2 seconds
                setTimeout(() => setPriceChanges({}), 2000);
            }
            
            // Store current prices for next comparison
            const newPrices = {};
            Object.entries(data).forEach(([coin, info]) => {
                newPrices[coin] = info.usd;
            });
            previousPricesRef.current = newPrices;
            setLastUpdate(new Date());
        }
    }, [data]);

    if (isLoading && !data) {
        return (
            <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={24} sx={{ color: "#16b48e" }} />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                Unable to load market data.
            </Typography>
        );
    }

    const topCoins = Object.entries(data).slice(0, 6);

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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* Countdown to next update */}
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            fontSize: "0.6rem", 
                            color: alpha(theme.palette.text.secondary, 0.6),
                            fontFamily: "monospace",
                        }}
                    >
                        {countdown}s
                    </Typography>
                    {/* Manual refresh button */}
                    <Box
                        component="button"
                        onClick={() => refetch()}
                        sx={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            color: theme.palette.text.secondary,
                            transition: "color 0.2s, transform 0.2s",
                            "&:hover": {
                                color: "#16b48e",
                                transform: "rotate(180deg)",
                            },
                        }}
                        title="Refresh now"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                        </svg>
                    </Box>
                </Box>
            </Box>
            <AnimatePresence>
            {topCoins.map(([coin, info], index) => {
                const prices = mockPriceSeries(info.usd);
                const isUpwardTrend = prices[prices.length - 1] >= prices[0];
                const lineColor = isUpwardTrend ? "#16b48e" : "#ef4444";
                const priceChange = priceChanges[coin];

                const chartOptions = {
                    grid: { left: 0, right: 0, top: 0, bottom: 0 },
                    xAxis: { type: "category", show: false, data: prices.map((_, i) => i) },
                    yAxis: { type: "value", show: false },
                    series: [{
                        data: prices,
                        type: "line",
                        smooth: true,
                        showSymbol: false,
                        lineStyle: { width: 1.5, color: lineColor },
                        areaStyle: { color: alpha(lineColor, 0.1) },
                    }],
                };

                return (
                    <MotionBox
                        key={coin}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0,
                            scale: priceChange ? [1, 1.02, 1] : 1,
                            backgroundColor: priceChange === "up" 
                                ? [alpha("#16b48e", 0.2), alpha(isDark ? "#fff" : "#000", 0.03)]
                                : priceChange === "down"
                                ? [alpha("#ef4444", 0.2), alpha(isDark ? "#fff" : "#000", 0.03)]
                                : alpha(isDark ? "#fff" : "#000", 0.03),
                        }}
                        transition={{ duration: priceChange ? 0.5 : 0.2, delay: index * 0.03 }}
                        whileHover={{ x: 4 }}
                        layout
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${priceChange ? (priceChange === "up" ? "#16b48e" : "#ef4444") : alpha(isDark ? "#fff" : "#000", 0.06)}`,
                            transition: "border-color 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                                borderColor: lineColor,
                            },
                        }}
                    >
                        <Avatar 
                            src={coinIcons[coin]} 
                            alt={coin} 
                            sx={{ width: 32, height: 32 }} 
                        />
                        <Box flex={1} minWidth={0}>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: theme.palette.text.primary }}>
                                {formatCoinName(coin)}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography 
                                    sx={{ 
                                        fontSize: "0.75rem", 
                                        fontWeight: 600, 
                                        color: lineColor,
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    ${info.usd.toLocaleString(undefined, { 
                                        minimumFractionDigits: info.usd < 1 ? 4 : 2,
                                        maximumFractionDigits: info.usd < 1 ? 4 : 2,
                                    })}
                                </Typography>
                                {priceChange && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                    >
                                        {priceChange === "up" ? (
                                            <TrendingUpIcon sx={{ fontSize: 14, color: "#16b48e" }} />
                                        ) : (
                                            <TrendingDownIcon sx={{ fontSize: 14, color: "#ef4444" }} />
                                        )}
                                    </motion.div>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ width: 60, height: 30 }}>
                            <ReactECharts
                                option={chartOptions}
                                style={{ height: "100%", width: "100%" }}
                                opts={{ renderer: "svg" }}
                            />
                        </Box>
                    </MotionBox>
                );
            })}
            </AnimatePresence>
        </Stack>
    );
};

export default CryptoMarketList;
