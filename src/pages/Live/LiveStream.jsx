import { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Avatar,
    Chip,
    Stack,
    styled,
    alpha,
    useTheme,
    Popover,
    Grid2,
    useMediaQuery,
} from "@mui/material";
import {
    Send as SendIcon,
    VideocamOff as StopIcon,
    MoreVert as MoreIcon,
    Favorite as LikeIcon,
    Share as ShareIcon,
    AttachMoney as DonateIcon,
    EmojiEmotions as EmojiIcon,
    MicExternalOnSharp as MicIcon,
    VideoCall as VideoIcon,
    ScreenShare as ScreenShareIcon,
    Menu as MenuIcon,
    Chat as ChatIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

// Styled components
const LiveContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    background:
        theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${alpha(theme.palette.primary.dark, 0.7)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${alpha(theme.palette.primary.light, 0.3)} 100%)`,
    position: "relative",
    overflow: "hidden",
}));

const VideoFeedContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    position: "relative",
    background: theme.palette.grey[900],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(2),
    },
}));

const VideoGrid = styled(Grid2)(({ theme }) => ({
    width: "100%",
    height: "100%",
    gap: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
        gap: theme.spacing(2),
    },
}));

const VideoTile = styled(motion.div)(({ theme, isActive }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius * 2,
    overflow: "hidden",
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    border: isActive ? `2px solid ${theme.palette.primary.main}` : "none",
    boxShadow: isActive ? `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}` : "none",
    height: "100%",
    minHeight: 150,
    [theme.breakpoints.up("sm")]: {
        border: isActive ? `3px solid ${theme.palette.primary.main}` : "none",
        boxShadow: isActive ? `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}` : "none",
    },
}));

const UserVideo = styled(Box)({
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
});

const UserInfo = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: 4,
    left: 4,
    display: "flex",
    alignItems: "center",
    gap: 4,
    backgroundColor: alpha(theme.palette.grey[900], 0.7),
    padding: "2px 6px",
    borderRadius: 12,
    color: theme.palette.common.white,
    fontSize: "0.75rem",
    [theme.breakpoints.up("sm")]: {
        bottom: 8,
        left: 8,
        gap: 8,
        padding: "4px 8px",
        borderRadius: 16,
        fontSize: "inherit",
    },
}));

const ControlsOverlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: 4,
    right: 4,
    display: "flex",
    gap: 2,
    backgroundColor: alpha(theme.palette.grey[900], 0.7),
    padding: "2px",
    borderRadius: 6,
    [theme.breakpoints.up("sm")]: {
        bottom: 8,
        right: 8,
        gap: 4,
        padding: "4px",
        borderRadius: 8,
    },
}));

const LiveBadge = styled(Chip)(({ theme }) => ({
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fontWeight: 700,
    fontSize: "0.6rem",
    height: 20,
    "& .MuiChip-label": {
        padding: "0 6px",
    },
    [theme.breakpoints.up("sm")]: {
        top: 8,
        left: 8,
        fontSize: "0.7rem",
        height: 24,
        "& .MuiChip-label": {
            padding: "0 8px",
        },
    },
}));

const ViewerCount = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: alpha(theme.palette.grey[900], 0.7),
    color: theme.palette.common.white,
    padding: "4px 8px",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    fontWeight: 600,
    [theme.breakpoints.up("sm")]: {
        top: 16,
        right: 16,
        fontSize: 14,
        padding: "6px 12px",
    },
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
    [theme.breakpoints.down("md")]: {
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        transform: "translateX(100%)",
        transition: "transform 0.3s ease",
        zIndex: 1000,
        "&.chat-open": {
            transform: "translateX(0)",
        },
    },
    [theme.breakpoints.down("sm")]: {
        width: "100%",
    },
}));

const MessageItem = styled(Box)(({ theme, type }) => ({
    display: "flex",
    alignItems: "flex-start",
    padding: "6px 8px",
    backgroundColor: type === "donation" ? alpha(theme.palette.success.light, 0.2) : "transparent",
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    [theme.breakpoints.up("sm")]: {
        padding: "8px 12px",
    },
}));

const EmojiPickerContainer = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: "100%",
    right: 0,
    marginBottom: 8,
    zIndex: 1000,
    "& .emoji-picker-react": {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: theme.shape.borderRadius * 2,
        boxShadow: theme.shadows[8],
        width: "100% !important",
        maxWidth: 350,
    },
    [theme.breakpoints.down("sm")]: {
        right: "auto",
        left: 0,
        "& .emoji-picker-react": {
            maxWidth: "100%",
        },
    },
}));

const MobileChatToggle = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: alpha(theme.palette.primary.main, 0.8),
    color: theme.palette.common.white,
    zIndex: 100,
    display: "none",
    [theme.breakpoints.down("md")]: {
        display: "flex",
    },
}));

const LiveStreamView = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const emojiButtonRef = useRef(null);
    const [message, setMessage] = useState("");
    const [viewers, setViewers] = useState(1254);
    const [messages, setMessages] = useState([
        { user: "Justin", text: "Awesome stream!", type: "message" },
        { user: "Emma", text: "Thank you!", type: "message" },
        { user: "Adam", text: "donated $19.99", type: "donation" },
    ]);
    const [emojiAnchor, setEmojiAnchor] = useState(null);
    const [liveUsers, setLiveUsers] = useState([
        { id: 1, name: "Emma", isActive: true, isSpeaking: true, hasVideo: true, hasAudio: true },
        { id: 2, name: "Alex", isActive: false, isSpeaking: false, hasVideo: true, hasAudio: false },
        { id: 3, name: "Jordan", isActive: false, isSpeaking: true, hasVideo: false, hasAudio: true },
        { id: 3, name: "James", isActive: false, isSpeaking: true, hasVideo: true, hasAudio: true },
    ]);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setViewers((prev) => prev + Math.floor(Math.random() * 10) - 3);
            setLiveUsers((prev) =>
                prev.map((user) => ({
                    ...user,
                    isSpeaking: Math.random() > 0.7,
                    hasVideo: Math.random() > 0.2,
                    hasAudio: Math.random() > 0.3,
                }))
            );
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

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
        setEmojiAnchor(null);
    };

    const handleEmojiButtonClick = (event) => {
        setEmojiAnchor(event.currentTarget);
    };

    const handleEmojiClose = () => {
        setEmojiAnchor(null);
    };

    const handleUserClick = (userId) => {
        setLiveUsers((prev) =>
            prev.map((user) => ({
                ...user,
                isActive: user.id === userId,
            }))
        );
    };

    const toggleChat = () => {
        setChatOpen(!chatOpen);
    };

    const emojiOpen = Boolean(emojiAnchor);

    const getGridColumns = (count) => {
        if (isSmallMobile) return 12;
        if (count <= 2) return 6;
        if (count <= 4) return 4;
        return 3;
    };

    return (
        <LiveContainer>
            <Box sx={{ display: "flex", height: "100%", position: "relative" }}>
                {/* Mobile Chat Toggle */}
                <MobileChatToggle onClick={toggleChat}>
                    <ChatIcon />
                </MobileChatToggle>

                {/* Dynamic Video Grid */}
                <VideoFeedContainer>
                    <VideoGrid container spacing={isSmallMobile ? 1 : 2}>
                        {liveUsers.map((user) => (
                            <Grid2
                                key={user.id}
                                size={{
                                    xs: 12,
                                    sm: getGridColumns(liveUsers.length),
                                    md: liveUsers.length <= 2 ? 6 : 4,
                                }}
                            >
                                <VideoTile
                                    isActive={user.isActive}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    <UserVideo>
                                        {user.hasVideo ? (
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography variant={isSmallMobile ? "body1" : "h6"}>
                                                    {user.name}'s Video
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Avatar
                                                sx={{
                                                    width: isSmallMobile ? 60 : 80,
                                                    height: isSmallMobile ? 60 : 80,
                                                    bgcolor: theme.palette.primary.main,
                                                    fontSize: isSmallMobile ? "1.5rem" : "2rem",
                                                }}
                                            >
                                                {user.name[0]}
                                            </Avatar>
                                        )}
                                    </UserVideo>

                                    <UserInfo>
                                        <Avatar
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                fontSize: "0.7rem",
                                                bgcolor: user.isSpeaking
                                                    ? theme.palette.success.main
                                                    : theme.palette.grey[500],
                                            }}
                                        >
                                            {user.name[0]}
                                        </Avatar>
                                        <Typography variant="caption">{user.name}</Typography>
                                    </UserInfo>

                                    <LiveBadge
                                        label="LIVE"
                                        icon={
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 4,
                                                        height: 4,
                                                        borderRadius: "50%",
                                                        backgroundColor: theme.palette.error.contrastText,
                                                    }}
                                                />
                                            </motion.div>
                                        }
                                    />

                                    <ControlsOverlay>
                                        {!user.hasVideo && (
                                            <VideoIcon sx={{ fontSize: 14, color: theme.palette.error.main }} />
                                        )}
                                        {!user.hasAudio && (
                                            <MicIcon sx={{ fontSize: 14, color: theme.palette.error.main }} />
                                        )}
                                    </ControlsOverlay>
                                </VideoTile>
                            </Grid2>
                        ))}
                    </VideoGrid>

                    <ViewerCount>
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: theme.palette.error.main,
                                mr: 1,
                            }}
                        />
                        {viewers.toLocaleString()} watching
                    </ViewerCount>

                    <Stack direction="row" spacing={1} sx={{ position: "absolute", bottom: 8, left: 8 }}>
                        <IconButton
                            sx={{
                                backgroundColor: alpha(theme.palette.error.main, 0.8),
                                color: theme.palette.error.contrastText,
                                "&:hover": {
                                    backgroundColor: theme.palette.error.main,
                                },
                                fontSize: isSmallMobile ? "small" : "medium",
                            }}
                        >
                            <StopIcon fontSize={isSmallMobile ? "small" : "medium"} />
                        </IconButton>

                        <IconButton
                            sx={{
                                backgroundColor: alpha(theme.palette.grey[900], 0.7),
                                color: theme.palette.common.white,
                                fontSize: isSmallMobile ? "small" : "medium",
                            }}
                        >
                            <ScreenShareIcon fontSize={isSmallMobile ? "small" : "medium"} />
                        </IconButton>

                        <IconButton
                            sx={{
                                backgroundColor: alpha(theme.palette.grey[900], 0.7),
                                color: theme.palette.common.white,
                                fontSize: isSmallMobile ? "small" : "medium",
                            }}
                        >
                            <MoreIcon fontSize={isSmallMobile ? "small" : "medium"} />
                        </IconButton>
                    </Stack>
                </VideoFeedContainer>

                {/* Chat Panel */}
                <ChatContainer className={chatOpen ? "chat-open" : ""}>
                    <Box
                        sx={{
                            p: 1,
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            [theme.breakpoints.up("sm")]: {
                                p: 2,
                            },
                        }}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            Live Chat
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                            <IconButton size="small">
                                <LikeIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={handleDonate}>
                                <DonateIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                                <ShareIcon fontSize="small" />
                            </IconButton>
                            {isMobile && (
                                <IconButton size="small" onClick={toggleChat}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Stack>
                    </Box>

                    <Box sx={{ flex: 1, overflowY: "auto", p: 0.5 }}>
                        {messages.map((msg, index) => (
                            <MessageItem key={index} type={msg.type}>
                                <Avatar
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        mr: 1,
                                        fontSize: "0.8rem",
                                        [theme.breakpoints.up("sm")]: {
                                            width: 32,
                                            height: 32,
                                            mr: 1.5,
                                        },
                                    }}
                                >
                                    {msg.user[0]}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                                        {msg.user}
                                        {msg.type === "donation" && (
                                            <Chip
                                                label="DONATION"
                                                size="small"
                                                sx={{
                                                    ml: 0.5,
                                                    height: 14,
                                                    fontSize: "0.5rem",
                                                    backgroundColor: alpha(theme.palette.success.main, 0.2),
                                                    color: theme.palette.success.main,
                                                    [theme.breakpoints.up("sm")]: {
                                                        ml: 1,
                                                        height: 16,
                                                        fontSize: "0.6rem",
                                                    },
                                                }}
                                            />
                                        )}
                                    </Typography>
                                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                        {msg.text}
                                    </Typography>
                                </Box>
                            </MessageItem>
                        ))}
                    </Box>

                    {/* Enhanced Message Input with Emoji Picker */}
                    <Box
                        sx={{
                            p: 1,
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            position: "relative",
                            [theme.breakpoints.up("sm")]: {
                                p: 2,
                            },
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Send a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <IconButton
                                        ref={emojiButtonRef}
                                        onClick={handleEmojiButtonClick}
                                        size="small"
                                        sx={{
                                            mr: 0.5,
                                            color: theme.palette.text.secondary,
                                            "&:hover": {
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    >
                                        <EmojiIcon fontSize="small" />
                                    </IconButton>
                                ),
                                endAdornment: (
                                    <IconButton
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                        size="small"
                                        sx={{
                                            color: message.trim()
                                                ? theme.palette.primary.main
                                                : theme.palette.text.disabled,
                                        }}
                                    >
                                        <SendIcon fontSize="small" />
                                    </IconButton>
                                ),
                                sx: {
                                    borderRadius: 3,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                    "&:hover": {
                                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                    },
                                    fontSize: "0.875rem",
                                    [theme.breakpoints.up("sm")]: {
                                        borderRadius: 4,
                                        fontSize: "1rem",
                                    },
                                },
                            }}
                        />

                        {/* Emoji Picker Popover */}
                        <Popover
                            open={emojiOpen}
                            anchorEl={emojiAnchor}
                            onClose={handleEmojiClose}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            sx={{
                                "& .MuiPopover-paper": {
                                    backgroundColor: "transparent",
                                    boxShadow: "none",
                                    overflow: "visible",
                                },
                            }}
                        >
                            <EmojiPickerContainer>
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    autoFocusSearch={false}
                                    theme={theme.palette.mode}
                                    skinTonesDisabled
                                    searchDisabled={false}
                                    width={isSmallMobile ? 300 : 350}
                                    height={isSmallMobile ? 300 : 400}
                                />
                            </EmojiPickerContainer>
                        </Popover>
                    </Box>
                </ChatContainer>
            </Box>
        </LiveContainer>
    );
};

export default LiveStreamView;
