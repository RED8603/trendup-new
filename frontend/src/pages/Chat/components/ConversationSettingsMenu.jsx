import { useState } from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Typography,
    Box,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    NotificationsOff as MuteIcon,
    Notifications as UnmuteIcon,
    Archive as ArchiveIcon,
    Unarchive as UnarchiveIcon,
    Search as SearchIcon,
    Info as InfoIcon,
    Delete as DeleteIcon,
    Group as GroupIcon,
} from '@mui/icons-material';

/**
 * Conversation Settings Menu
 * Provides options to mute, archive, search, and manage conversation
 */
export default function ConversationSettingsMenu({
    conversation,
    isMuted = false,
    isArchived = false,
    anchorEl,
    onClose,
    onMute,
    onArchive,
    onSearch,
    onViewInfo,
    onViewArchived,
    onDelete,
}) {
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch?.(searchQuery.trim());
            setSearchQuery('');
            setSearchDialogOpen(false);
            onClose();
        }
    };

    const handleMute = () => {
        onMute?.(!isMuted);
        onClose();
    };

    const handleArchive = () => {
        onArchive?.(!isArchived);
        onClose();
    };

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
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
                        minWidth: 220,
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                }}
            >
                <MenuItem onClick={() => {
                    setSearchDialogOpen(true);
                }}>
                    <ListItemIcon>
                        <SearchIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Search messages</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleMute}>
                    <ListItemIcon>
                        {isMuted ? <UnmuteIcon fontSize="small" /> : <MuteIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText>{isMuted ? 'Unmute' : 'Mute'} notifications</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleArchive}>
                    <ListItemIcon>
                        {isArchived ? <UnarchiveIcon fontSize="small" /> : <ArchiveIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText>{isArchived ? 'Unarchive' : 'Archive'} conversation</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => {
                    onViewArchived?.();
                    onClose();
                }}>
                    <ListItemIcon>
                        <ArchiveIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View archived conversations</ListItemText>
                </MenuItem>

                <Divider />

                {conversation?.type === 'group' && (
                    <MenuItem onClick={() => {
                        onViewInfo?.();
                        onClose();
                    }}>
                        <ListItemIcon>
                            <GroupIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Group info</ListItemText>
                    </MenuItem>
                )}

                <MenuItem onClick={() => {
                    onViewInfo?.();
                    onClose();
                }}>
                    <ListItemIcon>
                        <InfoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Conversation info</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
                            onDelete?.();
                            onClose();
                        }
                    }}
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
                    <ListItemText>Delete conversation</ListItemText>
                </MenuItem>
            </Menu>

            {/* Search Dialog */}
            <Dialog
                open={searchDialogOpen}
                onClose={() => {
                    setSearchDialogOpen(false);
                    setSearchQuery('');
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle>Search Messages</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        placeholder="Search in conversation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        variant="outlined"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setSearchDialogOpen(false);
                        setSearchQuery('');
                    }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSearch}
                        variant="contained"
                        disabled={!searchQuery.trim()}
                    >
                        Search
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

/**
 * Settings Menu Button
 */
export function ConversationSettingsButton({ onClick, ...props }) {
    return (
        <Tooltip title="Conversation settings">
            <IconButton
                onClick={onClick}
                {...props}
            >
                <SettingsIcon />
            </IconButton>
        </Tooltip>
    );
}

