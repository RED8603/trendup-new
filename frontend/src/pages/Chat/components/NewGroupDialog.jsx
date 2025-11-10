import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Avatar,
    Chip,
    InputAdornment,
    CircularProgress,
    Box,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { Search as SearchIcon, Check as CheckIcon } from '@mui/icons-material';
import { useSearchUsersQuery } from '@/api/slices/socialApi';
import { useDebounce } from '@/hooks/useDebounce';

export default function NewGroupDialog({ open, onClose, onCreateGroup }) {
    const theme = useTheme();
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    
    const { data, isLoading } = useSearchUsersQuery(
        { q: debouncedSearch, limit: 20 },
        { skip: !debouncedSearch || debouncedSearch.length < 2 }
    );

    const users = data?.data?.users || [];

    const handleToggleUser = (user) => {
        setSelectedUsers(prev => {
            const exists = prev.find(u => u._id === user._id);
            if (exists) {
                return prev.filter(u => u._id !== user._id);
            }
            return [...prev, user];
        });
    };

    const handleCreate = () => {
        if (groupName.trim() && selectedUsers.length > 0) {
            onCreateGroup({
                name: groupName.trim(),
                participantIds: selectedUsers.map(u => u._id),
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setGroupName('');
        setSelectedUsers([]);
        setSearchQuery('');
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: alpha(theme.palette.background.paper, 0.95),
                    backdropFilter: 'blur(16px)',
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    fontWeight: 700,
                }}
            >
                Create Group Chat
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    label="Group Name"
                    placeholder="Enter group name..."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {selectedUsers.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Selected ({selectedUsers.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedUsers.map((user) => (
                                <Chip
                                    key={user._id}
                                    label={user.name || user.username}
                                    onDelete={() => handleToggleUser(user)}
                                    avatar={<Avatar src={user.avatar} sx={{ width: 24, height: 24 }} />}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                <TextField
                    fullWidth
                    placeholder="Search users to add..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />
                
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : users.length === 0 && debouncedSearch ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No users found
                        </Typography>
                    </Box>
                ) : !debouncedSearch || debouncedSearch.length < 2 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Type at least 2 characters to search
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {users.map((user) => {
                            const isSelected = selectedUsers.some(u => u._id === user._id);
                            return (
                                <ListItem key={user._id} disablePadding>
                                    <ListItemButton onClick={() => handleToggleUser(user)}>
                                        <ListItemAvatar>
                                            <Avatar src={user.avatar} sx={{ bgcolor: theme.palette.primary.main }}>
                                                {user.name?.[0] || user.username?.[0] || '?'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.name || user.username}
                                            secondary={user.username && user.name ? `@${user.username}` : null}
                                        />
                                        {isSelected && <CheckIcon color="primary" />}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleCreate}
                    disabled={!groupName.trim() || selectedUsers.length === 0}
                >
                    Create Group
                </Button>
            </DialogActions>
        </Dialog>
    );
}

