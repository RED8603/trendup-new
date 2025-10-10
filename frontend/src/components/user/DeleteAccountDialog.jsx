import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Box,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';
import MainButton from '@/components/common/MainButton/MainButton';
import { useDeleteAccountMutation } from '@/api/slices/userApi..js';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast.jsx';

const DeleteAccountDialog = ({ open, onClose }) => {
    const [confirmText, setConfirmText] = useState('');
    const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
    const { logout } = useAuth();
    const { showToast } = useToast();

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') {
            showToast('Please type DELETE to confirm', 'warning');
            return;
        }

        try {
            await deleteAccount().unwrap();
            showToast('Account deleted successfully', 'success');
            setTimeout(() => {
                logout();
            }, 1500);
        } catch (error) {
            showToast(error.data?.message || 'Failed to delete account', 'error');
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setConfirmText('');
            onClose();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: 'error.main',
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: 'error.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <WarningIcon />
                <Typography variant="h6" component="span">
                    Delete Account
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        This action cannot be undone!
                    </Typography>
                    <Typography variant="body2">
                        Your account will be permanently deactivated and your data will be anonymized.
                    </Typography>
                </Alert>

                <Typography variant="subtitle2" fontWeight={600} gutterBottom color="text.primary">
                    What will happen:
                </Typography>

                <List dense>
                    <ListItem>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: 'error.main' 
                            }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Your account will be deactivated"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: 'error.main' 
                            }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Your email and username will be anonymized"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: 'error.main' 
                            }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="You will be logged out immediately"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: 'error.main' 
                            }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="This action cannot be reversed"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                </List>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.primary" gutterBottom>
                        To confirm deletion, type <strong>DELETE</strong> below:
                    </Typography>
                    <TextField
                        fullWidth
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                        placeholder="Type DELETE to confirm"
                        disabled={isLoading}
                        error={confirmText && confirmText !== 'DELETE'}
                        helperText={confirmText && confirmText !== 'DELETE' ? 'Must type DELETE exactly' : ''}
                        sx={{ mt: 1 }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <MainButton
                    onClick={handleClose}
                    disabled={isLoading}
                    startIcon={<CancelIcon />}
                    sx={{ 
                        bgcolor: 'grey.700',
                        '&:hover': { bgcolor: 'grey.800' }
                    }}
                >
                    Cancel
                </MainButton>
                <MainButton
                    onClick={handleDelete}
                    disabled={isLoading || confirmText !== 'DELETE'}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />}
                    sx={{ 
                        bgcolor: 'error.main',
                        '&:hover': { bgcolor: 'error.dark' },
                        '&:disabled': { 
                            bgcolor: 'grey.500',
                            color: 'grey.300'
                        }
                    }}
                >
                    {isLoading ? 'Deleting...' : 'Delete Account'}
                </MainButton>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAccountDialog;

