import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Avatar,
    Badge,
    Chip,
    InputAdornment,
    IconButton,
    Tooltip,
    styled,
    alpha,
} from "@mui/material";
import { 
    Search as SearchIcon, 
    Bolt, 
    Verified, 
    Add as AddIcon, 
    GroupAdd as GroupAddIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

// Styled components with modern Web3 aesthetics
const MotionListItemButton = motion(ListItemButton);

const StatusBadge = ({ status, theme }) => {
    return styled(Box)(() => ({
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
            status === "online"
                ? theme.palette.success.main
                : status === "away"
                ? theme.palette.warning.main
                : status === "busy"
                ? theme.palette.error.main
                : theme.palette.text.disabled,
        border: `3px solid ${theme.palette.background.paper}`,
        boxShadow: `0 0 0 2px ${theme.palette.background.default}`,
    }));
};

const UserContainer = styled(Box)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: "blur(16px)",
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
}));

const Header = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 1.5),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 100%)`,
}));

const UserNameText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$isactive',
})(({ theme, $isactive }) => ({
    fontWeight: $isactive ? 700 : 600,
    background: $isactive
        ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        : "none",
    WebkitBackgroundClip: $isactive ? "text" : "none",
    WebkitTextFillColor: $isactive ? "transparent" : theme.palette.text.primary,
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
}));

export default function UserList({ 
    conversations = [],
    activeConversationId, 
    searchQuery, 
    onSearchChange, 
    onConversationSelect,
    onStartConversation,
    onNewChat,
    onNewGroup,
}) {
    const theme = useTheme();
    const { user } = useSelector((state) => state.user);
    const currentUserId = user?._id;
    
    // Filter conversations by search query (only active conversations)
    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        
        // Search in conversation name (for groups)
        if (conv.name && conv.name.toLowerCase().includes(query)) return true;
        
        // Search in participant names (for direct chats)
        if (conv.participants) {
            return conv.participants.some(p => 
                p.userId?.name?.toLowerCase().includes(query) ||
                p.userId?.username?.toLowerCase().includes(query)
            );
        }
        
        return false;
    });

    return (
        <UserContainer>
            {/* Header with Web3 styling */}
            <Header>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Bolt
                            sx={{
                                color: theme.palette.primary.main,
                                fontSize: "1.5rem",
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-0.5px",
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            TrendUp Chat
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="New Chat">
                            <IconButton
                                size="small"
                                onClick={onNewChat}
                                sx={{
                                    color: theme.palette.primary.main,
                                    "&:hover": {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    },
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="New Group">
                            <IconButton
                                size="small"
                                onClick={onNewGroup}
                                sx={{
                                    color: theme.palette.primary.main,
                                    "&:hover": {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    },
                                }}
                            >
                                <GroupAddIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Header>

            {/* Search with modern styling */}
            <Box sx={{ p: 2, pb: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon
                                    sx={{
                                        color: alpha(theme.palette.text.secondary, 0.8),
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            bgcolor: alpha(
                                theme.palette.mode === "dark"
                                    ? theme.palette.background.default
                                    : theme.palette.background.paper,
                                0.7
                            ),
                            borderRadius: "12px",
                            color: theme.palette.text.primary,
                            transition: theme.transitions.create(["border-color", "box-shadow"]),
                            "& fieldset": {
                                borderColor: alpha(theme.palette.divider, 0.3),
                            },
                            "&:hover fieldset": {
                                borderColor: alpha(theme.palette.primary.light, 0.5),
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: theme.palette.primary.main,
                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
                            },
                        },
                    }}
                />
            </Box>

            {/* Users List with modern styling */}
            <Box
                sx={{
                    flex: 1,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: "6px",
                    },
                    p: 1,
                }}
            >
                <List sx={{ py: 0 }}>
                    {filteredConversations.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery ? 'No conversations found' : 'No conversations yet'}
                            </Typography>
                        </Box>
                    ) : (
                        filteredConversations.map((conversation) => {
                            const isActive = activeConversationId === conversation._id;
                            const unreadCount = conversation.unreadCount || 0;
                            
                            // Get display name and avatar
                            let displayName = conversation.name || 'Unknown';
                            let displayAvatar = conversation.avatar;
                            let displayStatus = 'offline';
                            
                            // For direct conversations, get the other participant
                            if (conversation.type === 'direct' && conversation.participants) {
                                // Find the other participant (not current user)
                                const otherParticipant = conversation.participants.find(p => {
                                    const participantId = p.userId?._id || p.userId;
                                    return participantId && String(participantId) !== String(currentUserId);
                                });
                                if (otherParticipant?.userId) {
                                    displayName = otherParticipant.userId.name || otherParticipant.userId.username || 'Unknown';
                                    displayAvatar = otherParticipant.userId.avatar;
                                    // TODO: Get real online status from socket
                                    displayStatus = 'online';
                                } else {
                                }
                            }
                            
                            // Get last message preview
                            const lastMessage = conversation.lastMessage;
                            let lastMessageText = '';
                            if (lastMessage) {
                                if (typeof lastMessage === 'object') {
                                    // Use content if available (now decrypted on backend)
                                    if (lastMessage.content) {
                                        lastMessageText = lastMessage.content.length > 50 
                                            ? lastMessage.content.substring(0, 50) + '...'
                                            : lastMessage.content;
                                    } else if (lastMessage.encryptedContent) {
                                        lastMessageText = 'Message';
                                    }
                                } else if (typeof lastMessage === 'string') {
                                    lastMessageText = lastMessage.substring(0, 50);
                                }
                            }
                            
                            // Format last message time
                            const lastMessageTime = conversation.lastMessageAt 
                                ? new Date(conversation.lastMessageAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })
                                : '';

                            return (
                                <ListItem 
                                    key={conversation._id} 
                                    disablePadding 
                                    sx={{ 
                                        p: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <MotionListItemButton
                                        onClick={() => onConversationSelect(conversation._id)}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        sx={{
                                            py: 1.25,
                                            px: 1.5,
                                            borderRadius: "10px",
                                            flex: 1,
                                            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : "transparent",
                                            border: `1px solid ${
                                                isActive
                                                    ? alpha(theme.palette.primary.main, 0.3)
                                                    : alpha(theme.palette.divider, 0.15)
                                            }`,
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                borderColor: alpha(theme.palette.primary.main, 0.4),
                                            },
                                        }}
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2 },
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                variant="dot"
                                                color={displayStatus === "online" ? "success" : "default"}
                                            >
                                                <Avatar
                                                    src={displayAvatar}
                                                    sx={{
                                                        bgcolor: theme.palette.primary.main,
                                                        width: 40,
                                                        height: 40,
                                                        fontSize: "0.95rem",
                                                        fontWeight: 700,
                                                        border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
                                                        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                    }}
                                                >
                                                    {displayName[0]?.toUpperCase() || '?'}
                                                </Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <UserNameText variant="body1" component="span" $isactive={isActive}>
                                                            {displayName}
                                                        </UserNameText>
                                                        {conversation.type === 'group' && (
                                                            <Chip 
                                                                label="Group" 
                                                                size="small" 
                                                                sx={{ 
                                                                    height: 18, 
                                                                    fontSize: '0.65rem' 
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    {unreadCount > 0 && (
                                                        <Chip
                                                            label={unreadCount}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: theme.palette.error.main,
                                                                color: theme.palette.error.contrastText,
                                                                height: 22,
                                                                fontSize: "0.7rem",
                                                                minWidth: 22,
                                                                fontWeight: 700,
                                                                boxShadow: `0 2px 4px ${alpha(
                                                                    theme.palette.error.main,
                                                                    0.3
                                                                )}`,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    {lastMessageText && (
                                                        <Typography
                                                            variant="caption"
                                                            component="span"
                                                            sx={{
                                                                color: theme.palette.text.secondary,
                                                                display: "block",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            {lastMessageText}
                                                        </Typography>
                                                    )}
                                                    {lastMessageTime && (
                                                        <Typography
                                                            variant="caption"
                                                            component="span"
                                                            sx={{
                                                                color: alpha(theme.palette.text.secondary, 0.7),
                                                                fontSize: "0.7rem",
                                                                display: "block",
                                                            }}
                                                        >
                                                            {lastMessageTime}
                                                        </Typography>
                                                    )}
                                                </>
                                            }
                                        />
                                    </MotionListItemButton>
                                </ListItem>
                            );
                        })
                    )}
                </List>
            </Box>
        </UserContainer>
    );
}
