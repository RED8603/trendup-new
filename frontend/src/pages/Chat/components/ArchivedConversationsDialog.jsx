import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Avatar,
    IconButton,
    Tooltip,
    Chip,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Close as CloseIcon,
    Archive as ArchiveIcon,
    Unarchive as UnarchiveIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const MotionListItemButton = motion(ListItemButton);

/**
 * Archived Conversations Dialog
 * Shows all archived conversations with option to unarchive
 */
export default function ArchivedConversationsDialog({
    open,
    onClose,
    archivedConversations = [],
    onConversationSelect,
    onUnarchive,
}) {
    const theme = useTheme();
    const { user } = useSelector((state) => state.user);
    const currentUserId = user?._id;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '80vh',
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArchiveIcon color="warning" />
                    <Typography variant="h6" component="span">
                        Archived Conversations
                    </Typography>
                    {archivedConversations.length > 0 && (
                        <Chip 
                            label={archivedConversations.length} 
                            size="small" 
                            color="warning"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {archivedConversations.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <ArchiveIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography variant="body1" color="text.secondary">
                            No archived conversations
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Archive conversations to hide them from your inbox
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ py: 0 }}>
                        {archivedConversations.map((conversation) => {
                            // Get display name and avatar
                            let displayName = conversation.name || 'Unknown';
                            let displayAvatar = conversation.avatar;
                            
                            // For direct conversations, get the other participant
                            if (conversation.type === 'direct' && conversation.participants) {
                                const otherParticipant = conversation.participants.find(p => {
                                    const participantId = p.userId?._id || p.userId;
                                    return participantId && String(participantId) !== String(currentUserId);
                                });
                                if (otherParticipant?.userId) {
                                    displayName = otherParticipant.userId.name || otherParticipant.userId.username || 'Unknown';
                                    displayAvatar = otherParticipant.userId.avatar;
                                }
                            }

                            const lastMessage = conversation.lastMessage;
                            const lastMessageText = lastMessage?.content 
                                ? (lastMessage.content.length > 50 
                                    ? lastMessage.content.substring(0, 50) + '...' 
                                    : lastMessage.content)
                                : 'No messages yet';

                            const lastMessageTime = lastMessage?.createdAt
                                ? new Date(lastMessage.createdAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })
                                : '';

                            return (
                                <ListItem
                                    key={conversation._id}
                                    disablePadding
                                    sx={{ mb: 0.5 }}
                                    secondaryAction={
                                        <Tooltip title="Unarchive">
                                            <IconButton
                                                edge="end"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUnarchive?.(conversation._id);
                                                }}
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    },
                                                }}
                                            >
                                                <UnarchiveIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >
                                    <MotionListItemButton
                                        onClick={() => {
                                            onConversationSelect?.(conversation._id);
                                            onClose();
                                        }}
                                        sx={{
                                            py: 1.5,
                                            px: 2,
                                            borderRadius: 2,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            },
                                        }}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={displayAvatar}
                                                sx={{
                                                    bgcolor: theme.palette.primary.main,
                                                    width: 44,
                                                    height: 44,
                                                }}
                                            >
                                                {displayName[0]?.toUpperCase() || '?'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {displayName}
                                                    </Typography>
                                                    {conversation.type === 'group' && (
                                                        <Chip 
                                                            label="Group" 
                                                            size="small" 
                                                            sx={{ height: 18, fontSize: '0.65rem' }} 
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography
                                                        variant="caption"
                                                        component="span"
                                                        sx={{
                                                            color: theme.palette.text.secondary,
                                                            display: 'block',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {lastMessageText}
                                                    </Typography>
                                                    {lastMessageTime && (
                                                        <Typography
                                                            variant="caption"
                                                            component="span"
                                                            sx={{
                                                                color: alpha(theme.palette.text.secondary, 0.7),
                                                                fontSize: '0.7rem',
                                                            }}
                                                        >
                                                            {lastMessageTime}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </MotionListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

