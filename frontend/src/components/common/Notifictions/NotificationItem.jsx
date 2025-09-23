import { Box, Avatar, Typography, useTheme, Paper } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const NotificationItem = ({ title, time, avatar, read }) => {
    const theme = useTheme();

    return (
        <MotionBox
            component={Paper}
            elevation={read ? 0 : 2}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            sx={{
                p: 1.5,
                my: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                background: read
                    ? theme.palette.mode === "dark"
                        ? "#2a2a2a"
                        : "#f8f8f8"
                    : theme.palette.mode === "dark"
                    ? "#1e1e1e"
                    : "#ffffff",
                boxShadow: read ? "none" : "0px 4px 12px rgba(0,0,0,0.1)",
            }}
        >
            <Avatar src={avatar} sx={{ width: 40, height: 40, bgcolor: "primary.main" }} />
            <Box>
                <Typography fontWeight={read ? 400 : 600} fontSize="0.95rem">
                    {title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {time}
                </Typography>
            </Box>
        </MotionBox>
    );
};

export default NotificationItem;
