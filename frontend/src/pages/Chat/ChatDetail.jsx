import { useRef, useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    Chip,
    LinearProgress,
    Tooltip,
    Badge,
    ButtonGroup,
    Divider,
    styled,
    useTheme,
    alpha,
} from "@mui/material";
import {
    Send as SendIcon,
    EmojiEmotions as EmojiIcon,
    AttachFile as AttachIcon,
    Image as ImageIcon,
    Description as FileIcon,
    Close as CloseIcon,
    Reply as ReplyIcon,
    MoreVert as MoreIcon,
    Menu as MenuIcon,
    Call as CallIcon,
    Videocam as VideoIcon,
    Info as InfoIcon,
    Verified,
    PushPin as PinIcon,
    Mic as MicIcon,
    Stop as StopIcon,
    Cancel as CancelIcon,
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "../../components/common/EmojiPicker/EmojiPicker";
import MessageMenu, { MessageMenuButton } from "./components/MessageMenu";
import DeleteMessageDialog from "./components/DeleteMessageDialog";
import EditMessageInput from "./components/EditMessageInput";
import ConversationSettingsMenu, { ConversationSettingsButton } from "./components/ConversationSettingsMenu";
import PinnedMessagesDialog from "./components/PinnedMessagesDialog";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

// Voice Note Player Component
const VoiceNotePlayer = ({ attachment, isCurrentUser, theme, alpha }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <Paper
            component={motion.div}
            sx={{
                padding: theme.spacing(1.5),
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(1.5),
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(8px)",
                borderRadius: theme.shape.borderRadius * 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                minWidth: 250,
                maxWidth: "100%",
                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
            }}
        >
            <audio
                ref={audioRef}
                src={attachment.url}
                preload="metadata"
                style={{ display: 'none' }}
            />
            <IconButton
                onClick={togglePlay}
                size="small"
                sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                }}
            >
                {isPlaying ? <PauseIcon color="primary" /> : <PlayIcon color="primary" />}
            </IconButton>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
                        {formatTime(currentTime)}
                    </Typography>
                    <Box
                        sx={{
                            flex: 1,
                            height: 4,
                            backgroundColor: alpha(theme.palette.divider, 0.2),
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${progress}%`,
                                backgroundColor: theme.palette.primary.main,
                                transition: 'width 0.1s linear',
                            }}
                        />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
                        {formatTime(duration)}
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Voice note
                </Typography>
            </Box>
        </Paper>
    );
};

// Modern styled components
const MessageContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius * 2,
    transition: theme.transitions.create(["background-color", "transform"]),
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
    marginBottom: theme.spacing(0.5),
}));

const ChatBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$iscurrentuser',
})(({ theme, $iscurrentuser }) => ({
    backgroundColor: $iscurrentuser ? alpha(theme.palette.primary.main, 0.15) : theme.palette.background.paper,
    borderRadius: $iscurrentuser
        ? `${theme.shape.borderRadius * 3}px ${theme.shape.borderRadius * 3}px 0 ${theme.shape.borderRadius * 3}px`
        : `${theme.shape.borderRadius * 3}px ${theme.shape.borderRadius * 3}px ${theme.shape.borderRadius * 3}px 0`,
    padding: theme.spacing(1.5, 2),
    maxWidth: "75%",
    boxShadow: theme.shadows[1],
    position: "relative",
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    backdropFilter: "blur(8px)",
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  opacity: 0,
  transition: theme.transitions.create("opacity"),
  display: "flex",
  gap: theme.spacing(0.5),
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.default, 0.9),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(0.5),
  backdropFilter: "blur(4px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,

  ".message-container:hover &": {
    opacity: 1,
  },
}));
const ChatContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: `radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 40%)`,
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
}));

// Styled component for typing indicator dots
const TypingDot = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'delay',
})(({ theme, delay = 0 }) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    animation: 'typingBounce 1.4s infinite ease-in-out',
    animationDelay: `${delay}s`,
    '@keyframes typingBounce': {
        '0%, 80%, 100%': {
            transform: 'scale(0)',
            opacity: 0.5,
        },
        '40%': {
            transform: 'scale(1)',
            opacity: 1,
        },
    },
}));

export default function ChatDetail({
    conversation,
    messages = [],
    newMessage,
    selectedFiles,
    emojiAnchor,
    reactionAnchor,
    uploadProgress,
    replyTo,
    typingUsers = [],
    isMobile,
    isConnected = false,
    sendingMessage,
    onOpenDrawer,
    onMessageChange,
    onFileSelect,
    onRemoveFile,
    onSendMessage,
    onSendVoiceNote,
    onKeyDown,
    onEmojiClick,
    onEmojiClose,
    onEmojiSelect,
    onReactionClick,
    onReactionClose,
    onAddReaction,
    onEditMessage,
    onDeleteMessage,
    onPinMessage,
    pinnedMessages = [],
    onArchiveConversation,
    onMuteConversation,
    onViewArchived,
    onSearchMessages,
    onReply,
    onCancelReply,
}) {
    const theme = useTheme();
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingIndicatorRef = useRef(null);
    const messagesContainerRef = useRef(null);
    
    // State for scroll to bottom FAB
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    
    // Get current user from Redux - MUST be at top level, not inside map
    const { user } = useSelector((state) => state.user);
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    // Voice recorder hook
    const { 
        isRecording, 
        recordingDuration, 
        audioBlob, 
        isProcessing,
        error: recordingError,
        startRecording, 
        stopRecording, 
        cancelRecording, 
        formatDuration 
    } = useVoiceRecorder();
    
    // Debug: Log when blob becomes available
    useEffect(() => {
        if (audioBlob) {
            console.log('[ChatDetail] Audio blob ready:', audioBlob.size, 'bytes');
        }
    }, [audioBlob]);
    
    // State for message menu and dialogs
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [deletingMessageId, setDeletingMessageId] = useState(null);
    
    // State for conversation settings menu
    const [settingsAnchor, setSettingsAnchor] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pinnedMessagesDialogOpen, setPinnedMessagesDialogOpen] = useState(false);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Handle scroll to detect when user scrolls up
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollToBottom(!isNearBottom);
            
            // Reset new messages count when scrolled to bottom
            if (isNearBottom) {
                setNewMessagesCount(0);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Track new messages when user is scrolled up
    useEffect(() => {
        if (messages.length > 0 && showScrollToBottom) {
            setNewMessagesCount(prev => prev + 1);
        }
    }, [messages.length, showScrollToBottom]);

    const formatFileSize = useCallback((bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }, []);

    const formatTime = useCallback((date) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }, []);

    const formatDate = useCallback((date) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset time for comparison
        const dateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return 'Today';
        } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
            return 'Yesterday';
        } else {
            return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: dateObj.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
        }
    }, []);

    const shouldShowDateDivider = useCallback((currentMessage, previousMessage) => {
        if (!previousMessage) return true;
        
        const currentDate = new Date(currentMessage.createdAt || currentMessage.timestamp);
        const previousDate = new Date(previousMessage.createdAt || previousMessage.timestamp);
        
        // Show divider if different day
        return currentDate.toDateString() !== previousDate.toDateString();
    }, []);

    const getReplyMessage = useCallback((messageId) => {
        if (!messageId) return null;
        
        // Handle both object and string IDs
        const replyId = typeof messageId === 'object' 
            ? (messageId._id || messageId.id || messageId)
            : messageId;
        
        return messages.find((msg) => {
            const msgId = msg._id || msg.id;
            return String(msgId) === String(replyId);
        });
    }, [messages]);

    // Get current user from Redux
    const currentUserId = user?._id;
    
    // Get other participants for display (exclude current user)
    const otherParticipants = conversation?.participants?.filter(p => {
        const participantId = p.userId?._id || p.userId;
        return participantId && String(participantId) !== String(currentUserId);
    }) || [];
    

    const handleCall = () => {
        // TODO: Implement voice call
    };

    const handleVideoCall = () => {
        // TODO: Implement video call
    };

    return (
        <ChatContainer>
            {/* Header with call buttons */}
            <Box
                sx={{
                    padding: theme.spacing(1.5, 2),
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(12px)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}>
                    {isMobile && (
                        <IconButton
                            onClick={onOpenDrawer}
                            sx={{
                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                backdropFilter: "blur(8px)",
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    {conversation && (
                        <>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                variant="dot"
                                color={isConnected ? "success" : "error"}
                                sx={{
                                    "& .MuiBadge-dot": {
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        border: `2px solid ${theme.palette.background.paper}`,
                                    },
                                }}
                            >
                                <Avatar
                                    src={conversation.avatar || (otherParticipants[0]?.userId?.avatar)}
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        width: 44,
                                        height: 44,
                                        border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    }}
                                >
                                    {conversation.name?.[0] || otherParticipants[0]?.userId?.name?.[0] || '?'}
                                </Avatar>
                            </Badge>
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    {conversation.type === 'direct' && otherParticipants[0]?.userId ? (
                                        <Typography 
                                            variant="subtitle1" 
                                            fontWeight={700}
                                            onClick={() => {
                                                const userId = otherParticipants[0]?.userId?._id || otherParticipants[0]?.userId;
                                                if (userId) {
                                                    navigate(`/user/${userId}`);
                                                }
                                            }}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    color: theme.palette.primary.main,
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {conversation.name || otherParticipants[0]?.userId?.name || 'Unknown'}
                                        </Typography>
                                    ) : (
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {conversation.name || otherParticipants[0]?.userId?.name || 'Unknown'}
                                        </Typography>
                                    )}
                                    {conversation.type === 'group' && (
                                        <Chip label="Group" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                                    )}
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                    }}
                                >
                                    {conversation.type === 'group' 
                                        ? `${conversation.participantsCount || conversation.participants?.length || 0} members`
                                        : isConnected ? 'Online' : 'Offline'}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>

                <ButtonGroup variant="text" size="small">
                    <Tooltip title="Voice call">
                        <IconButton
                            onClick={handleCall}
                            sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            <CallIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Video call">
                        <IconButton
                            onClick={handleVideoCall}
                            sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            <VideoIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <ConversationSettingsButton
                        onClick={(e) => setSettingsAnchor(e.currentTarget)}
                        sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            },
                        }}
                    />
                </ButtonGroup>
            </Box>

            {/* Pinned Messages Banner */}
            {pinnedMessages.length > 0 && (
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        backgroundColor: alpha(theme.palette.warning.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        transition: theme.transitions.create(['background-color']),
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.warning.main, 0.15),
                        },
                    }}
                    onClick={() => setPinnedMessagesDialogOpen(true)}
                >
                    <PinIcon fontSize="small" color="warning" />
                    <Typography variant="caption" fontWeight={600} color="warning.main">
                        {pinnedMessages.length} pinned message{pinnedMessages.length > 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                        Click to view all
                    </Typography>
                </Box>
            )}

            {/* Messages area */}
            <Box
                ref={messagesContainerRef}
                className="custom-scrollbar"
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: theme.spacing(1.5, 2),
                    background: `linear-gradient(${alpha(theme.palette.background.default, 0.8)}, ${alpha(
                        theme.palette.background.default,
                        0.9
                    )})`,
                    backdropFilter: "blur(8px)",
                    position: 'relative',
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: theme.shape.borderRadius,
                    },
                }}
            >
                {messages.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No messages yet. Start the conversation!
                        </Typography>
                    </Box>
                ) : (
                    messages.map((message, index) => {
                        // Get sender info
                        const sender = message.senderId || message.sender;
                        const senderName = sender?.name || sender?.username || 'Unknown';
                        const senderAvatar = sender?.avatar;
                        
                        // Check if message is from current user (user is from top-level useSelector)
                        const isCurrentUser = sender?._id === user?._id || sender?.id === user?._id;
                        
                        // Show avatar if first message or different sender
                        const showAvatar = index === 0 || 
                            (messages[index - 1].senderId?._id || messages[index - 1].sender?.id) !== 
                            (message.senderId?._id || message.sender?.id);
                        
                        // Check if we should show date divider
                        const showDateDivider = shouldShowDateDivider(message, messages[index - 1]);
                        
                        // Get reply message
                        const replyMessage = message.replyTo ? getReplyMessage(
                            typeof message.replyTo === 'object' ? message.replyTo._id : message.replyTo
                        ) : null;
                        
                        // Get message content (now decrypted on backend)
                        const messageContent = message.content || '';
                        
                        // Format timestamp
                        const messageTime = formatTime(message.createdAt || message.timestamp);

                    return (
                        <Box key={`message-wrapper-${message._id || message.id || index}`}>
                            {/* Date Divider */}
                            {showDateDivider && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        my: 2,
                                    }}
                                >
                                    <Chip
                                        label={formatDate(message.createdAt || message.timestamp)}
                                        size="small"
                                        sx={{
                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                            backdropFilter: 'blur(8px)',
                                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                        }}
                                    />
                                </Box>
                            )}
                            
                            <motion.div
                                key={message._id || message.id || `message-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                layout
                                data-message-id={message._id || message.id}
                            >
                            <MessageContainer
                                sx={{
                                    justifyContent: isCurrentUser ? "end " : "start",
                                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                                }}
                            >
                                {showAvatar ? (
                                    <Avatar
                                        src={senderAvatar}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: theme.palette.primary.main,
                                            fontWeight: 600,
                                            border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
                                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                                        }}
                                    >
                                        {senderName[0]?.toUpperCase() || '?'}
                                    </Avatar>
                                ) : (
                                    <Box sx={{ width: 40, textAlign: "center" }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {messageTime}
                                        </Typography>
                                    </Box>
                                )}

                                <Box
                                    sx={{
                                        flex: 1,
                                        position: "relative",
                                        maxWidth: "80%",
                                    }}
                                    className="message-container"
                                >
                                    {showAvatar && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                mb: 0.5,
                                                flexDirection: isCurrentUser ? "row-reverse" : "row",
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                onClick={() => {
                                                    if (!isCurrentUser) {
                                                        const userId = sender?._id || sender?.id;
                                                        if (userId) {
                                                            navigate(`/user/${userId}`);
                                                        }
                                                    }
                                                }}
                                                sx={{
                                                    fontWeight: 600,
                                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                    WebkitBackgroundClip: "text",
                                                    WebkitTextFillColor: "transparent",
                                                    cursor: isCurrentUser ? 'default' : 'pointer',
                                                    '&:hover': {
                                                        textDecoration: isCurrentUser ? 'none' : 'underline',
                                                        opacity: isCurrentUser ? 1 : 0.8,
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {isCurrentUser ? 'You' : senderName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {messageTime}
                                            </Typography>
                                        </Box>
                                    )}

                                    {replyMessage && (
                                        <Box
                                            onClick={() => {
                                                // Scroll to replied message
                                                const replyElement = document.querySelector(`[data-message-id="${replyMessage._id || replyMessage.id}"]`);
                                                if (replyElement) {
                                                    replyElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    // Highlight briefly
                                                    replyElement.style.backgroundColor = alpha(theme.palette.primary.main, 0.2);
                                                    setTimeout(() => {
                                                        replyElement.style.backgroundColor = '';
                                                    }, 2000);
                                                }
                                            }}
                                            sx={{
                                                mb: 1,
                                                padding: theme.spacing(1),
                                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                borderRadius: theme.shape.borderRadius,
                                                borderLeft: `3px solid ${theme.palette.primary.main}`,
                                                cursor: 'pointer',
                                                transition: theme.transitions.create(['background-color']),
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                                },
                                            }}
                                        >
                                            <Typography 
                                                variant="caption" 
                                                color="primary" 
                                                fontWeight={600}
                                                sx={{ display: 'block', mb: 0.5 }}
                                            >
                                                {replyMessage.senderId?.name || 
                                                 replyMessage.sender?.name || 
                                                 replyMessage.senderId?.username ||
                                                 'Unknown'}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {replyMessage.content || 'Message'}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* chat content - Show edit input if editing, otherwise show message */}
                                    {editingMessageId === (message._id || message.id) ? (
                                        <EditMessageInput
                                            initialContent={messageContent}
                                            onSave={(newContent) => {
                                                onEditMessage(message._id || message.id, newContent);
                                                setEditingMessageId(null);
                                            }}
                                            onCancel={() => setEditingMessageId(null)}
                                        />
                                    ) : messageContent && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                                                marginBottom: theme.spacing(1),
                                            }}
                                        >
                                            <ChatBubble $iscurrentuser={isCurrentUser}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" color="text.primary">
                                                            {messageContent}
                                                        </Typography>
                                                        {message.isEdited && (
                                                            <Typography variant="caption" sx={{ 
                                                                display: 'block', 
                                                                mt: 0.5, 
                                                                fontStyle: 'italic',
                                                                opacity: 0.7 
                                                            }}>
                                                                (edited)
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    {message.pinned && (
                                                        <Tooltip title="Pinned message">
                                                            <PinIcon 
                                                                fontSize="small" 
                                                                sx={{ 
                                                                    color: theme.palette.warning.main,
                                                                    flexShrink: 0,
                                                                    mt: 0.5
                                                                }} 
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </ChatBubble>
                                        </Box>
                                    )}

                                    {/* Action button && reaction button  */}
                                    <ActionButtons
                                        sx={{
                                            right: isCurrentUser ? "auto" : theme.spacing(1),
                                            left: isCurrentUser ? theme.spacing(1) : "auto",
                                        }}
                                    >
                                        <Tooltip title="Add reaction">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => onReactionClick(e, message._id || message.id)}
                                                sx={{
                                                    "&:hover": {
                                                        color: theme.palette.primary.main,
                                                    },
                                                }}
                                            >
                                                <EmojiIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reply">
                                            <IconButton
                                                size="small"
                                                onClick={() => onReply(message._id || message.id)}
                                                sx={{
                                                    "&:hover": {
                                                        color: theme.palette.primary.main,
                                                    },
                                                }}
                                            >
                                                <ReplyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <MessageMenuButton
                                            onClick={(e) => {
                                                setMenuAnchor(e.currentTarget);
                                                setSelectedMessage(message);
                                            }}
                                            sx={{
                                                "&:hover": {
                                                    color: theme.palette.primary.main,
                                                },
                                            }}
                                        />
                                    </ActionButtons>

                                    {message.attachments && message.attachments.length > 0 && (
                                        <Box 
                                            sx={{ 
                                                mt: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: isCurrentUser ? "flex-end" : "flex-start",
                                                gap: 1,
                                            }}
                                        >
                                            {message.attachments.map((attachment, idx) => (
                                                <Box 
                                                    key={idx} 
                                                    sx={{ 
                                                        mb: 1,
                                                        maxWidth: "80%",
                                                        display: "flex",
                                                        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                                                    }}
                                                >
                                                    {attachment.type === "audio" || attachment.mimeType?.startsWith('audio/') ? (
                                                        <VoiceNotePlayer
                                                            attachment={attachment}
                                                            isCurrentUser={isCurrentUser}
                                                            theme={theme}
                                                            alpha={alpha}
                                                        />
                                                    ) : attachment.type === "image" || attachment.mimeType?.startsWith('image/') ? (
                                                        <Box
                                                            component={motion.img}
                                                            src={attachment.url}
                                                            alt={attachment.filename || attachment.name}
                                                            sx={{
                                                                maxWidth: "100%",
                                                                maxHeight: 300,
                                                                borderRadius: theme.shape.borderRadius * 2,
                                                                cursor: "pointer",
                                                                border: `1px solid ${alpha(
                                                                    theme.palette.divider,
                                                                    0.2
                                                                )}`,
                                                                boxShadow: `0 4px 12px ${alpha(
                                                                    theme.palette.primary.main,
                                                                    0.1
                                                                )}`,
                                                                // Align based on user
                                                                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                                                            }}
                                                            whileHover={{ scale: 1.02 }}
                                                            onError={(e) => {
                                                                e.target.src = "/abstract-colorful-swirls.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <Paper
                                                            component={motion.div}
                                                            whileHover={{ scale: 1.01 }}
                                                            sx={{
                                                                padding: theme.spacing(1.5),
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: theme.spacing(1),
                                                                backgroundColor: alpha(
                                                                    theme.palette.background.paper,
                                                                    0.8
                                                                ),
                                                                backdropFilter: "blur(8px)",
                                                                borderRadius: theme.shape.borderRadius * 2,
                                                                border: `1px solid ${alpha(
                                                                    theme.palette.divider,
                                                                    0.2
                                                                )}`,
                                                                maxWidth: "100%",
                                                                // Align based on user
                                                                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                                                            }}
                                                        >
                                                            <FileIcon color="primary" />
                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                <Typography variant="body2" noWrap>
                                                                    {attachment.filename || attachment.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {formatFileSize(attachment.size)}
                                                                </Typography>
                                                            </Box>
                                                        </Paper>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    {message.reactions && message.reactions.length > 0 && (() => {
                                        // Group reactions by emoji and count
                                        const reactionGroups = message.reactions.reduce((acc, reaction) => {
                                            const emoji = reaction.emoji;
                                            if (!acc[emoji]) {
                                                acc[emoji] = {
                                                    emoji,
                                                    count: 0,
                                                    users: [],
                                                    hasUserReacted: false,
                                                };
                                            }
                                            acc[emoji].count++;
                                            acc[emoji].users.push(reaction.userId);
                                            if (reaction.userId?._id === user?._id || reaction.userId === user?._id) {
                                                acc[emoji].hasUserReacted = true;
                                            }
                                            return acc;
                                        }, {});

                                        const groupedReactions = Object.values(reactionGroups);

                                        return (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 0.5,
                                                    mt: 1,
                                                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                                                }}
                                            >
                                                {groupedReactions.map((group, idx) => (
                                                    <Chip
                                                        key={`${group.emoji}-${idx}`}
                                                        label={`${group.emoji} ${group.count}`}
                                                        size="small"
                                                        variant={group.hasUserReacted ? "filled" : "outlined"}
                                                        onClick={() => onAddReaction(message._id || message.id, group.emoji)}
                                                        sx={{
                                                            "&.MuiChip-filled": {
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                                color: theme.palette.primary.main,
                                                                border: `1px solid ${theme.palette.primary.main}`,
                                                            },
                                                            "&.MuiChip-outlined": {
                                                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                                                backdropFilter: "blur(4px)",
                                                            },
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        );
                                    })()}
                                </Box>
                            </MessageContainer>
                        </motion.div>
                        </Box>
                    );
                    })
                )}
                <div ref={messagesEndRef} />
                
                {/* Scroll to bottom FAB */}
                <AnimatePresence>
                    {showScrollToBottom && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            style={{
                                position: 'absolute',
                                bottom: 80,
                                right: 20,
                                zIndex: 10,
                            }}
                        >
                            <Tooltip title="Scroll to bottom">
                                <IconButton
                                    onClick={() => {
                                        scrollToBottom();
                                        setNewMessagesCount(0);
                                    }}
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        color: 'white',
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                            transform: 'scale(1.1)',
                                        },
                                        transition: theme.transitions.create(['transform', 'background-color']),
                                    }}
                                >
                                    <SendIcon sx={{ transform: 'rotate(-90deg)' }} />
                                    {newMessagesCount > 0 && (
                                        <Badge
                                            badgeContent={newMessagesCount}
                                            color="error"
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                            }}
                                        />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Typing indicator - More visible with animation */}
                {typingUsers && typingUsers.length > 0 && (
                    <Box 
                        ref={typingIndicatorRef}
                        sx={{ 
                            px: 3, 
                            py: 1.5,
                            backgroundColor: alpha(theme.palette.background.paper, 0.95),
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            position: 'sticky',
                            bottom: 0,
                            zIndex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {/* Animated typing dots */}
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            {[0, 1, 2].map((i) => (
                                <TypingDot key={i} delay={i * 0.16} />
                            ))}
                        </Box>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontStyle: 'italic', fontWeight: 500 }}
                        >
                            {(() => {
                                if (typingUsers.length === 1) {
                                    // Try to get name, use fallback immediately
                                    const userId = typingUsers[0];
                                    const participant = conversation?.participants?.find(p => {
                                        const participantId = p.userId?._id || p.userId;
                                        return String(participantId) === String(userId);
                                    });
                                    const name = participant?.userId?.name || 
                                                participant?.userId?.username || 
                                                'Someone';
                                    return `${name} is typing...`;
                                } else {
                                    return `${typingUsers.length} people are typing...`;
                                }
                            })()}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Upload Progress */}
            {uploadProgress !== null && (
                <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                        height: 2,
                        "& .MuiLinearProgress-bar": {
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                    }}
                />
            )}

            {/* Reply Preview */}
            <AnimatePresence>
                {replyTo && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Box
                            sx={{
                                padding: theme.spacing(1, 2),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                                <ReplyIcon fontSize="small" color="primary" />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="caption" color="primary" fontWeight={600}>
                                        Replying to {(() => {
                                            const replyMsg = getReplyMessage(replyTo);
                                            return replyMsg?.senderId?.name || 
                                                   replyMsg?.sender?.name || 
                                                   replyMsg?.senderId?.username ||
                                                   'Unknown';
                                        })()}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary" 
                                        sx={{ 
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {(() => {
                                            const replyMsg = getReplyMessage(replyTo);
                                            const content = replyMsg?.content || '';
                                            return content.length > 40 ? content.substring(0, 40) + '...' : content;
                                        })()}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={onCancelReply}
                                sx={{
                                    "&:hover": {
                                        color: theme.palette.error.main,
                                    },
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* File Preview */}
            {selectedFiles.length > 0 && (
                <Box
                    sx={{
                        padding: theme.spacing(1, 2),
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Attachments ({selectedFiles.length})
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedFiles.map((file, index) => {
                            // Handle both File objects and metadata objects
                            const fileName = file.name || file.filename || 'Unknown';
                            const fileSize = file.size || 0;
                            const fileType = file.type || '';
                            
                            return (
                            <Chip
                                key={file.id || index}
                                label={`${fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName} (${formatFileSize(fileSize)})`}
                                onDelete={() => onRemoveFile(index)}
                                icon={fileType.startsWith("image/") ? <ImageIcon /> : <FileIcon />}
                                variant="outlined"
                                sx={{
                                    maxWidth: 200,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                    backdropFilter: "blur(4px)",
                                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                }}
                            />
                            );
                        })}
                    </Box>
                </Box>
            )}

            {/* Message Input */}
            <Box
                sx={{
                    position: "relative",
                    padding: theme.spacing(1.5, 2),
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(12px)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileSelect}
                        multiple
                        style={{ display: "none" }}
                        accept="image/*,application/*,text/*"
                    />

                    <Tooltip title="Attach file">
                        <IconButton
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            <AttachIcon color="primary" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isRecording ? "Stop recording" : "Record voice note"}>
                        <IconButton
                            onClick={() => {
                                if (isRecording) {
                                    stopRecording();
                                } else {
                                    startRecording();
                                }
                            }}
                            disabled={sendingMessage}
                            sx={{
                                backgroundColor: isRecording 
                                    ? alpha(theme.palette.error.main, 0.2)
                                    : alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                    backgroundColor: isRecording
                                        ? alpha(theme.palette.error.main, 0.3)
                                        : alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            {isRecording ? <StopIcon color="error" /> : <MicIcon color="primary" />}
                        </IconButton>
                    </Tooltip>

                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={newMessage}
                        onChange={(e) => onMessageChange(e.target.value)}
                        placeholder={replyTo ? "Reply..." : `Message ${otherParticipants[0]?.userId?.name || otherParticipants[0]?.userId?.username || ""}`}
                        variant="outlined"
                        size="small"
                        onKeyDown={onKeyDown}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                backdropFilter: "blur(8px)",
                                borderRadius: theme.shape.borderRadius * 2,
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                "&:hover": {
                                    borderColor: alpha(theme.palette.primary.main, 0.5),
                                },
                                "&.Mui-focused": {
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                            },
                        }}
                    />

                    {(isRecording || audioBlob || isProcessing) && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: "100%",
                                left: 0,
                                right: 0,
                                padding: theme.spacing(1.5, 2),
                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                backgroundColor: isRecording 
                                    ? alpha(theme.palette.error.main, 0.1)
                                    : alpha(theme.palette.primary.main, 0.1),
                                backdropFilter: "blur(12px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                mb: 1,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                                {isRecording && (
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: theme.palette.error.main,
                                            animation: "pulse 1.5s ease-in-out infinite",
                                            "@keyframes pulse": {
                                                "0%, 100%": { opacity: 1 },
                                                "50%": { opacity: 0.5 },
                                            },
                                        }}
                                    />
                                )}
                                <Typography variant="body2" fontWeight={600}>
                                    {formatDuration(recordingDuration)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton
                                    onClick={cancelRecording}
                                    sx={{
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                        "&:hover": {
                                            backgroundColor: alpha(theme.palette.error.main, 0.2),
                                        },
                                    }}
                                >
                                    <CancelIcon color="error" />
                                </IconButton>
                                <IconButton
                                    onClick={async () => {
                                        if (!audioBlob) {
                                            if (isProcessing) {
                                                showToast('Voice note is still processing. Please wait...', 'info');
                                            } else {
                                                showToast('Voice note not ready yet. Please wait a moment.', 'warning');
                                            }
                                            return;
                                        }
                                        
                                        try {
                                            // Convert blob to File
                                            const audioFile = new File(
                                                [audioBlob],
                                                `voice-note-${Date.now()}.webm`,
                                                { type: audioBlob.type || 'audio/webm' }
                                            );
                                            
                                            if (onSendVoiceNote) {
                                                await onSendVoiceNote(audioFile);
                                                cancelRecording();
                                            } else {
                                                console.error('onSendVoiceNote is not defined');
                                                showToast('Failed to send voice note', 'error');
                                            }
                                        } catch (error) {
                                            console.error('Error sending voice note:', error);
                                            showToast(error?.message || 'Failed to send voice note', 'error');
                                        }
                                    }}
                                    disabled={!audioBlob || recordingDuration < 1 || sendingMessage}
                                    sx={{
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        "&:hover": {
                                            backgroundColor: !audioBlob || recordingDuration < 1 || sendingMessage
                                                ? alpha(theme.palette.primary.main, 0.2)
                                                : alpha(theme.palette.primary.main, 0.3),
                                        },
                                    }}
                                >
                                    <SendIcon color="primary" />
                                </IconButton>
                            </Box>
                        </Box>
                    )}

                    <Tooltip title="Emoji">
                        <IconButton
                            onClick={onEmojiClick}
                            sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            <EmojiIcon color="primary" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Send message">
                        <span>
                            <IconButton
                                onClick={onSendMessage}
                                disabled={(!newMessage.trim() && selectedFiles.length === 0) || sendingMessage}
                                sx={{
                                    backgroundColor:
                                        !newMessage.trim() && selectedFiles.length === 0
                                            ? alpha(theme.palette.action.disabled, 0.1)
                                            : alpha(theme.palette.primary.main, 0.2),
                                    color:
                                        !newMessage.trim() && selectedFiles.length === 0
                                            ? theme.palette.text.disabled
                                            : theme.palette.primary.main,
                                    "&:hover": {
                                        backgroundColor:
                                            !newMessage.trim() && selectedFiles.length === 0
                                                ? alpha(theme.palette.action.disabled, 0.1)
                                                : alpha(theme.palette.primary.main, 0.3),
                                    },
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            </Box>

            {/* Emoji Pickers */}
            <EmojiPicker
                anchorEl={emojiAnchor}
                open={Boolean(emojiAnchor)}
                onClose={onEmojiClose}
                onEmojiSelect={onEmojiSelect}
            />

            <EmojiPicker
                anchorEl={reactionAnchor?.element || null}
                open={Boolean(reactionAnchor)}
                onClose={onReactionClose}
                onEmojiSelect={(emoji) => {
                    if (reactionAnchor) {
                        onAddReaction(reactionAnchor.messageId, emoji);
                    }
                }}
            />

            {/* Message Menu */}
            <MessageMenu
                message={selectedMessage}
                isCurrentUser={selectedMessage && (
                    (selectedMessage.senderId?._id || selectedMessage.senderId || selectedMessage.sender?.id) === user?._id
                )}
                anchorEl={menuAnchor}
                onClose={() => {
                    setMenuAnchor(null);
                    setSelectedMessage(null);
                }}
                onReply={(messageId) => {
                    onReply(messageId);
                    setMenuAnchor(null);
                }}
                onEdit={(messageId) => {
                    setEditingMessageId(messageId);
                    setMenuAnchor(null);
                }}
                onDelete={(messageId) => {
                    setDeletingMessageId(messageId);
                    setMenuAnchor(null);
                }}
                onPin={(messageId) => {
                    if (selectedMessage) {
                        const isPinned = selectedMessage.pinned || false;
                        onPinMessage?.(messageId, !isPinned);
                    }
                }}
                onCopy={() => {
                    showToast('Message copied to clipboard', 'success');
                }}
            />

            {/* Delete Message Dialog */}
            <DeleteMessageDialog
                open={!!deletingMessageId}
                onClose={() => setDeletingMessageId(null)}
                onConfirm={(deleteType) => {
                    if (deletingMessageId) {
                        // Convert 'forMe' to 'me', 'forEveryone' to 'everyone'
                        const deleteFor = deleteType === 'forMe' ? 'me' : 'everyone';
                        onDeleteMessage(deletingMessageId, deleteFor);
                        setDeletingMessageId(null);
                    }
                }}
                messageContent={(() => {
                    const msg = messages.find(m => (m._id || m.id) === deletingMessageId);
                    return msg?.content || '';
                })()}
            />

            {/* Conversation Settings Menu */}
            <ConversationSettingsMenu
                conversation={conversation}
                isMuted={conversation?.participants?.find(p => 
                    (p.userId?._id || p.userId) === user?._id
                )?.muted || false}
                isArchived={conversation?.archivedAt !== null}
                anchorEl={settingsAnchor}
                onClose={() => setSettingsAnchor(null)}
                onMute={(mute) => {
                    if (conversation?._id) {
                        onMuteConversation?.(conversation._id, mute);
                    }
                }}
                onArchive={(archive) => {
                    if (conversation?._id) {
                        onArchiveConversation?.(conversation._id, archive);
                    }
                }}
                onViewArchived={onViewArchived}
                onSearch={(query) => {
                    onSearchMessages?.(query);
                }}
                onViewInfo={() => {
                    // TODO: Show conversation info dialog
                    showToast('Conversation info coming soon', 'info');
                }}
                onDelete={() => {
                    // TODO: Implement delete conversation
                    showToast('Delete conversation coming soon', 'info');
                }}
            />

            {/* Pinned Messages Dialog */}
            <PinnedMessagesDialog
                open={pinnedMessagesDialogOpen}
                onClose={() => setPinnedMessagesDialogOpen(false)}
                pinnedMessages={pinnedMessages}
                conversation={conversation}
                onMessageClick={(message) => {
                    // Scroll to the pinned message
                    const element = document.querySelector(`[data-message-id="${message._id || message.id}"]`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        element.style.backgroundColor = alpha(theme.palette.warning.main, 0.2);
                        setTimeout(() => {
                            element.style.backgroundColor = '';
                        }, 2000);
                    }
                }}
            />
        </ChatContainer>
    );
}
