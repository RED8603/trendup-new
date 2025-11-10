import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    Divider,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Close as CloseIcon,
    PushPin as PinIcon,
    Reply as ReplyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Pinned Messages Dialog
 * Shows all pinned messages in a conversation
 */
export default function PinnedMessagesDialog({
    open,
    onClose,
    pinnedMessages = [],
    conversation,
    onMessageClick,
}) {
    const theme = useTheme();

    const handleMessageClick = (message) => {
        onMessageClick?.(message);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
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
                    <PinIcon color="warning" />
                    <Typography variant="h6" component="span">
                        Pinned Messages
                    </Typography>
                    {pinnedMessages.length > 0 && (
                        <Chip 
                            label={pinnedMessages.length} 
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
                {pinnedMessages.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <PinIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography variant="body1" color="text.secondary">
                            No pinned messages
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Pin important messages to find them quickly
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {pinnedMessages.map((message, index) => {
                            const sender = message.senderId || message.sender;
                            const senderName = sender?.name || sender?.username || 'Unknown';
                            const senderAvatar = sender?.avatar;
                            const messageTime = message.createdAt 
                                ? new Date(message.createdAt).toLocaleString([], { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })
                                : '';

                            return (
                                <motion.div
                                    key={message._id || message.id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <Box
                                        onClick={() => handleMessageClick(message)}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                            cursor: 'pointer',
                                            transition: theme.transitions.create(['background-color', 'transform']),
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                transform: 'translateX(4px)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Avatar
                                                src={senderAvatar}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: theme.palette.primary.main,
                                                }}
                                            >
                                                {senderName[0]?.toUpperCase() || '?'}
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {senderName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {messageTime}
                                                    </Typography>
                                                </Box>
                                                
                                                {message.replyTo && (
                                                    <Box
                                                        sx={{
                                                            mb: 1,
                                                            p: 1,
                                                            borderRadius: 1,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            borderLeft: `3px solid ${theme.palette.primary.main}`,
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                            <ReplyIcon fontSize="small" color="primary" />
                                                            <Typography variant="caption" color="primary" fontWeight={600}>
                                                                Replying to {message.replyTo.senderId?.name || 'Unknown'}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary" sx={{ 
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}>
                                                            {message.replyTo.content || 'Message'}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.primary"
                                                    sx={{
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {message.content || 'No content'}
                                                </Typography>
                                                
                                                {message.attachments && message.attachments.length > 0 && (
                                                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {message.attachments.map((att, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={att.filename || att.name || 'Attachment'}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </motion.div>
                            );
                        })}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

