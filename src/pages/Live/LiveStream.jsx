import { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton, TextField, Avatar, Chip, Stack, styled, alpha, useTheme } from "@mui/material";
import {
    Send as SendIcon,
    VideocamOff as StopIcon,
    MoreVert as MoreIcon,
    Favorite as LikeIcon,
    Share as ShareIcon,
    AttachMoney as DonateIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Styled components
const LiveContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "calc(100vh - 120px)",
    flexDirection: "column",
    background:
        theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${alpha(theme.palette.primary.dark, 0.7)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${alpha(theme.palette.primary.light, 0.3)} 100%)`,
    position: "relative",
    overflow: "hidden",
    flexGrow: 1,
}));

const VideoFeed = styled(motion.div)(({ theme }) => ({
    flex: 1,
    position: "relative",
    background: theme.palette.grey[900],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
}));

const LiveBadge = styled(Chip)(({ theme }) => ({
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fontWeight: 700,
    padding: "4px 8px",
    "& .MuiChip-label": {
        paddingLeft: 8,
        paddingRight: 8,
    },
}));

const ViewerCount = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: alpha(theme.palette.grey[900], 0.7),
    color: theme.palette.common.white,
    padding: "6px 12px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 600,
}));

const ChatContainer = styled(Box)(({ theme }) => ({
    width: 350,
    height: "100%",
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    backdropFilter: "blur(8px)",
    borderLeft: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
}));

const MessageItem = styled(Box)(({ theme, type }) => ({
    display: "flex",
    alignItems: "flex-start",
    padding: "8px 12px",
    backgroundColor: type === "donation" ? alpha(theme.palette.success.light, 0.2) : "transparent",
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const LiveStreamView = () => {
    const theme = useTheme();
    const _videoRef = useRef(null);
    const [message, setMessage] = useState("");
    const [viewers, setViewers] = useState(1254);
    const [messages, setMessages] = useState([
        { user: "Justin", text: "Awesome stream!", type: "message" },
        { user: "Emma", text: "Thank you!", type: "message" },
        { user: "Adam", text: "donated $19.99", type: "donation" },
    ]);

    useEffect(() => {
        // Simulate viewer count changes
        const interval = setInterval(() => {
            setViewers((prev) => prev + Math.floor(Math.random() * 10) - 3);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { user: "You", text: message, type: "message" }]);
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleDonate = () => {
        setMessages([
            ...messages,
            {
                user: "Anonymous",
                text: `donated $${(Math.random() * 50 + 5).toFixed(2)}`,
                type: "donation",
            },
        ]);
    };

    return (
        <LiveContainer>
            <Box sx={{ display: "flex", height: "100%" }}>
                {/* Main Video Feed */}
                <VideoFeed initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    {/* This would be replaced with actual video feed */}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: theme.palette.common.white,
                            fontSize: 24,
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                        }}
                    >
                        <Typography variant="h4">Live Camera Feed</Typography>
                    </Box>

                    <LiveBadge
                        label="LIVE"
                        icon={
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: theme.palette.error.contrastText,
                                        ml: 1,
                                    }}
                                />
                            </motion.div>
                        }
                    />

                    <ViewerCount>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: theme.palette.error.main,
                                mr: 1,
                            }}
                        />
                        {viewers.toLocaleString()} watching
                    </ViewerCount>

                    {/* Streamer Controls */}
                    <Stack direction="row" spacing={2} sx={{ position: "absolute", bottom: 16 }}>
                        <IconButton
                            sx={{
                                backgroundColor: alpha(theme.palette.error.main, 0.8),
                                color: theme.palette.error.contrastText,
                                "&:hover": {
                                    backgroundColor: theme.palette.error.main,
                                },
                            }}
                        >
                            <StopIcon />
                        </IconButton>

                        <IconButton
                            sx={{
                                backgroundColor: alpha(theme.palette.grey[900], 0.7),
                                color: theme.palette.common.white,
                            }}
                        >
                            <MoreIcon />
                        </IconButton>
                    </Stack>
                </VideoFeed>

                {/* Chat Panel */}
                <ChatContainer>
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            Live Chat
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small">
                                <LikeIcon color="primary" />
                            </IconButton>
                            <IconButton size="small" onClick={handleDonate}>
                                <DonateIcon color="success" />
                            </IconButton>
                            <IconButton size="small">
                                <ShareIcon />
                            </IconButton>
                        </Stack>
                    </Box>

                    {/* Messages List */}
                    <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
                        {messages.map((msg, index) => (
                            <MessageItem key={index} type={msg.type}>
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        mr: 1.5,
                                        bgcolor:
                                            msg.type === "donation"
                                                ? theme.palette.success.main
                                                : theme.palette.primary.main,
                                    }}
                                >
                                    {msg.user[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {msg.user}
                                        {msg.type === "donation" && (
                                            <Chip
                                                label="DONATION"
                                                size="small"
                                                sx={{
                                                    ml: 1,
                                                    height: 16,
                                                    fontSize: "0.6rem",
                                                    backgroundColor: alpha(theme.palette.success.main, 0.2),
                                                    color: theme.palette.success.main,
                                                }}
                                            />
                                        )}
                                    </Typography>
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Box>
                            </MessageItem>
                        ))}
                    </Box>

                    {/* Message Input */}
                    <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
                        <TextField
                            fullWidth
                            placeholder="Send a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                        sx={{
                                            color: message.trim()
                                                ? theme.palette.primary.main
                                                : theme.palette.text.disabled,
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                ),
                                sx: {
                                    borderRadius: 4,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                    "&:hover": {
                                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                    },
                                },
                            }}
                        />
                    </Box>
                </ChatContainer>
            </Box>
        </LiveContainer>
    );
};

export default LiveStreamView;
