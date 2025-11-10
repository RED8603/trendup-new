import { useState } from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Reply as ReplyIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PushPin as PinIcon,
    ContentCopy as CopyIcon,
    MoreVert as MoreIcon,
} from '@mui/icons-material';

/**
 * Message Menu Component
 * Context menu for message actions (reply, edit, delete, pin, copy)
 */
export default function MessageMenu({
    message,
    isCurrentUser,
    onReply,
    onEdit,
    onDelete,
    onPin,
    onCopy,
    anchorEl,
    onClose,
}) {
    // Guard: Don't render if no message
    if (!message) {
        return null;
    }

    const handleCopy = () => {
        if (message?.content) {
            navigator.clipboard.writeText(message.content);
            onCopy?.();
        }
        onClose();
    };

    const handleReply = () => {
        if (message?._id || message?.id) {
            onReply?.(message._id || message.id);
        }
        onClose();
    };

    const handleEdit = () => {
        if (message?._id || message?.id) {
            onEdit?.(message._id || message.id);
        }
        onClose();
    };

    const handleDelete = () => {
        if (message?._id || message?.id) {
            onDelete?.(message._id || message.id);
        }
        onClose();
    };

    const handlePin = () => {
        if (message?._id || message?.id) {
            onPin?.(message._id || message.id);
        }
        onClose();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && Boolean(message)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                sx: {
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
            }}
        >
            <MenuItem onClick={handleReply}>
                <ListItemIcon>
                    <ReplyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Reply</ListItemText>
            </MenuItem>

            {message?.content && (
                <MenuItem onClick={handleCopy}>
                    <ListItemIcon>
                        <CopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy text</ListItemText>
                </MenuItem>
            )}

            <MenuItem onClick={handlePin}>
                <ListItemIcon>
                    <PinIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{message?.pinned ? 'Unpin' : 'Pin'} message</ListItemText>
            </MenuItem>

            {isCurrentUser && (
                <>
                    <Divider />
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem 
                        onClick={handleDelete}
                        sx={{
                            color: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.dark',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </>
            )}
        </Menu>
    );
}

/**
 * MessageMenuButton - Button that opens the menu
 */
export function MessageMenuButton({ onClick, ...props }) {
    return (
        <Tooltip title="More options">
            <IconButton
                size="small"
                onClick={onClick}
                {...props}
            >
                <MoreIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}

