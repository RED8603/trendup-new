import { useState, useRef } from "react";
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
    useMediaQuery,
} from "@mui/material";
import {
    Send as SendIcon,
    Favorite as LikeIcon,
    Share as ShareIcon,
    AttachMoney as DonateIcon,
    EmojiEmotions as EmojiIcon,
    Chat as ChatIcon,
    Close as CloseIcon,
    Star as StarIcon,
    PersonAdd as PersonAddIcon,
    CardGiftcard as CardGiftcardIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

// Styled components
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

const LiveChat = ({
    messages,
    onSendMessage,
    onDonate,
    onLike,
    onSubscribe,
    onFollow,
    onGift,
    onShare,
    chatOpen,
    onToggleChat,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const emojiButtonRef = useRef(null);
    const [message, setMessage] = useState("");
    const [emojiAnchor, setEmojiAnchor] = useState(null);

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
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

    const emojiOpen = Boolean(emojiAnchor);

    return (
        <>
            {/* Mobile Chat Toggle */}
            <MobileChatToggle onClick={onToggleChat}>
                <ChatIcon />
            </MobileChatToggle>

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
                        <IconButton size="small" onClick={onLike} title="Send Like">
                            <LikeIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={onSubscribe} title="Subscribe">
                            <StarIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={onFollow} title="Follow">
                            <PersonAddIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={onGift} title="Send Gift">
                            <CardGiftcardIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={onDonate} title="Donate">
                            <DonateIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={onShare} title="Share">
                            <ShareIcon fontSize="small" />
                        </IconButton>
                        {isMobile && (
                            <IconButton size="small" onClick={onToggleChat}>
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
        </>
    );
};

export default LiveChat;
