import { useGetCryptoMarketQuery } from "@/api/slices/coingeckoApi";
import coinIcons from "@/assets";
import { Card, Typography, CircularProgress, Box, Avatar, Paper } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const CryptoMarketList = () => {
    const { data, isLoading } = useGetCryptoMarketQuery();

    if (isLoading) return <CircularProgress />;
    return (
        <Box display="flex" gap={2} flexDirection={"column"} justifyContent="center" alignItems={"center"} p={2}>
            {Object.entries(data).map(([coin, info]) => {
                return (
                    <MotionBox
                        key={coin}
                        component={Paper}
                        elevation={4}
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        sx={{
                            p: 2,
                            minWidth: 200,
                            borderRadius: 3,
                            background: (theme) => (theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa"),
                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Avatar src={coinIcons[coin]} alt={coin} sx={{ width: 48, height: 48 }} />
                        <Box>
                            <Typography variant="h6" fontWeight={600} textTransform="capitalize">
                                {coin}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                ${info.usd.toLocaleString()}
                            </Typography>
                        </Box>
                    </MotionBox>
                );
            })}
        </Box>
    );
};

export default CryptoMarketList;
