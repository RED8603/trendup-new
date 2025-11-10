import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Avatar,
    InputAdornment,
    CircularProgress,
    Box,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useSearchUsersQuery } from '@/api/slices/socialApi';
import { useDebounce } from '@/hooks/useDebounce';

export default function NewConversationDialog({ open, onClose, onSelectUser }) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    
    const { data, isLoading } = useSearchUsersQuery(
        { q: debouncedSearch, limit: 20 },
        { skip: !debouncedSearch || debouncedSearch.length < 2 }
    );

    const users = data?.data?.users || [];

    const handleSelectUser = (user) => {
        onSelectUser(user);
        onClose();
        setSearchQuery('');
    };

    const handleClose = () => {
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
            <DialogTitle sx={{ 
                background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            }}>
                <Typography variant="h6" fontWeight={700}>
                    Start New Conversation
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search users by name or username..."
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
                    <List>
                        {users.map((user) => (
                            <ListItem key={user._id} disablePadding>
                                <ListItemButton onClick={() => handleSelectUser(user)}>
                                    <ListItemAvatar>
                                        <Avatar src={user.avatar} sx={{ bgcolor: theme.palette.primary.main }}>
                                            {user.name?.[0] || user.username?.[0] || '?'}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.name || user.username}
                                        secondary={user.username && user.name ? `@${user.username}` : null}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
}

