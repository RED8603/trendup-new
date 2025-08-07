import { useState } from "react";
import { Badge, IconButton, Popover, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { motion, AnimatePresence } from "framer-motion";
import NotificationItem from "./NotificationItem";

const MotionIconButton = motion(IconButton);
const MotionBadge = motion(Badge);

const NotificationBell = ({ notifications = [] }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const hasUnread = notifications.some((n) => !n.read);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsOpen((prev) => !prev);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsOpen(false);
    };

    return (
        <>
            <MotionIconButton
                onClick={handleClick}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                sx={{ position: "relative", color: "text.primary" }}
            >
                <AnimatePresence>
                    {hasUnread && (
                        <MotionBadge
                            component="div"
                            color="error"
                            variant="dot"
                            overlap="circular"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                // width: 10,
                                // height: 10,
                                // borderRadius: "50%",
                                // backgroundColor: "error.main",
                            }}
                        />
                    )}
                </AnimatePresence>
                <NotificationsNoneIcon />
            </MotionIconButton>

            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        p: 1,
                        borderRadius: 2,
                        minWidth: 300,
                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1e1e1e" : "#fff"),
                        boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
                    },
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom align="center" >
                    Notifications{" "}
                    <Box component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
                        (4 new)
                    </Box>
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                        <Typography variant="body2" sx={{ p: 2 }}>
                            No new notifications.
                        </Typography>
                    ) : (
                        notifications.map((notif, index) => (
                            <NotificationItem
                                key={index}
                                title={notif.title}
                                time={notif.time}
                                avatar={notif.avatar} // fallback to an icon if not provided
                                read={notif.read}
                            />
                        ))
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default NotificationBell;
